import Module from "OneDeckCore/module"
import App from "ExampleError404/App.vue"
import Vue from "vue"

/**
 * Class ExampleError404
 * module use Vue
 */
export default class ExampleError404 extends Module {
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
    document.getElementById("MainContent").innerHTML = ""
  }
}
