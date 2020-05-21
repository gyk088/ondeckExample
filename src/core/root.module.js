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
    // this object contains all mediator events
    // объект содержит все события медитора
    this.$$сhannels = {}
    // this object contains current module
    // объект с текущим модулем
    this.$$currentModule = {}

    // состояние по указоннму url (если не используем history api)
    this.$$urlState = {}

    // cоздаем все модули
    this.$$createModules()
    // вызываем глобаьное событие popstate
    this.$$eventHandler()

    const module = this._getModuleFromUrl(this.$$config.historyApi ? document.location.pathname : document.location.hash)

    this.init({
      module: module,
      path: document.location.pathname
    })

    // сurrent module initialization
    this.$$initModule({
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
  * Get module names and data from url
  *
  * получаем название модуля и данные модуля url адреса,
  * @param {String} url - url address
  */
  _getModuleFromUrl (url) {
    console.log()
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
  $$createModules () {
    if (!isEmpty(this.$$modules)) return

    Object.keys(this.$$config.modules).forEach(key => {
      if (!this.$$config.modules[key].hidden) {
        // создаем модуль
        this.$$modules[key] = new this.$$config.modules[key].class()
        // добавляем метод rout для маршрутизации
        this.$$modules[key].$$rout = this.$$rout.bind(this)
        // добавляем метод  publish для публикации глобальных событий
        this.$$modules[key].$$publish = this.$$publish.bind(this)
      }
    })
  }

  /**
   * this method creates a global event popstate
   * глобальный обработчик событий
   */
  $$eventHandler () {
    if (this.$$config.historyApi) {
      window.addEventListener("popstate", event =>
        this.$$initModule({
          module: this._getModuleFromUrl(document.location.pathname),
          path: document.location.pathname,
          state: event.state
        })
      )
    } else {
      window.addEventListener("hashchange", event =>
        this.$$initModule({
          module: this._getModuleFromUrl(document.location.hash),
          path: document.location.hash,
          state: this.$$urlState[document.location.hash.replace(/^#/, '')]
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
  $$initModule (moduleData) {
    let moduleName = moduleData.module[0]

    if (!moduleName) {
      this.$$rout({
        path: this.$$config.mainModule
      })
      return;
    }

    if (!this.$$modules[moduleName])
      return console.error("no such module:", moduleName)

    // Если переход внутри текущего модуля - вызываем диспатчер модуля
    if (
      this.$$currentModule.name &&
      this.$$currentModule.name === moduleName
    ) {
      // Если переход внутри текущего модуля - вызываем диспатчер модуля (метода dispatcher)
      this.$$currentModule.obj.dispatcher(moduleData.module, moduleData.state)
    } else {
      // Если переход на новый модуль - вызываем деструктор текущего модуля (метод destroy)
      this.$$currentModule.obj && this.$$currentModule.obj.destroy()
      // Cохраняем новый модуль в объекте currentModule
      this.$$currentModule = {
        name: moduleName,
        obj: this.$$modules[moduleName]
      }

      // Инициализируем новый модуль (вызываем метод init)
      this.$$currentModule.obj.init(moduleData.module, moduleData.state)
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
    this.moduleMounted()
  }

  /**
   * publish event
   * @param {string} channel - event name.
   */
  $$publish (channel) {
    if (!this.$$сhannels[channel]) return false
    let args = Array.prototype.slice.call(arguments, 1)

    this.$$сhannels[channel].forEach(subscription => {
      subscription.callback.apply(subscription.context, args)
    })
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
      this.$$initModule({
        module: this._getModuleFromUrl(path),
        path: path,
        state: routData.state,
        pushState: true
      })
    } else {
      // Если не используем - то сохраняем состояние, и переходим по нужному пути
      // Далее вызовится событие "hashchange" - в котором и произойдет вызов метода initModule
      this.$$urlState[path] = routData.state
      document.location.hash = path
    }

  }

  /**
   * subscribe to an event
   * @param {Object} module - module object.
   * @param {string} channel - event name.
   * @param {function} cb - callback function.
   */
  $$subscribe (module, channel, cb) {
    if (!this.$$сhannels[channel]) this.$$сhannels[channel] = []
    this.$$сhannels[channel].push({ context: module, callback: cb })
  }
}