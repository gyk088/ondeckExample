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

    // инициализируем глобальные модули
    this._initGlobalModules()

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
      // Вызываем диспатчер для текущего модуля
      this.$$currentModule.obj.dispatcher(module, state)
      // Вызываем диспатчеры для всторенных модулей
      Object
        .keys(this.$$currentModule.obj.$$embed)
        .forEach(name => this.$$currentModule.obj.$$embed[name].dispatcher(module, state))
      // Вызываем диспатчеры для глобальных модулей
      Object
        .keys(this.$$modules)
        .forEach(key => this.$$modules[key].$$global && this.$$modules[key].dispatcher(module, state))
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

  _initGlobalModules () {
    Object.keys(this.$$config.modules)
      .filter(moduleName => this.$$config.modules[moduleName].global)
      .forEach(moduleName => this._createModule(moduleName, this.$$config.modules[moduleName]))
  }

  /**
   * this method creates all modules object
   * создаем все модули из конфига
   */
  _createModule = async (moduleName, moduleConf) => {
    // Если уже подгрузили module - выходим
    if (this.$$modules[moduleName]) return

    let moduleClass;
    try {
      moduleClass = await import("../modules/" + moduleConf.module + ".js")
      if (!moduleClass.default) {
        throw new SyntaxError(`Error export default in  ${moduleName}`);
      }
      moduleClass = moduleClass.default
    } catch (e) {
      throw e;
    }

    // создаем модуль
    this.$$modules[moduleName] = new moduleClass()
    // глобальный модуль
    this.$$modules[moduleName].$$global = moduleConf.global
    // добавляем метод rout для маршрутизации
    this.$$modules[moduleName].$$rout = this.$$rout.bind(this)
    // добавляем метод  publish для публикации глобальных событий
    this.$$modules[moduleName].$$publish = this.$$publish.bind(this)
    // конфиг
    this.$$modules[moduleName].$$config = this.$$config
    // макет модуля
    this.$$modules[moduleName].$$layoutName = moduleConf.layout
    // встраиваемые модули
    this.$$modules[moduleName].$$embed = {}

    if (moduleConf.embed) {
      const embedNames = Object.keys(moduleConf.embed);

      for (let i = 0; i < embedNames.length; i++) {
        let embedClass;
        try {
          embedClass = await import("../modules/" + moduleConf.embed[embedNames[i]].module + ".js")
          if (!embedClass.default) {
            throw new SyntaxError(`Error export default in  ${embedNames[i]}`);
          }
          embedClass = embedClass.default
        } catch (e) {
          throw e;
        }

        this.$$modules[moduleName].$$embed[embedNames[i]] = new embedClass()
        this.$$modules[moduleName].$$embed[embedNames[i]].$$rout = this.$$rout.bind(this)
        this.$$modules[moduleName].$$embed[embedNames[i]].$$publish = this.$$publish.bind(this)
        this.$$modules[moduleName].$$embed[embedNames[i]].$$publish.$$config = this.$$config
      }
    }

    // Если модуль глобальный - сразу его инициализируем
    this.$$modules[moduleName].$$global && this.$$modules[moduleName].init(moduleName)
  }

  /**
  * this method creates all layouts object
  * создаем все макеты из конфига
  */
  _createLayout = async (layoutName) => {
    // Если уже подгрузили layout - выходим
    if (this.$$layouts[layoutName]) return

    let layoutClass;
    try {
      layoutClass = await import("../modules/" + layoutName + ".js")
      if (!layoutClass.default) {
        throw new SyntaxError(`Error export default in  ${layoutName}`);
      }
      layoutClass = layoutClass.default
    } catch (e) {
      throw e;
    }

    // создаем макет
    this.$$layouts[layoutName] = new layoutClass()
    // добавляем метод rout для маршрутизации
    this.$$layouts[layoutName].$$rout = this.$$rout.bind(this)
    // добавляем метод  publish для публикации глобальных событий
    this.$$layouts[layoutName].$$publish = this.$$publish.bind(this)
    // конфиг
    this.$$layouts[layoutName].$$config = this.$$config
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
  _initModule = async (moduleData) => {
    let moduleName = moduleData.module[0]

    const mudules = this.$$config.modules;

    if (!moduleName) {
      this.$$rout({
        path: this.$$config.mainModule
      })
      return;
    }
    this.$$config
    if (!mudules[moduleName]) {
      this.$$rout({
        path: this.$$config.module404
      })
      return console.error("no such module:", moduleName)
    }

    // Если это глобальный или встраиваемый модуль - они не учавствует в роутинге
    if (mudules[moduleName].global) {
      this.$$rout({
        path: this.$$config.module404
      })
      return console.error("global module:", moduleName)
    }

    // Создаем макет если он есть
    if (
      mudules[moduleName].layout &&
      mudules[moduleName].layout === this.$$currentLayout.name
    ) {
      // Если переход внутри текущего макета
      this.$$currentLayout.obj.dispatcher(moduleData.module, moduleData.state)
    } else if (mudules[moduleName].layout) {

      this._destroyModule()
      this._destroyLayout()

      // Если переход на новый макет то чистим модуль а потом макет
      try {
        await this._createLayout(mudules[moduleName].layout)
      } catch (e) {
        console.error(e)
      }
      // Cохраняем новый модуль в объекте currentModule
      this.$$currentLayout = {
        name: mudules.layout,
        obj: this.$$layouts[mudules[moduleName].layout]
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

      // Если переход на новый макет то чистим модуль а потом макет
      try {
        await this._createModule(moduleName, mudules[moduleName])
      } catch (e) {
        console.error(e)
      }

      // Cохраняем новый модуль в объекте currentModule
      this.$$currentModule = {
        name: moduleName,
        obj: this.$$modules[moduleName],
      }

      // Инициализируем новый модуль (вызываем метод init)
      this.$$currentModule.obj.init(moduleData.module, moduleData.state)
      // Инициализируем встроенные модули
      Object.keys(this.$$currentModule.obj.$$embed)
        .forEach(name =>
          this.$$currentModule.obj.$$embed[name].init(moduleData.module, moduleData.state)
        )

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