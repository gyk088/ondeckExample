import Observable from 'OneDeckCore/observ';
/**
 * this is the parent class for the main application module.
 * родительсикй класс для главного модуля приложения
 */
export default class RootModule extends Observable {
  /**
   * this is constructor
   * конструктор
   * @param {Object} config  config object
   */
  constructor(config) {
    super();
    // this object contains config object
    // конфиг, доступен в каждом модуле
    this.$$config = config;
    // this object contains current module
    // объект с текущим модулем
    this.$$currentModule = {};
    // this object contains current layout
    // объект с текущим макетом
    this.$$currentLayout = {};
    // this object contains all modules
    // объек содержит все модули приложения которые были инициализированы
    this._modules = {};
    // this object contains all layouts
    // объек содержит все макеты приложения которые были инициализированы
    this._layouts = {};

    // состояние по указоннму url (если не используем history api)
    this._urlState = {};

    // инициализируем глобальные модули
    this._initGlobalModules();

    // вызываем глобаьное событие popstate
    this._eventHandler();

    // получаем массив с данными из url
    const module = this._getModuleFromUrl(
      this.$$config.historyApi ? document.location.pathname : document.location.hash,
    );

    // вызывам метод init для модуля root
    this.init({
      module,
      path: this.$$config.historyApi ? document.location.pathname : document.location.hash,
    });

    // current module initialization
    this._initModule({
      module,
      path: document.location.pathname,
    });
  }

  /**
   * this method must be overridden by sub class.
   * should call eventHandler
   *
   * Метод инициализации главного модуля.
   * Должен быть переопределен в модуле Root.
   * @abstract
   * @param {Object} initObj - объект инициализации приложения
   * @param {Array} initObj.module - массив с данными url адреса
   * @param {String} initObj.path - текущий урл
   */
  init() { }

  /**
   * this method must be overridden by sub class.
   * should contain all events
   *
   * Обработчик событий.
   * Должен быть переопределен в модуле Root.
   * @abstract
   */
  eventHandler() { }

  /**
  * Called immediately after mounting
  * child module to the root module
  * The method must be overridden in the Root module.
  *
  * метод жиненого цикла , вызывается после того как модуль смотнирован,
  * в этом методе доступен объект currentModule
  * @abstract
  */
  mounted() { }

  /**
   * this method must be overridden by sub class.
   * performs various actions depending on the argument
   * @param {string} path - url.
   * @param {Object} state - current state.
   * @abstract
   */
  dispatcher() { }

  /**
   * @param {Object} routData - object contains url and state.
   * @param {string} routData.path  - url, first element module name.
   * @param {Object} routData.state - state passed from the module.
   */
  $$rout(routData) {
    let path = this.$$config.rootPath ? this.$$config.rootPath + routData.path : routData.path;
    // Удалем двойные '//'
    path = path.replace(/\/\//, '/');
    if (this.$$config.historyApi) {
      // Если используем history Api - вызываем инициализацию модуля
      this._initModule({
        module: this._getModuleFromUrl(path),
        path,
        state: routData.state,
        pushState: true,
      });
    } else {
      // Если не используем - то сохраняем состояние, и переходим по нужному пути
      // Далее вызовится событие "hashchange" - в котором и произойдет вызов метода initModule
      this._urlState[path] = routData.state;
      document.location.hash = path;
    }
  }

  /**
  * Called immediately after mounting
  * child module to the root module
  * The method must be overridden in the Root module.
  *
  * метод жиненого цикла , вызывается после того как модуль смотнирован,
  * в этом методе доступен объект currentModule
  */
  _mounted() {
    this.mounted(this.$$currentModule, this.$$currentLayout);

    Object.keys(this._modules)
      .filter((moduleName) => this._modules[moduleName].$$global)
      .forEach((moduleName) => this._modules[moduleName]
        .mounted(this.$$currentModule, this.$$currentLayout));

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
  * сurrent module destroy
  * уничтожение текущего модуля
  */
  _destroyModule() {
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
  * сurrent Layout destroy
  * уничтожение текущего макета
  */
  _destroyLayout() {
    if (this.$$currentLayout.obj) {
      this.$$currentLayout.obj.destroy();
      this.$$currentLayout = {};
    }
  }

  /**
  * сurrent module dispatcher
  * вызываем диспатчер у текущего модуля
  * @param {Array} path - url array
  * @param {Object} state - current state
  */
  _dispatcherModule(path, state) {
    this.dispatcher(path, state);
    // Вызываем диспатчеры для глобальных модулей
    Object.keys(this._modules)
      .filter((moduleName) => this._modules[moduleName].$$global)
      .forEach((moduleName) => this._modules[moduleName].dispatcher(path, state));
    // Если переход на новый макет то чистим модуль а потом макет
    if (this.$$currentModule.obj) {
      // Вызываем диспатчер для текущего модуля
      this.$$currentModule.obj.dispatcher(path, state);
      // Вызываем диспатчеры для всторенных модулей
      Object.keys(this.$$currentModule.obj.$$embed)
        .forEach((name) => this.$$currentModule.obj.$$embed[name].dispatcher(path, state));
    }
  }

  /**
  * Get module names and data from url
  * получаем название модуля и данные модуля url адреса,
  * @param {String} url - url address
  */
  _getModuleFromUrl(url) {
    // Удалем ненужный нам путь
    if (this.$$config.rootPath) {
      url = url.replace(this.$$config.rootPath, '');
    }
    // Удалем первый '/' и #
    url = url.replace(/^[\/, #]/, '');

    return url.split('/');
  }

  _initGlobalModules() {
    Object.keys(this.$$config.modules)
      .filter((moduleName) => this.$$config.modules[moduleName].global)
      .forEach((moduleName) => this._createModule(moduleName, this.$$config.modules[moduleName]));
  }

  /**
   * this method creates all modules object
   * создаем все модули из конфига
   */
  _createModule = async (moduleName, moduleConf) => {
    // Если уже подгрузили module - выходим
    if (this._modules[moduleName]) return;

    let ModuleClass = await import(`../modules/${moduleConf.module}/module.js`);
    if (!ModuleClass || !ModuleClass.default) {
      throw new SyntaxError(`Error load module: ${moduleName}`);
    }
    ModuleClass = ModuleClass.default;

    // создаем модуль
    this._modules[moduleName] = new ModuleClass();
    // глобальный модуль
    this._modules[moduleName].$$global = moduleConf.global;
    // добавляем метод rout для маршрутизации
    this._modules[moduleName].$$rout = this.$$rout.bind(this);
    // добавляем метод  publish для публикации глобальных событий
    this._modules[moduleName].$$gemit = this.$$emit.bind(this);
    // конфиг
    this._modules[moduleName].$$config = this.$$config;
    // макет модуля
    this._modules[moduleName].$$layoutName = moduleConf.layout;
    // встраиваемые модули
    this._modules[moduleName].$$embed = {};

    if (moduleConf.embed) {
      const embedNames = Object.keys(moduleConf.embed);

      for (let i = 0; i < embedNames.length; i++) {
        let EmbedClass;
        // eslint-disable-next-line
        EmbedClass = await import(`../modules/${moduleConf.embed[embedNames[i]].module}/module.js`);
        if (!EmbedClass || !EmbedClass.default) {
          throw new SyntaxError(`Error load module: ${embedNames[i]}`);
        }
        EmbedClass = EmbedClass.default;

        this._modules[moduleName].$$embed[embedNames[i]] = new EmbedClass();
        this._modules[moduleName].$$embed[embedNames[i]].$$rout = this.$$rout.bind(this);
        this._modules[moduleName].$$embed[embedNames[i]].$$gemit = this.$$emit.bind(this);
        this._modules[moduleName].$$embed[embedNames[i]].$$config = this.$$config;
      }
    }

    // Если модуль глобальный - сразу его инициализируем
    if (this._modules[moduleName].$$global) {
      this._modules[moduleName].init(moduleName);
    }
  }

  /**
  * this method creates all layouts object
  * создаем все макеты из конфига
  */
  _createLayout = async (layoutName) => {
    // Если уже подгрузили layout - выходим
    if (this._layouts[layoutName]) return;

    let LayoutClass = await import(`../modules/${layoutName}/module.js`);
    if (!LayoutClass || !LayoutClass.default) {
      throw new SyntaxError(`Error load module: ${layoutName}`);
    }
    LayoutClass = LayoutClass.default;

    // создаем макет
    this._layouts[layoutName] = new LayoutClass();
    // добавляем метод rout для маршрутизации
    this._layouts[layoutName].$$rout = this.$$rout.bind(this);
    // добавляем метод  publish для публикации глобальных событий
    this._layouts[layoutName].$$gemit = this.$$emit.bind(this);
    // конфиг
    this._layouts[layoutName].$$config = this.$$config;
  }

  /**
   * this method creates a global event popstate
   * глобальный обработчик событий
   */
  _eventHandler() {
    if (this.$$config.historyApi) {
      window.addEventListener('popstate', (event) => this._initModule({
        module: this._getModuleFromUrl(document.location.pathname),
        path: document.location.pathname,
        state: event.state,
      }));
    } else {
      window.addEventListener('hashchange', () => this._initModule({
        module: this._getModuleFromUrl(document.location.hash),
        path: document.location.hash,
        state: this._urlState[document.location.hash.replace(/^#/, '')],
      }));
    }
  }

  /**
   * current module initialization
   * инициализация текущего модуля
   * @param {Object} moduleData - initn module data.
   * @param {string} moduleData.module - module name.
   * @param {string} moduleData.path - url.
   * @param {Object} moduleData.state - current state.
   * @param {boolean} moduleData.pushState - flag indicates save to history api.
   */
  _initModule = async (moduleData) => {
    const moduleName = moduleData.module[0];

    const mudules = this.$$config.modules;

    if (!moduleName) {
      this.$$rout({
        path: this.$$config.mainModule,
      });
      return;
    }

    if (!mudules[moduleName]) {
      this.$$rout({
        path: this.$$config.module404,
      });
      console.error('no such module:', moduleName);
      return;
    }

    // Если это глобальный или встраиваемый модуль - они не учавствует в роутинге
    if (mudules[moduleName].global) {
      this.$$rout({
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
      this.$$currentLayout.obj.dispatcher(moduleData.module, moduleData.state);
    } else if (mudules[moduleName].layout) {
      this._destroyModule();
      this._destroyLayout();

      // Если переход на новый макет то чистим модуль а потом макет
      try {
        await this._createLayout(mudules[moduleName].layout);
      } catch (e) {
        console.error(e);
      }
      // Cохраняем новый модуль в объекте currentModule
      this.$$currentLayout = {
        name: mudules[moduleName].layout,
        obj: this._layouts[mudules[moduleName].layout],
      };

      // Инициализируем новый макет (вызываем метод init)
      this.$$currentLayout.obj.init(moduleData.module, moduleData.state);
    } else {
      // Если у модуля нет макета - уничтожаем текущий макет
      this._destroyModule();
      this._destroyLayout();
    }

    // Если переход внутри текущего модуля - вызываем диспатчер модуля
    if (
      this.$$currentModule.name
      && this.$$currentModule.name === moduleName
    ) {
      // Если переход внутри текущего модуля - вызываем диспатчер модуля (метода dispatcher)
      this._dispatcherModule(moduleData.module, moduleData.state);
    } else {
      // Если переход на новый модуль - вызываем деструктор текущего модуля (метод destroy)
      this._destroyModule();

      // Если переход на новый макет то чистим модуль а потом макет
      try {
        await this._createModule(moduleName, mudules[moduleName]);
      } catch (e) {
        console.error(e);
      }

      // Cохраняем новый модуль в объекте currentModule
      this.$$currentModule = {
        name: moduleName,
        obj: this._modules[moduleName],
      };

      // Инициализируем новый модуль (вызываем метод init)
      this.$$currentModule.obj.init(moduleData.module, moduleData.state);
      // Инициализируем встроенные модули
      Object.keys(this.$$currentModule.obj.$$embed)
        .forEach((name) => this.$$currentModule.obj.$$embed[name]
          .init(moduleData.module, moduleData.state));

      this._dispatcherModule(moduleData.module, moduleData.state);
    }

    // Если используем history api - сохраняем новое состояние в истоии браузера
    if (moduleData.pushState && this.$$config.historyApi) {
      window.history.pushState(
        moduleData.state,
        moduleName,
        moduleData.path,
      );
    }

    // Вызываем методы жизненого цикла
    this._mounted();
  }
}
