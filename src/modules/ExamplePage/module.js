import Onedeck from 'onedeck';
import App from 'ExamplePage/App.vue';
import Vue from 'vue';

/**
 * Class ExamplePage
 * module use Vue
 */
export default class ExamplePage extends Onedeck.Module {
  init(path, state) {
    App.el = `#${this.$$mountId}`;
    this.VueApp = new Vue(App);
  }


  destroy() {
    this.$$offAll();
    // this.VueApp.$destroy();
    document.getElementById(this.$$mountId).innerHTML = '';
  }
}
