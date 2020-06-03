import Module from 'OneDeckCore/module';
import App from 'ExampleEmbed/App.vue';
import Vue from 'vue';

/**
 * Class ExampleEmbed
 * module use Vue
 */
export default class ExampleEmbed extends Module {
  init(path, state) {
    console.log('init', this.constructor.name, path, state);

    this.VueApp = new Vue(App);
    this.eventHandler();
  }

  eventHandler() {
    this.VueApp.$on('notify', () => this.$$gemit('notify', `EMBED: ${this.moduleName}`));
  }


  dispatcher(path, state) {
    console.log('dispatcher', this.constructor.name, path, state);

    [this.moduleName] = path;
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
