import Module from 'OneDeckCore/module';
import App from 'ExampleAuth/App.vue';
import Vue from 'vue';

/**
 * Class ExampleAuth
 * module use Vue
 */
export default class ExampleAuth extends Module {
  init(path, state) {
    console.log('init', this.constructor.name, path, state);

    this.VueApp = new Vue(App);
    this.eventHandler();
  }

  eventHandler() {
    this.VueApp.$on('onAuth', () => this.$$rout({
      path: '/main/',
      state: null,
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
    document.getElementById('ROOT').innerHTML = '';
  }
}
