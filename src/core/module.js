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
  eventHandler() {}

  /**
   * this method must be overridden by sub class.
   * initializes the module
   * should call eventHandler and dispatcher
   * @param {string} path - url.
   * @param {Object} state - current state.
   * @abstract
   */
  init(path, state) {}

  /**
   * this method must be overridden by sub class.
   * unsubscribes from module events and deletes all objects for cleans the DOM tree
   * @abstract
   */
  destroy() {}

  /**
   * this method must be overridden by sub class.
   * performs various actions depending on the argument
   * @param {string} path - url.
   * @param {Object} state - current state.
   * @abstract
   */
  dispatcher(path, state) {}
}
