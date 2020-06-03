import Module from 'OneDeckCore/module';
import App from 'ExampleEmbedGlobal/App.vue';
import Vue from 'vue';

/**
 * Class ExampleEmbedGlobal
 * module use Vue
 */
export default class ExampleEmbedGlobal extends Module {
  init(path, state) {
    console.log('init', this.constructor.name, path, state);

    this.VueApp = new Vue(App);
    this.eventHandler();
  }

  eventHandler() {
    this.VueApp.$on('notify', () => this.$$gemit('notify', `GLOBAL IN: ${this.moduleName}`));
  }


  dispatcher(path, state) {
    console.log('dispatcher', this.constructor.name, path, state);

    [this.moduleName] = path;
    console.log(this.moduleName);
    this.VueApp.setData(this.moduleName);
  }

  mounted(module, layout) {
    console.log('mounted', this.constructor.name, module, layout);
  }

  destroy() {
    this.VueApp.$destroy();
    document.getElementById('Embed').innerHTML = '';
  }
}
