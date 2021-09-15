class Watchers {
  /**
   * Приватный класс для создания и удаления наблюдателей для стора. </br>
   *
   * @Module Watchers
   */
  constructor() {
    this._listeners = {};
  }

  /**
   * Добавить наблюдателя для поля стейта. </br>
   * @example <caption>Пример добавления</caption>
   * import Module from 'ModuleName/module.js'
   * const module = new Module()
   *
   * // Поле field1 - должно существовать в стейте
   * module.$$store.watcher.field1.add('watcherName', (data) => {
   *  conosole.log(data)
   * })
   *
   * @param {string} name - название название наблюдателя.
   * @param {function} cb - callback функция.
   */
  add(name, cb) {
    this._listeners[name] = cb;
  }

  /**
   * Удалить наблюдателя для поля стейта. </br>
   * @example <caption>Пример удаления</caption>
   * import Module from 'ModuleName/module.js'
   * const module = new Module()
   *
   * // Поле field1 - должно существовать в стейте
   * module.$$store.watcher.field1.remove('watcherName')
   *
   * @param {string} name - название наблюдателя.
   */
  remove(name) {
    delete this._listeners[name];
  }

  /**
   * Приватный метод. </br>
   * Выполнить все callback функции
   *
   * @param {object} data - название название наблюдателя.
   * @param {any} data.newValue - новое значение.
   * @param {any} data.oldValue - старое значение.
   * @param {object} data.state - текущий стейт.
   * @private
   */
  _emit(data) {
    for (const name in this._listeners) {
      this._listeners[name](data);
    }
  }
}

class Store {
  /**
   * Класс определяет глобальный стор для всех модулей, каждый модуль имеет доступ к глобальному стору. </br>
   * Стор создается 1 раз при инициализации приложения.
   * Для инициализации стора желательно использовать метод initState() который необходимо описать в модуле root
   * @example <caption>Пример инициализации стора</caption>
   * export default class Root extends Onedeck.RootModule {
   * initState() {
   *  return {
   *    field1: ....
   *    field2: ....
   *    ....
   *  }
   * }
   * .....
   *
   * @example <caption>Пример использования стора</caption>
   * import Module from 'ModuleName/module.js'
   * const module = new Module()
   * // создаем или изменяе поле в сторе
   * module.$$store.state.field1 = 'new data'
   *
   * // Добавляем наблюдатель за данным полем, при изменении поля сработает колбек функция
   * // name - произвольная строка, потом по этому имени мы можем удалить данный наблюдатель
   * // cb   - функция, которая сработает при изменении данных в стейте
   * module.$$store.watcher.field1.add('watcherName', (data) => {
   *  conosole.log(data)
   * })
   *
   * // Удаляем наблюдатель по имени
   * module.$$store.watcher.field1.remove('watcherName')
   *
   * @Module Store
   */
  constructor(state = {}) {
    this.state = new Proxy(state, {
      get: (target, name) => target[name],
      set: (obj, prop, value) => {
        if (prop in this.watchers) {
          this.watchers[prop]._emit({
            newValue: value,
            oldValue: obj[prop],
            state: obj,
          });
        }

        obj[prop] = value;
        return true;
      },
      has: (target, key) => key in target,
    });

    this.watchers = new Proxy({}, {
      get: (target, name) => {
        if (name in this.state) {
          if (name in target) {
            return target[name];
          }
          target[name] = new Watchers();
          return target[name];
        }

        console.error(`no such ${name} in state`);
        return null;
      },
      set: () => {
        console.error('Watcher is read-only');
        return false;
      },
      has: (target, key) => key in target,
    });
  }
}

export default Store;
