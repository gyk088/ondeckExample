/**
 * Class Root
 */
import VueApp from 'ExampleLayoutVue/App.vue';
import Vue from 'vue';
import Onedeck from 'onedeck';

export default class ExampleLayoutVue extends Onedeck.Module {
  init(path, state) {
    // console.log('init', this.constructor.name, path, state);
    console.log(this);
    VueApp.el = `#${this.$$rootElementId}`;
    this.VueApp = new Vue(VueApp);

    this.eventHandler();
  }

  eventHandler() {
    this.VueApp.$on('rout', (data) => this.$$route({
      path: data.url,
      state: data.state,
    }));

    this.VueApp.$on('showGlobalWnd', () => this.$$gemit('showGlobalWnd'));
  }

  dispatcher(path, state) {
    // console.log('dispatcher', this.constructor.name, path, state);
  }

  mounted(module, layout) {
    // console.log('mounted', this.constructor.name, module, layout);
  }

  destroy() {
    this.VueApp.$destroy();
    document.getElementById('ROOT').innerHTML = '';
  }
}
