import VueApp from 'ExampleVue/App.vue';
import Vue from 'vue';
import Onedeck from 'onedeck';
/**
 * Class ExampleVue
 * module use Vue and Quasar
 */
export default class ExampleVue extends Onedeck.Module {
  init (path, state) {
    console.log('init', this.constructor.name, path, state);
    // Инициализируем приложение модуля
    this.VueApp = new Vue(VueApp);

    this.eventHandler();
  }

  eventHandler () {
    // По клику на строчку в таблице переходим на новый url
    this.$$on('onRowClick', (row) => this.$$rout({
      path: `/main/item/${row[0].id}`,
      state: row[0],
    }));
  }

  dispatcher (path, state) {
    console.log('dispatcher', this.constructor.name, path, state);
  }

  mounted (module, layout) {
    console.log('mounted', this.constructor.name, module, layout);
  }

  destroy () {
    // Уничтожаем приложение модуля
    this.VueApp.$destroy();
    // Чистим DOM дерево, куда был встроем модуль
    document.getElementById('MainContent').innerHTML = '';
  }
}
