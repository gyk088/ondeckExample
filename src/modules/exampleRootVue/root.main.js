/**
 * Class Root
 */
import VueApp from "ExampleRootVue/App.vue"
import Vue from "vue"
import RootModule from "OneDeckCore/root.module"
import axios from "axios"

export default class Root extends RootModule {
  init() {
    VueApp.data.config = this.$$config
    this.VueApp = new Vue(VueApp)

    this.eventHandler()
  }

  eventHandler() {
    axios.interceptors.response.use(undefined, error => {
      this.ajaxError(error.response.data)
      return Promise.reject(error)
    })

    this.VueApp.$on("rout", data =>
      this.$$rout({
        path: data.url,
        state: data.state
      })
    )

    this.$$subscribe(this.$$modules.reactApp, "examplEvent", exampleData => {
      this.exampleAction(exampleData)
    })
  }

  exampleAction(exampleData) {
    console.log(exampleData)
  }

  ajaxError(error) {
    console.log(error)
  }
}
