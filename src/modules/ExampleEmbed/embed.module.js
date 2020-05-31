import Module from "OneDeckCore/module"
import App from "ExampleEmbed/App.vue"
import Vue from "vue"

/**
 * Class ExampleEmbed
 * module use Vue
 */
export default class ExampleEmbed extends Module {
  init () {
    this.VueApp = new Vue(App)
  }

  destroy () {
    this.VueApp.$destroy()
    document.getElementById("Embed").innerHTML = ""
  }
}
