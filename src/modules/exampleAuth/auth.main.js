import Module from "OneDeckCore/module"
import App from "ExampleAuth/App.vue"
import Vue from "vue"

/**
 * Class ExampleAuth
 * module use Vue
 */
export default class ExampleAuth extends Module {
  constructor() {
    super()
    this.VueApp = new Vue(App)
  }
}
