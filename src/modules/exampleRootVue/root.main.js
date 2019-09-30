/**
 * Class Root
 */
import VueApp from "ExampleRootVue/App.vue"
import Vue from "vue"
import RootModule from "OneDeckCore/root.module"

export default class Root extends RootModule {
  init() {
    VueApp.data.config = this.$$config
    this.VueApp = new Vue(VueApp)

    this.eventHandler()
  }

  eventHandler() {
    this.VueApp.$on("rout", data =>
      this.$$rout({
        path: data.url,
        state: data.state
      })
    )
  }
}
