class Route {
  /**
     * Приватный класс для роутинга. </br>
     *
     * @Module Route
     * @param {Core} core - объект ядра системы.
     */
  constructor(core) {
    this.core = core;
    this.urlState = [];
  }

  /**
     * Приватный метод. Содержит обработку событий popstate или hashchange. </br>
     * Обработка события popstate или hashchange зависит от параметра в конфиге historyApi
     * @private
     */
  eventHandler() {
    if (this.core.$$config.historyApi) {
      window.addEventListener('popstate', (event) => {
        const urlData = this.getModuleFromUrl(
          document.location.pathname + document.location.search
        );
        this.core.initModule({
          module: urlData.url,
          path: document.location.pathname,
          state: event.state,
          queryParam: urlData.params,
        });
      });
    } else {
      window.addEventListener('hashchange', () => {
        const urlData = this.getModuleFromUrl(
          document.location.hash + document.location.search
        );
        this.core.initModule({
          module: urlData.url,
          path: document.location.hash,
          state: this.urlState[document.location.hash.replace(/^#/, '')],
          queryParam: urlData.params,
        });
      });
    }
  }

  /**
   * В каждом модуле содержиться метод $$route. </br>
   * Метод необходим для реализации маршрутизации, так же может передавать данные.
   * @example <caption>Создания события для роутинга</caption>
   * this.$$on('onroute', (data) => this.$$route({
   *     path: `/module_name/item/${data.id}`,
   *     state: data
   *  })
   * @example  <caption>Переход на другую страницу</caption>
   * import Module from 'ModuleName/module.js'
   * const module = new Module()
   *
   * module.$$route({
   *     path: '/module_name/item/1',
   *     state: {
   *         id: 1,
   *         name: 'Example',
   *         ...
   *     },
   *  })
   *
   * @param {Object} routeData - Объек содержит url и state.
   * @param {string} routeData.path  - url, first element module name.
   * @param {Object} routeData.state - state passed from the module.
   */
  route(routeData) {
    let path = this.core.$$config.rootPath ? this.core.$$config.rootPath + routeData.path : routeData.path;
    // Удалем двойные '//'
    path = path.replace(/\/\//, '/');
    if (this.core.$$config.historyApi) {
      // Если используем history Api - вызываем инициализацию модуля
      const urlData = this.getModuleFromUrl(path);
      this.core.initModule({
        module: urlData.url,
        path,
        state: routeData.state,
        pushState: true,
        queryParam: urlData.params,
      });
    } else {
      // Если не используем - то сохраняем состояние, и переходим по нужному пути
      // Далее вызовится событие "hashchange" - в котором и произойдет вызов метода initModule
      this.urlState[path] = routeData.state;
      document.location.hash = path;
    }
  }

  /**
  * Метод парсить текущий урл
  * получаем название модуля и данные модуля url адреса,
  * @param {String} url - url
  * @returns {Arrat} массив сторк (разбитый урл адрес через / )
  * @private
  */
  getModuleFromUrl(url) {
    console.log('1111', url);
    // Удалем ненужный нам путь
    if (this.core.$$config.rootPath) {
      url = url.replace(this.core.$$config.rootPath, '');
    }

    // Удалем первый '/' и #
    url = url.replace(/^[\/, #]/, '');

    const [urlParam, queryParam] = url.split('?');
    const params = {};

    if (queryParam) {
      queryParam.split('&').forEach((param) => {
        const [key, val] = param.split('=');
        params[key] = val;
      });
    }

    url = urlParam.split('/');

    return {
      url,
      params,
    };
  }

  pushState(moduleData) {
    window.history.pushState(
      moduleData.state,
      moduleData.module[0],
      moduleData.path,
    );
  }
}

export default Route;
