import { isEmpty } from "./helpers"
/**
 * this is the parent class for the main application module.
 * родительсикй класс для главного модуля приложения
 */
export default class RootMediator {
  /**
   * this is constructor
   * конструктор
   * @param {Object} config  config object
   */
  constructor(config) {
    // this object contains config object
    // конфиг, доступен в каждом модуле
    this.$$config = config
    // this object contains all modules
    // объек содержит все модули приложения
    this.$$modules = {}
    // this object contains all layouts
    // объек содержит все макеты приложения
    this.$$layouts = {}
    // this object contains current module
    // объект с текущим модулем
    this.$$currentModule = {}
    // this object contains current layout
    // объект с текущим макетом
    this.$$currentLayout = {}

    // this object contains all mediator events
    // объект содержит все события медитора
    this._сhannels = {}

    // состояние по указоннму url (если не используем history api)
    this._urlState = {}

    // cоздаем все макеты
    this._createLayout()

    // cоздаем все модули
    this._createModules()

    // вызываем глобаьное событие popstate
    this._eventHandler()

    const module = this._getModuleFromUrl(this.$$config.historyApi ? document.location.pathname : document.location.hash)

    this.init({
      module: module,
      path: document.location.pathname
    })

    // сurrent module initialization
    this._initModule({
      module: module,
      path: document.location.pathname
    })
  }

  /**
   * this method must be overridden by sub class.
   * should call eventHandler
   *
   * Метод инициализации главного модуля
   * @abstract
   * @param {Object} initObj - object to initialize the application
   */
  init (initObj) { }

  /**
   * this method must be overridden by sub class.
   * should contain all events
   *
   * обработчик событий
   * @abstract
   */
  eventHandler () { }

  /**
  * Called immediately after mounting
  * child module to the root module
  * The method must be overridden in the Root module.
  *
  * метод жиненого цикла , вызывается после того как модуль смотнирован,
  * в этом методе доступен объект currentModule
  * @abstract
  */
  moduleMounted () { }

  /**
   * publish event
   * @param {string} channel - event name.
   */
  $$publish (channel) {
    if (!this._сhannels[channel]) return false
    let args = Array.prototype.slice.call(arguments, 1)
    this._сhannels[channel].forEach(cb => cb(args))
  }

  /**
   * @param {Object} routData - object contains url and state.
   * @param {string} routData.path  - url, first element module name.
   * @param {Object} routData.state - state passed from the module.
   */
  $$rout (routData) {
    let path = this.$$config.rootPath ? this.$$config.rootPath + routData.path : routData.path
    // Удалем двойные '//'
    path = path.replace(/\/\//, '/')
    if (this.$$config.historyApi) {
      // Если используем history Api - вызываем инициализацию модуля
      this._initModule({
        module: this._getModuleFromUrl(path),
        path: path,
        state: routData.state,
        pushState: true
      })
    } else {
      // Если не используем - то сохраняем состояние, и переходим по нужному пути
      // Далее вызовится событие "hashchange" - в котором и произойдет вызов метода initModule
      this._urlState[path] = routData.state
      document.location.hash = path
    }

  }

  /**
   * subscribe to an event
   * @param {Object} module - module object.
   * @param {string} channel - event name.
   * @param {function} cb - callback function.
   */
  $$subscribe (channel, cb) {
    if (!this._сhannels[channel]) this._сhannels[channel] = []
    this._сhannels[channel].push(cb)
  }

  /**
  * Called immediately after mounting
  * child module to the root module
  * The method must be overridden in the Root module.
  *
  * метод жиненого цикла , вызывается после того как модуль смотнирован,
  * в этом методе доступен объект currentModule
  */
  _mounted () {
    this.moduleMounted()
    this.$$currentLayout.obj && this.$$currentLayout.obj.mounted(this.$$currentModule, this.$$currentLayout)
    if (this.$$currentModule.obj) {
      this.$$currentModule.obj.mounted(this.$$currentModule, this.$$currentLayout)
      Object
        .keys(this.$$currentModule.obj.$$embed)
        .forEach(name => this.$$currentModule.obj.$$embed[name].mounted(this.$$currentModule, this.$$currentLayout))
    }
  }

  /**
  * сurrent module destroy
  * уничтожение текущего модуля
  */
  _destroyModule () {
    // Если переход на новый макет то чистим модуль а потом макет
    console.log("destroy", this.$$currentModule)
    if (this.$$currentModule.obj) {
      console.log("destroy", this.$$currentModule.name)
      this.$$currentModule.obj.destroy()
      Object
        .keys(this.$$currentModule.obj.$$embed)
        .forEach(name => this.$$currentModule.obj.$$embed[name].destroy())
      this.$$currentModule = {}
    }
  }

  /**
  * сurrent Layout destroy
  * уничтожение текущего макета
  */
  _destroyLayout () {
    if (this.$$currentLayout.obj) {
      this.$$currentLayout.obj.destroy()
      this.$$currentLayout = {}
    }
  }

  /**
  * сurrent module dispatcher
  * вызываем диспатчер у текущего модуля
  * @param {Array} module - url array
  * @param {Object} state - current state
  */
  _dispatcherModule (module, state) {
    // Если переход на новый макет то чистим модуль а потом макет
    if (this.$$currentModule.obj) {
      this.$$currentModule.obj.dispatcher(module, state)
      Object
        .keys(this.$$currentModule.obj.$$embed)
        .forEach(name => this.$$currentModule.obj.$$embed[name].dispatcher(module, state))
    }
  }

  /**
  * Get module names and data from url
  * получаем название модуля и данные модуля url адреса,
  * @param {String} url - url address
  */
  _getModuleFromUrl (url) {
    // Удалем ненужный нам путь
    if (this.$$config.rootPath) {
      url = url.replace(this.$$config.rootPath, '')
    }
    // Удалем первый '/' и #
    url = url.replace(/^[\/, #]/, '')

    return url.split("/")
  }

  /**
   * this method creates all modules object
   * создаем все модули из конфига
   */
  _createModules () {
    if (!isEmpty(this.$$modules)) return

    Object.keys(this.$$config.modules).forEach(key => {
      // создаем модуль
      this.$$modules[key] = new this.$$config.modules[key].module()
      // добавляем метод rout для маршрутизации
      this.$$modules[key].$$rout = this.$$rout.bind(this)
      // добавляем метод  publish для публикации глобальных событий
      this.$$modules[key].$$publish = this.$$publish.bind(this)
      // конфиг
      this.$$modules[key].$$config = this.$$config
      // встраиваемые модули
      this.$$modules[key].$$embed = {}

      if (this.$$config.modules[key].embed) {
        this.$$modules[key].$$embed
        Object.keys(this.$$config.modules[key].embed).forEach(embedName => {
          this.$$modules[key].$$embed[embedName] = new this.$$config.modules[key].embed[embedName].module()
          this.$$modules[key].$$embed[embedName].$$rout = this.$$rout.bind(this)
          this.$$modules[key].$$embed[embedName].$$publish = this.$$publish.bind(this)
          this.$$modules[key].$$embed[embedName].$$publish.$$config = this.$$config
        })
      }
      if (this.$$config.modules[key].layout) {
        // макет модуля
        this.$$modules[key].$$layoutName = this.$$config.modules[key].layout.name
      }
    })
  }

  /**
  * this method creates all layouts object
  * создаем все макеты из конфига
  */
  _createLayout () {
    if (!isEmpty(this.$$layouts)) return

    Object.keys(this.$$config.modules).forEach(key => {
      if (this.$$config.modules[key].layout) {
        const name = this.$$config.modules[key].layout.name
        // создаем мает
        this.$$layouts[name] = new this.$$config.modules[key].layout()
        // добавляем метод rout для маршрутизации
        this.$$layouts[name].$$rout = this.$$rout.bind(this)
        // добавляем метод  publish для публикации глобальных событий
        this.$$layouts[name].$$publish = this.$$publish.bind(this)
        // конфиг
        this.$$layouts[name].$$config = this.$$config
      }
    })
  }

  /**
   * this method creates a global event popstate
   * глобальный обработчик событий
   */
  _eventHandler () {
    if (this.$$config.historyApi) {
      window.addEventListener("popstate", event =>
        this._initModule({
          module: this._getModuleFromUrl(document.location.pathname),
          path: document.location.pathname,
          state: event.state
        })
      )
    } else {
      window.addEventListener("hashchange", event =>
        this._initModule({
          module: this._getModuleFromUrl(document.location.hash),
          path: document.location.hash,
          state: this._urlState[document.location.hash.replace(/^#/, '')]
        })
      )
    }
  }

  /**
   * сurrent module initialization
   * инициализация текущего модуля
   * @param {Object} moduleData - initn module data.
   * @param {string} moduleData.module - module name.
   * @param {string} moduleData.path - url.
   * @param {Object} moduleData.state - current state.
   * @param {boolean} moduleData.pushState - flag indicates save to history api.
   */
  _initModule (moduleData) {
    let moduleName = moduleData.module[0]

    if (!moduleName) {
      this.$$rout({
        path: this.$$config.mainModule
      })
      return;
    }

    if (!this.$$modules[moduleName]) {
      this.$$rout({
        path: this.$$config.module404
      })
      return console.error("no such module:", moduleName)
    }

    // Если это глобальный или встраиваемый модуль - они не учавствует в роутинге
    if (this.$$modules[moduleName].global || this.$$modules[moduleName].embed) {
      return console.error("embed or global module:", moduleName)
    }

    // Создаем макет если он есть
    if (
      this.$$modules[moduleName].$$layoutName &&
      this.$$modules[moduleName].$$layoutName === this.$$currentLayout.name
    ) {
      // Если переход внутри текущего макета
      this.$$currentLayout.obj.dispatcher(moduleData.module, moduleData.state)
    } else if (this.$$modules[moduleName].$$layoutName) {
      // Если переход на новый макет то чистим модуль а потом макет
      this._destroyModule()
      this._destroyLayout()

      // Cохраняем новый модуль в объекте currentModule
      this.$$currentLayout = {
        name: this.$$modules[moduleName].$$layoutName,
        obj: this.$$layouts[this.$$modules[moduleName].$$layoutName]
      }
      // Инициализируем новый макет (вызываем метод init)
      this.$$currentLayout.obj.init(moduleData.module, moduleData.state)
    } else {
      // Если у модуля нет макета - уничтожаем текущий макет
      this._destroyModule()
      this._destroyLayout()
    }

    // Если переход внутри текущего модуля - вызываем диспатчер модуля
    if (
      this.$$currentModule.name &&
      this.$$currentModule.name === moduleName
    ) {
      // Если переход внутри текущего модуля - вызываем диспатчер модуля (метода dispatcher)
      this._dispatcherModule(moduleData.module, moduleData.state)
    } else {
      // Если переход на новый модуль - вызываем деструктор текущего модуля (метод destroy)
      this._destroyModule()
      // Cохраняем новый модуль в объекте currentModule
      this.$$currentModule = {
        name: moduleName,
        obj: this.$$modules[moduleName],
      }

      // Инициализируем новый модуль (вызываем метод init)
      this.$$currentModule.obj.init(moduleData.module, moduleData.state)
      // Инициализируем встроенные модули
      Object.keys(this.$$currentModule.obj.$$embed).forEach(name => this.$$currentModule.obj.$$embed[name].init(moduleData.module, moduleData.state))

      this._dispatcherModule(moduleData.module, moduleData.state)
    }

    // Если используем history api - сохраняем новое состояние в истоии браузера
    if (moduleData.pushState && this.$$config.historyApi) {
      window.history.pushState(
        moduleData.state,
        moduleName,
        moduleData.path,
      )
    }
    // Вызываем метод жизненого цикла
    // в этом   методе у нас есть доступ к  this.$$currentModule
    this._mounted()
  }


}