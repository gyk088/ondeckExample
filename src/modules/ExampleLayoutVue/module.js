/**
 * Class Root
 */
import VueApp from 'ExampleLayoutVue/App.vue';
import Vue from 'vue';
import Module from 'OneDeckCore/module';

export default class ExampleLayoutVue extends Module {
  init(path, state) {
    console.log('init', this.constructor.name, path, state);
    this.VueApp = new Vue(VueApp);

    this.eventHandler();
  }

  eventHandler() {
    this.VueApp.$on('rout', (data) => this.$$rout({
      path: data.url,
      state: data.state,
    }));

    this.VueApp.$on('showGlobalWnd', () => this.$$gemit('showGlobalWnd'));
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
