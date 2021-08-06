import Onedeck from 'onedeck';
import App from 'ExampleEmbed/App.vue';
import Vue from 'vue';

/**
 * Class ExampleEmbed
 * module use Vue
 */
export default class ExampleEmbed extends Onedeck.Module {
  init(path, state) {
    // console.log('init', this.constructor.name, path, state);

    this.VueApp = new Vue(App);

    this.listeners = {
      notify: (str) => this.$$gemit('notify', str),
    };

    this.eventHandler();
  }

  eventHandler() {
    this.$$on('notify', this.listeners.notify);
  }

  dispatcher(path, state) {
    // console.log('dispatcher', this.constructor.name, path, state);

    [this.moduleName] = path;
    this.VueApp.setData(this.moduleName);
  }

  mounted(module, layout) {
    // console.log('mounted', this.constructor.name, module, layout);
  }

  destroy() {
    this.$$offAll();

    this.VueApp.$destroy();
    document.getElementById('Embed').innerHTML = '';
  }
}
