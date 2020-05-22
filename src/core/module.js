/**
 * this class implements an interface for the base class of the module
 * @interface
 */
export default class Module {
  /**
   * this method must be overridden by sub class.
   * should contain all events
   * @abstract
   */
  eventHandler () { }

  /**
   * this method must be overridden by sub class.
   * initializes the module
   * should call eventHandler and dispatcher
   * @param {string} path - url.
   * @param {Object} state - current state.
   * @abstract
   */
  init (path, state) { }

  /**
   * this method must be overridden by sub class.
   * unsubscribes from module events and deletes all objects for cleans the DOM tree
   * @abstract
   */
  destroy () { }

  /**
   * this method must be overridden by sub class.
   * performs various actions depending on the argument
   * @param {string} path - url.
   * @param {Object} state - current state.
   * @abstract
   */
  dispatcher (path, state) { }

  /**
  * Called immediately after mounting
  * child module to the root module
  * The method must be overridden in the Root module.
  *
  * метод жиненого цикла , вызывается после того как модуль смотнирован,
  * в этом методе доступен объект currentModule и currentModule
  * @param {Module} currentModule - текущий модуль.
  * @param {Module} currentLayout - текущий макет.
  * @abstract
  */
  mounted (currentModule, currentLayout) { }
}
