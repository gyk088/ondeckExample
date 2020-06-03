import VueApp from 'ExampleVue/App.vue';
import Vue from 'vue';
import Module from 'OneDeckCore/module';
/**
 * Class ExampleVue
 * module use Vue and Quasar
 */
export default class ExampleVue extends Module {
  init(path, state) {
    console.log('init', this.constructor.name, path, state);

    this.VueApp = new Vue(VueApp);

    this.eventHandler();
  }

  eventHandler() {
    this.VueApp.$on('onRowClick', (row) => this.$$rout({
      path: `/main/item/${row[0].id}`,
      state: row[0],
    }));
  }

  dispatcher(path, state) {
    console.log('dispatcher', this.constructor.name, path, state);
  }

  mounted(module, layout) {
    console.log('mounted', this.constructor.name, module, layout);
  }

  destroy() {
    this.VueApp.$destroy();
    document.getElementById('MainContent').innerHTML = '';
  }
}
