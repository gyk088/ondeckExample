import Module from 'OneDeckCore/module';
import App from 'ExampleEmbed/App.vue';
import Vue from 'vue';

/**
 * Class ExampleEmbed
 * module use Vue
 */
export default class ExampleEmbed extends Module {
  init() {
    this.VueApp = new Vue(App);
    this.eventHandler();
  }

  eventHandler() {
    this.VueApp.$on('notify', () => this.$$publish('notify', `EMBED: ${this.moduleName}`));
  }

  dispatcher(module) {
    [this.moduleName] = module;
    this.VueApp.setData(this.moduleName);
  }

  destroy() {
    this.VueApp.$destroy();
    document.getElementById('Embed').innerHTML = '';
  }
}
