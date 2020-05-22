import Module from "OneDeckCore/module"
import App from "ExampleAuth/App.vue"
import Vue from "vue"

/**
 * Class ExampleAuth
 * module use Vue
 */
export default class ExampleAuth extends Module {
  init (path, state) {
    console.log(path, state)
    this.VueApp = new Vue(App)
    this.eventHandler()
  }

  eventHandler () {
    this.VueApp.$on("onAuth", () =>
      this.$$rout({
        path: `/main/`,
        state: null
      })
    )
  }

  destroy () {
    this.VueApp.$destroy()
    document.getElementById("ROOT").innerHTML = ""
  }
}
