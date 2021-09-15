import Module from './module';
import Core from './core';

export default class RootModule extends Module {
  /**
   * Класс является родителем для главного модуля (Root Module). </br>
   * Наследуется от класса Module для реализации паттерна [Наблюдатель (Observer)]{@link https://refactoring.guru/ru/design-patterns/observer}. </br>
   * Объект Root модуля реализует паттерн [Посредник (Mediator)]{@link https://refactoring.guru/ru/design-patterns/mediator}. </br>
   * @Module RootModule
   *
   * @example
   * import Onedeck from 'onedeck';
   *
   * export default class Root extends Onedeck.RootModule { ... }
   *
   * @param {Object} config - конфиг приложения (пример конфига в README.md)
   */
  constructor(config) {
    super();
    this.$$config = config;
    new Core(this);
  }

  /**
   * Абстрактный метод. Инициализация глобального состояния приложения. </br>
   * Этот метод должен вернуть объект с описанием всех полей глобального состояния. </br>
   * Метод вызывается 1 раз при инициализации всего приложения. </br>
   *
   * @example
   * initState () {
   *   return {
   *     test1: {
   *       test3: null,
   *       test4: null,
   *     },
   *     test2: {
   *       test5: null,
   *       test6: null,
   *     }
   *     ...
   *   }
   * }
   *
   * @returns {object} - global state
   * @abstract
   */
  initState() { return {}; }
}
