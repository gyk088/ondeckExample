/**
 * Class Root
 */
import "webix/webix.css"
import "webix/skins/mini.min.css"
import RootContent from "ExampleRootWebix/controllers/root.content"
import RootMenu from "ExampleRootWebix/controllers/root.menu"
import * as webix from "webix"
import RootModule from "OneDeckCore/root.module"
import axios from "axios"
import Cookies from "js-cookie"
import "ExampleRootWebix/scss/main.scss"

export default class Root extends RootModule {
  init() {
    this.Content = new RootContent()
    this.Menu = new RootMenu(this.$$config)

    this.eventHandler()
  }

  eventHandler() {
    webix.attachEvent("onAjaxError", this.ajaxError)

    axios.interceptors.response.use(undefined, error => {
      this.ajaxError(error.response.data)
      return Promise.reject(error)
    })

    this.Content.$on("openMenu", () => {
      this.Menu.show()
    })

    this.Menu.$on("initModule", data =>
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
    webix.confirm({
      title: "EXAMPLE EVENT",
      ok: "Yes",
      cancel: "No",
      type: "confirm-error",
      text: `exampleData: ${exampleData}`,
      callback: result => {
        if (result) console.log("OK")
      }
    })
  }

  ajaxError(text) {
    webix.confirm({
      title: "SERVER ERROR",
      ok: "Yes",
      cancel: "No",
      type: "confirm-error",
      text: text ? text : "Please reload the page",
      callback: result => {
        if (result) {
          Cookies.remove("token")
          document.location.reload(true)
        }
      }
    })
  }
}
