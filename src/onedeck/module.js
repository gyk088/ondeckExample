import Observable from './observ';

export default class Module extends Observable {
  /**
   * Класс является родителем для всех модулей кроме главного модуля (Root Module). </br>
   * Наследуется от класса Observable для реализации паттерна [Наблюдатель (Observer)]{@link https://refactoring.guru/ru/design-patterns/observer}. </br>
   * Объект модуля реализует паттерн [Одиночка (Singleton)]{@link https://refactoring.guru/ru/design-patterns/singleton}. </br>
   * Каждый модуль создается только 1 раз, последующий вызов new Module() - вернет текущий экзепляр данного класса.
   * @example <caption>Пример создания модуля</caption>
   * import Onedeck from 'onedeck';
   *
   * export default class ModuleName extends Onedeck.Module { ... }
   *
   * @example <caption>Пример получения экземпляра модуля</caption>
   * import Module from 'ModuleName/module.js'
   * const module = new Module()
   * // Событие уровня модуля
   * module.$$emit('eventName', data)
   * // Событие уровня приложения
   * module.$$gemit('eventName', data)
   *
   * @Module Module
   */
  constructor() {
    super();
    /**
     * Объект содержит в себе инстансы всех моулей
     * Модуль создается только 1 раз
     * @static
     */
    Module.instances = Module.instances || {};

    if (Module.instances[this.constructor.name]) {
      return Module.instances[this.constructor.name];
    }

    Module.instances[this.constructor.name] = this;
  }

  /**
   * Абстрактный метод. Обработчик событий. </br>
   * В этом методе должны быть описаны все события текущего моудля. </br>
   *
   * @example
   * eventHandler () {
   *   // Cоздаем событие уровня модуля в котором эмитим событие уровня приложения
   *   this.$on('event1', (data) => this.$$gemit(data));
   *   // Cоздаем событие уровня модуля в котором выполняем метод doSomething
   *   this.$on('event2', (data) => this.doSomething(data));
   * }
   * @abstract
   */
  eventHandler() { }

  /**
   * Абстрактный метод. Инициализация приложения модуля. </br>
   * В этом методе должна быть описана инициализация приложения модуля. </br>
   * Метод автоматически вызывается для каждого модуля старницы при переходе на страницу модуля. </br>
   * Для Global модуля, и для Embed модулей которые встороенные в Global - вызыввается только 1 раз, при инициализации приложения. </br>
   * Вызывается в следующем порядке: </br>
   * - init Layout модуля если на старнице меняется Layout </br>
   * - init Page модуля </br>
   * - init Embed модулей в произвольном порядке </br>
   *
   * @example
   * init (path, state) {
   *   console.log('init', this.constructor.name, path, state);
   *   // Создаем приложение модуля
   *   this.reactApp = ReactDOM.render(<App />, document.getElementById('MainContent'));
   *   // Вызываем обработчик событий
   *   this.eventHandler();
   * }
   *
   * @param {Array} path - массив с элементами url адреса.
   * @param {Object} state - данные переданные с url.
   * @abstract
   */
  init() { }

  /**
   * Абстрактный метод. Деструктор. </br>
   * В этом методе должна быть описана деструктуризация модуля. </br>
   * Метод автоматически вызывается для каждого модуля старницы при переходе на другую старницу приложнеия. </br>
   * Для Global модуля - дестуркторизация не производится. </br>
   *
   * @example
   * destroy () {
   *   // Отписываемся от всех событий уровня модуля
   *   this.$$offAll()
   *
   *   ReactDOM.unmountComponentAtNode(document.getElementById('MainContent'));
   * }
   * @abstract
   */
  destroy() { }

  /**
   * Абстрактный метод. Диспетчер. </br>
   * В этом методе должна быть описана логика модуля связанная с маршрутизацией. </br>
   * Метод автоматически вызывается для каждого модуля при изменении url адреса. </br>
   * Вызывается в следующем порядке: </br>
   * - dispatcher Root модуля </br>
   * - dispatcher всех Global модулей в произвольном порядке</br>
   * - dispatcher Layout модуля </br>
   * - dispatcher Page модуля </br>
   * - dispatcher Embed модулей в произвольном порядке </br>
   *
   * @example
   * dispatcher (path, state) {
   *   console.log('dispatcher', this.constructor.name, path, state);
   *   // Если путь my.site.com/moduleName/item/3
   *   if (path[1] === 'item') this.showItem(state, path[2]);
   * }
   *
   * @param {string} path - массив с элементами url адреса.
   * @param {Object} state - данные переданные с url.
   * @abstract
   */
  dispatcher() { }

  /**
  * Абстрактный метод. Монитирование модуля. </br>
  * Метод автоматически вызывается для каждого модуля при изменении url адреса. </br>
  * В методе доступны объекты currentModule и currentLayout. </br>
  * Вызывается в следующем порядке: </br>
  * - mounted Root модуля </br>
  * - mounted всех Global модулей в произвольном порядке </br>
  * - mounted Layout модуля </br>
  * - mounted Page модуля </br>
  * - mounted Embed модулей в произвольном порядке </br>
  * @example
  * mounted (module, layout) {
  *   console.log('mounted', this.constructor.name, module, layout);
  * }
  *
  * @param {Object} currentModule - текущий Page модуль.
  * @param {Object} currentLayout - текущий Layout модуль.
  * @abstract
  */
  mounted() { }
}
