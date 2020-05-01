import { isEmpty, parseUrl } from "./helpers"
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

    // cоздаем все модули
    this.$$createModules()
    // вызываем глобаьное событие popstate
    this.$$eventHandler()

    const module = this._getModuleFromUrl(document.location.pathname, this.$$config.rootPath)

    this.init({
      module: module,
      path: document.location.pathname,
      state: history.state
    })

    // сurrent module initialization
    this.$$initModule({
      module: module,
      path: document.location.pathname,
      state: history.state
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
    let path = url || document.location.pathname
    // Удалем ненужный нам путь
    if (this.$$config.rootPath) {
      path = path.replace(this.$$config.rootPath, '')
    }
    // Удалем первый '/'
    path = path.replace(/^\//, '')

    return path.split("/")
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
    window.addEventListener("popstate", event =>
      this.$$initModule({
        module: document.location.pathname.split("/")[1],
        path: document.location.pathname,
        state: event.state
      })
    )
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

    if (
      this.$$currentModule.name &&
      this.$$currentModule.name === moduleName
    ) {
      this.$$currentModule.obj.dispatcher(moduleData.module, moduleData.state)
    } else {
      this.$$currentModule.obj && this.$$currentModule.obj.destroy()
      this.$$currentModule = {
        name: moduleName,
        obj: this.$$modules[moduleName]
      }

      this.$$currentModule.obj.init(moduleData.module, moduleData.state)
    }

    // save state to history api
    if (moduleData.pushState)
      window.history.pushState(
        moduleData.state,
        moduleName,
        moduleData.path,
      )

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
    this.$$initModule({
      module: this._getModuleFromUrl(path),
      path: path,
      state: routData.state,
      pushState: true
    })
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