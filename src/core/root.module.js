import { isEmpty } from "./helpers"
/**
 * this is the parent class for the main application module.
 */
export default class RootMediator {
  /**
   * this is constructor.
   * @param {Object} config  config object
   */
  constructor(config) {
    // this object contains config object
    this.$$config = config
    // this object contains all modules
    this.$$modules = {}
    // this object contains all mediator events
    this.$$сhannels = {}
    // this object contains current module
    this.$$currentModule = {}

    this.$$createModules()
    this.$$eventHandler()

    this.init()

    // сurrent module initialization
    this.$$initModule({
      module: document.location.pathname.split("/")[1],
      path: document.location.pathname,
      state: history.state
    })
  }

  /**
   * this method must be overridden by sub class.
   * should call eventHandler
   * @abstract
   */
  init() {}

  /**
   * this method must be overridden by sub class.
   * should contain all events
   * @abstract
   */
  eventHandler() {}

  /**
   * this method creates all modules object
   */
  $$createModules() {
    if (!isEmpty(this.$$modules)) return

    Object.keys(this.$$config.modules).forEach(key => {
      if (!this.$$config.modules[key].hidden) {
        this.$$modules[key] = new this.$$config.modules[key].class()
        this.$$modules[key].$$rout = this.$$rout.bind(this)
        this.$$modules[key].$$publish = this.$$publish.bind(this)
      }
    })
  }

  /**
   * this method creates a global event popstate
   */
  $$eventHandler() {
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
   * @param {Object} moduleData - initn module data.
   * @param {string} moduleData.module - module name.
   * @param {string} moduleData.path - url.
   * @param {Object} moduleData.state - current state.
   * @param {boolean} moduleData.pushState - flag indicates save to history api.
   */
  $$initModule(moduleData) {
    if (!moduleData.module) {
      moduleData.module = "main"
      moduleData.path = "/"
    }

    if (!this.$$modules[moduleData.module])
      return console.error("no such module:", moduleData.module)

    if (
      this.$$currentModule.name &&
      this.$$currentModule.name === moduleData.module
    ) {
      this.$$currentModule.obj.dispatcher(moduleData.path, moduleData.state)
    } else {
      this.$$currentModule.obj && this.$$currentModule.obj.destroy()
      this.$$currentModule = {
        name: moduleData.module,
        obj: this.$$modules[moduleData.module]
      }
      this.$$currentModule.obj.init(moduleData.path, moduleData.state)
    }

    // save state to history api
    if (moduleData.pushState)
      window.history.pushState(
        moduleData.state,
        moduleData.module,
        `${moduleData.path}`
      )
  }

  /**
   * publish event
   * @param {string} channel - event name.
   */
  $$publish(channel) {
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
  $$rout(routData) {
    this.$$initModule({
      module: routData.path.split("/")[1],
      path: routData.path,
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
  $$subscribe(module, channel, cb) {
    if (!this.$$сhannels[channel]) this.$$сhannels[channel] = []
    this.$$сhannels[channel].push({ context: module, callback: cb })
  }
}
