import Onedeck from 'onedeck';
import App from 'ExampleEmbedGlobal/App.vue';
import Vue from 'vue';

/**
 * Class ExampleEmbedGlobal
 * module use Vue
 */
export default class ExampleEmbedGlobal extends Onedeck.Module {
  init(path, state) {
    // console.log('init', this.constructor.name, path, state);

    this.VueApp = new Vue(App);
    this.eventHandler();
  }

  eventHandler() {
    this.VueApp.$on('notify', () => this.$$gemit('notify', `GLOBAL IN: ${this.moduleName}`));
  }


  dispatcher(path, state) {
    // console.log('dispatcher', this.constructor.name, path, state);

    [this.moduleName] = path;
    this.VueApp.setData(this.moduleName);
  }

  mounted(module, layout) {
    // console.log('mounted', this.constructor.name, module, layout);
  }
}
