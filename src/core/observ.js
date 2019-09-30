export default class Observable {
  constructor() {
    this.listeners = {}
  }

  /**
   * subscribe to an event
   * @param {string} channel - event name.
   * @param {function} cb - callback function.
   */
  $on(channel, cb) {
    if (!this.listeners[channel]) {
      this.listeners[channel] = {}
      this.listeners[channel].eventProperty = {}
      this.listeners[channel].eventProperty.isOnOnce = false
      this.listeners[channel].data = []
    }
    this.listeners[channel].data.push(cb)
  }

  /**
   * subscribe to an event once
   * @param {string} channel - event name.
   * @param {function} cb - callback function.
   */
  $onOnce(channel, cb) {
    this.on(channel, cb)
    this.listeners[channel].eventProperty.isOnOnce = true
  }

  /**
   * unsubscribe from the event
   * @param {string} channel - event name.
   * @param {function} cb - callback function.
   */
  $off(channel, cb) {
    this.listeners[channel].data = this.listeners[channel].data.filter(
      listener => {
        return listener !== cb
      }
    )
  }

  /**
   * publish event
   * @param {string} channel - event name.
   * @param {Object} data - evetn data.
   */
  $emit(channel, data) {
    if (!this.listeners[channel] || !this.listeners[channel].data) {
      console.error("No such event:", channel)
      return
    }

    this.listeners[channel].data.forEach(listener => {
      if (this.listeners[channel].eventProperty.isOnOnce) {
        this.off(e, this.listeners[channel].data[0])
      }
      listener(data)
    })
  }

  /**
   * install an observer in the object
   * @param {Object} obj - object in which we install the observer
   */
  install(obj) {
    obj.listeners = this.listeners
    obj.$on = this.$on
    obj.$off = this.$off
    obj.$onOnce = this.$onOnce
    obj.$emit = this.$emit
  }
}
