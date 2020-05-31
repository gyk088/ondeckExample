/**
 * Class Root
 */
import VueApp from "ExampleLayoutVue/App.vue"
import Vue from "vue"
import Module from "OneDeckCore/module"

export default class ExampleLayoutVue extends Module {
  init () {
    VueApp.data.config = this.$$config
    this.VueApp = new Vue(VueApp)

    this.eventHandler()
  }

  eventHandler () {
    this.VueApp.$on("rout", data =>
      this.$$rout({
        path: data.url,
        state: data.state
      })
    )

    this.VueApp.$on("showGlobalWnd", () => this.$$publish("onShowGlobalWnd"))
  }

  destroy () {
    this.VueApp.$destroy()
    document.getElementById("ROOT").innerHTML = ""
  }
}