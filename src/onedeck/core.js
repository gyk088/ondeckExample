import Stroe from './store';
import Router from './router';

export default class Core {
  /**
   * Ядро системы (Root Module). </br>
   * Отвечает за создание и уничтожение всех модулей приложения.
   * @Module Core
   *
   * @param {RootModule} root - главный модуль Root
   */
  constructor(root) {
    this.root = root;
    // this object contains config object
    // конфиг, доступен в каждом модуле
    // Присваиваем функцию import и удаляем ее из конфига
    this.$$config = this.root.$$config;
    this._import = this.$$config.import;
    this.$$config.import = null;

    // this object contains current module
    // объект с текущим модулем
    this.$$currentModule = {};
    // this object contains current layout
    // объект с текущим макетом
    this.$$currentLayout = {};
    // this object contains all modules
    // объек содержит все модули приложения которые были инициализированы
    this.modules = {};
    // this object contains all layouts
    // объек содержит все макеты приложения которые были инициализированы
    this.layouts = {};

    // cоздаем роутер
    this.router = new Router(this);
    // инициализируем глобальный store
    this.$$gstore = new Stroe(this.root.initState());
    this.root.$$gstore = this.$$gstore;

    this._clear().then(() => { this.init(); });
  }


  async init() {
    try {
      await this.initGlobalModules();
    } catch (e) {
      console.error('Error init global module', e);
    }

    // вызываем глобаьное событие popstate
    this.router.eventHandler();

    // получаем массив с данными из url
    const urlData = this.router.getModuleFromUrl(
      this.$$config.historyApi
      ?  document.location.pathname + document.location.search
      : document.location.hash + document.location.search,
    );

    this.$$config.isSSR = urlData.params.ssr;


    if (this.$$config.isSSR) {
      return;
    }

    // вызывам метод init для модуля root
    this.root.init(urlData.url, urlData.params);

    // current module initialization
    this.initModule({
      module: urlData.url,
      queryParam: urlData.params,
      path: document.location.pathname,
    });
  }

  _clear() {
    return new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', () => {
        const scripts = document.querySelectorAll('script');
        document.body.innerHTML = `<div id="${this.$$config.rootElementId}"></div>`;
        if (NodeList.prototype.isPrototypeOf(scripts)) {
          scripts.forEach(s => document.body.appendChild(s));
        }
        resolve();
      });
    });
  }

  /**
  * Метод вызывает методы mounted всех модулей (см описание метода mounted)
  * @private
  */
  mounted() {
    this.root.mounted(this.$$currentModule, this.$$currentLayout);

    Object.keys(this.modules)
      .filter((moduleName) => this.modules[moduleName].$$global)
      .forEach((moduleName) => {
        this.modules[moduleName]
          .mounted(this.$$currentModule, this.$$currentLayout);

        // Встроенные модули
        Object.keys(this.modules[moduleName].$$embed)
          .forEach((name) => this.modules[moduleName].$$embed[name]
            .mounted(this.$$currentModule, this.$$currentLayout));
      });

    if (this.$$currentLayout.obj) {
      this.$$currentLayout.obj.mounted(this.$$currentModule, this.$$currentLayout);
    }

    if (this.$$currentModule.obj) {
      this.$$currentModule.obj.mounted(this.$$currentModule, this.$$currentLayout);
      Object
        .keys(this.$$currentModule.obj.$$embed)
        .forEach((name) => this.$$currentModule.obj.$$embed[name]
          .mounted(this.$$currentModule, this.$$currentLayout));
    }
  }

  /**
  * Метод вызывает метд destroy Page модуля и Embed модуле (см описание метода destroy в классе Module)
  * @private
  */
  destroyModule() {
    // Если переход на новый макет то чистим модуль а потом макет
    if (this.$$currentModule.obj) {
      this.$$currentModule.obj.destroy();
      Object
        .keys(this.$$currentModule.obj.$$embed)
        .forEach((name) => this.$$currentModule.obj.$$embed[name].destroy());
      this.$$currentModule = {};
    }
  }

  /**
   * Метод вызывает метд destroy Layout модуля (см описание метода destroy в классе Module)
   * @private
   */
  destroyLayout() {
    if (this.$$currentLayout.obj) {
      this.$$currentLayout.obj.destroy();
      this.$$currentLayout = {};
    }
  }

  /**
  * Метод вызывает методы dispatcher всех модулей (см описание метода dispatcher)
  * @param {Array} path - url array
  * @param {Object} state - current state
  * @param {Object} queryParam - параметры переданные вместе с url
  * @private
  */
  dispatcherModule(path, state, queryParam) {
    this.root.dispatcher(path, state, queryParam);
    // Вызываем диспатчеры для глобальных модулей
    Object.keys(this.modules)
      .filter((moduleName) => this.modules[moduleName].$$global)
      .forEach((moduleName) => {
        this.modules[moduleName].dispatcher(path, state, queryParam);

        // Встроенные модули
        Object.keys(this.modules[moduleName].$$embed)
          .forEach((name) => this.modules[moduleName].$$embed[name]
            .dispatcher(path, state, queryParam));
      });
    // Если переход на новый макет то чистим модуль а потом макет
    if (this.$$currentModule.obj) {
      // Вызываем диспатчер для текущего модуля
      this.$$currentModule.obj.dispatcher(path, state, queryParam);
      // Вызываем диспатчеры для всторенных модулей
      Object.keys(this.$$currentModule.obj.$$embed)
        .forEach((name) => this.$$currentModule.obj.$$embed[name].dispatcher(path, state, queryParam));
    }
  }

  initGlobalModules = async () => {
    const globalNames = Object.keys(this.$$config.modules)
      .filter((moduleName) => this.$$config.modules[moduleName].global);
      console.log(globalNames)

    for (let i = 0; i < globalNames.length; i++) {
      // eslint-disable-next-line
      await this.createModule(globalNames[i], this.$$config.modules[globalNames[i]])
    }
  }

  /**
  * Метод создает объект Page модуля и Embed модуля
  * получаем название модуля и данные модуля url адреса,
  * @param {String} moduleName - название модуля  (в конфиге параметр module)
  * @param {Object} moduleConf - настройки модуля
  * @private
  */
  createModule = async (moduleName, moduleConf) => {
    // Если уже подгрузили module - выходим
    if (this.modules[moduleName]) return;

    let ModuleClass = await this._import(moduleConf.module);
    if (!ModuleClass || !ModuleClass.default) {
      throw new SyntaxError(`Error load module: ${moduleName}`);
    }
    ModuleClass = ModuleClass.default;

    // создаем модуль
    this.modules[moduleName] = new ModuleClass();
    // глобальный модуль
    this.modules[moduleName].$$global = moduleConf.global;
    // добавляем метод route для маршрутизации
    this.modules[moduleName].$$route = this.router.route.bind(this.router);
    // добавляем метод  publish для публикации глобальных событий
    this.modules[moduleName].$$gemit = this.root.$$emit.bind(this.root);
    // глобальный стейт
    this.modules[moduleName].$$gstore = this.$$gstore;
    // конфиг
    this.modules[moduleName].$$config = this.$$config;

    // макет модуля
    this.modules[moduleName].$$layoutName = moduleConf.layout;
    // встраиваемые модули
    this.modules[moduleName].$$embed = {};

    if (moduleConf.embed) {
      const embedNames = Object.keys(moduleConf.embed);

      for (let i = 0; i < embedNames.length; i++) {
        // eslint-disable-next-line
        let EmbedClass = await this._import(moduleConf.embed[embedNames[i]].module);
        if (!EmbedClass || !EmbedClass.default) {
          throw new SyntaxError(`Error load module: ${embedNames[i]}`);
        }
        EmbedClass = EmbedClass.default;

        this.modules[moduleName].$$embed[embedNames[i]] = new EmbedClass();
        this.modules[moduleName].$$embed[embedNames[i]].$$route = this.router.route.bind(this.router);
        this.modules[moduleName].$$embed[embedNames[i]].$$gemit = this.root.$$emit.bind(this.root);
        this.modules[moduleName].$$embed[embedNames[i]].$$gstore = this.$$gstore;
        this.modules[moduleName].$$embed[embedNames[i]].$$config = this.$$config;
      }
    }

    // Если модуль глобальный - сразу его инициализируем
    if (this.modules[moduleName].$$global) {
      this.modules[moduleName].init(moduleName);

      // Инициализируем встроенные модули
      Object.keys(this.modules[moduleName].$$embed)
        .forEach((name) => this.modules[moduleName].$$embed[name]
          .init(moduleName));
    }
  }

  /**
  * Приватный метод. Cоздает объект Layout модуля
  * получаем название модуля и данные модуля url адреса,
  * @param {String} layoutName - название модуля  (в конфиге параметр layout)
  * @private
  */
  createLayout = async (layoutName) => {
    // Если уже подгрузили layout - выходим
    if (this.layouts[layoutName]) return;

    let LayoutClass = await this._import(layoutName);

    if (!LayoutClass || !LayoutClass.default) {
      throw new SyntaxError(`Error load module: ${layoutName}`);
    }
    LayoutClass = LayoutClass.default;

    // создаем макет
    this.layouts[layoutName] = new LayoutClass();
    // добавляем метод route для маршрутизации
    this.layouts[layoutName].$$route = this.router.route.bind(this.router);
    // добавляем метод  publish для публикации глобальных событий
    this.layouts[layoutName].$$gemit = this.root.$$emit.bind(this.root);
    // глобальный стейт
    this.layouts[layoutName].$$gstore = this.$$gstore;
    // конфиг
    this.layouts[layoutName].$$config = this.$$config;
  }

  /**
   * Приватный метод инициализации модуля. </br>
   * Инициализируем  Page Layout Embed модули в зависимости от url адресв
   * @param {Object} moduleData - initn module data.
   * @param {Array} moduleData.module - массив url адреса. В нулевом элементе module[0] содержиться имя модлуя.
   * @param {Object} moduleData.queryParam - данные передданые в url.
   * @param {string} moduleData.path - url.
   * @param {Object} moduleData.state - current state.
   * @param {boolean} moduleData.pushState - flag indicates save to history api.
   * @private
   */
  initModule = async (moduleData) => {
    const moduleName = moduleData.module[0];

    const mudules = this.$$config.modules;

    if (!moduleName) {
      this.router.route({
        path: this.$$config.mainModule,
      });
      return;
    }

    if (!mudules[moduleName]) {
      this.router.route({
        path: this.$$config.module404,
      });
      console.error('no such module:', moduleName);
      return;
    }

    // Если это глобальный или встраиваемый модуль - они не учавствует в роутинге
    if (mudules[moduleName].global) {
      this.router.route({
        path: this.$$config.module404,
      });
      console.error('global module:', moduleName);
      return;
    }

    // Создаем макет если он есть
    if (
      mudules[moduleName].layout
      && mudules[moduleName].layout === this.$$currentLayout.name
    ) {
      // Если переход внутри текущего макета
      this.$$currentLayout.obj.dispatcher(moduleData.module, moduleData.state, moduleData.queryParam);
    } else if (mudules[moduleName].layout) {
      this.destroyModule();
      this.destroyLayout();

      // Если переход на новый макет то чистим модуль а потом макет
      try {
        await this.createLayout(mudules[moduleName].layout);
      } catch (e) {
        console.error(e);
      }
      // Cохраняем новый модуль в объекте currentModule
      this.$$currentLayout = {
        name: mudules[moduleName].layout,
        obj: this.layouts[mudules[moduleName].layout],
      };

      // Инициализируем новый макет (вызываем метод init)
      this.$$currentLayout.obj.init(moduleData.module, moduleData.state, moduleData.queryParam);
    } else {
      // Если у модуля нет макета - уничтожаем текущий макет
      this.destroyModule();
      this.destroyLayout();
    }

    // Если переход внутри текущего модуля - вызываем диспатчер модуля
    if (
      this.$$currentModule.name
      && this.$$currentModule.name === moduleName
    ) {
      // Если переход внутри текущего модуля - вызываем диспатчер модуля (метода dispatcher)
      this.dispatcherModule(moduleData.module, moduleData.state, moduleData.queryParam);
    } else {
      // Если переход на новый модуль - вызываем деструктор текущего модуля (метод destroy)
      this.destroyModule();

      // Если переход на новый макет то чистим модуль а потом макет
      try {
        await this.createModule(moduleName, mudules[moduleName]);
      } catch (e) {
        console.error(e);
      }

      // Cохраняем новый модуль в объекте currentModule
      this.$$currentModule = {
        name: moduleName,
        obj: this.modules[moduleName],
      };

      // Инициализируем новый модуль (вызываем метод init)
      this.$$currentModule.obj.init(moduleData.module, moduleData.state, moduleData.queryParam);
      // Инициализируем встроенные модули
      Object.keys(this.$$currentModule.obj.$$embed)
        .forEach((name) => this.$$currentModule.obj.$$embed[name]
          .init(moduleData.module, moduleData.state, moduleData.queryParam));

      this.dispatcherModule(moduleData.module, moduleData.state, moduleData.queryParam);
    }

    // Если используем history api - сохраняем новое состояние в истоии браузера
    if (moduleData.pushState && this.$$config.historyApi) {
      this.router.pushState(moduleData);
    }

    // Вызываем методы жизненого цикла
    this.mounted();
  }
}
