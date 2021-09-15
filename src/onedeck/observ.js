export default class Observable {
  /**
   * Класс реализует паттерн [Наблюдатель (Observer)]{@link https://refactoring.guru/ru/design-patterns/observer}. </br>
   * Является родителем для классов Modle и RootModule.
   * @Module Observable
   */
  constructor() {
    this._listeners = {};
  }

  /**
   * Подписаться на событие
   * @example
   * const cbName = (data) => console.log(data)
   * this.$$on('onEventName', cbName)
   *
   * @param {string} channel - название события.
   * @param {function} cb - callback функция.
   */
  $$on(channel, cb) {
    if (!this._listeners[channel]) {
      this._listeners[channel] = {};
      this._listeners[channel].eventProperty = {};
      this._listeners[channel].eventProperty.isOnOnce = false;
      this._listeners[channel].data = [];
    }
    this._listeners[channel].data.push(cb);
  }

  /**
   * Подписаться на событие которое выполниться только 1 раз
   * @example
   * const cbName = (data) => console.log(data)
   * this.$$onOnce('onEventName', cbName)
   *
   * @param {string} channel - название события.
   * @param {function} cb - callback функция.
   */
  $$onOnce(channel, cb) {
    this.on(channel, cb);
    this._listeners[channel].eventProperty.isOnOnce = true;
  }

  /**
   * Отписаться от события
   * @example
   * this.$$off('onEventName', cbName)
   *
   * @param {string} channel - название события.
   * @param {function} cb - callback функция.
   */
  $$off(channel, cb) {
    this._listeners[channel].data = this._listeners[channel].data.filter(
      (listener) => listener !== cb,
    );
  }

  /**
   * Отписаться от всех событий
   * @example
   * this.$$offAll()
   */
  $$offAll() {
    this._listeners = {};
  }

  /**
   * Опубликовать событие
   * @example
   * this.$$emit('onEventName', data)
   *
   * @param {string} channel - название события.
   * @param {Object} data - данные события.
   */
  $$emit(channel, data) {
    if (!this._listeners[channel] || !this._listeners[channel].data) {
      console.error('No such event:', channel);
      return;
    }

    this._listeners[channel].data.forEach((listener) => {
      if (this._listeners[channel].eventProperty.isOnOnce) {
        this.$$off(channel, this._listeners[channel].data[0]);
      }
      listener(data);
    });
  }

  /**
   * Расширить объект для реализации паттерна наблюдатель
   * @example
   * const observ = new Observable()
   * observ.install(object)
   *
   * @param {Object} extendObj - объект который необходимо расширть
   */
  install(extendObj) {
    extendObj._listeners = this._listeners;
    extendObj.$$on = this.$$on;
    extendObj.$$off = this.$$off;
    extendObj.$$onOnce = this.$$onOnce;
    extendObj.$$emit = this.$$emit;
  }
}
