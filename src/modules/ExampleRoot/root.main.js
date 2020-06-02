/**
 * Class Root
 */
import "webix/webix.css"
import "webix/skins/mini.min.css"
import * as webix from "webix"
import RootModule from "OneDeckCore/root.module"
import axios from "axios"
import Cookies from "js-cookie"

export default class Root extends RootModule {
  init () {
    this.eventHandler()
  }

  eventHandler () {
    webix.attachEvent("onAjaxError", this.ajaxError)

    axios.interceptors.response.use(undefined, error => {
      this.ajaxError(error.response.data)
      return Promise.reject(error)
    })

    this.$$subscribe("examplEvent", exampleData => {
      this.exampleAction(exampleData)
      this.$$modules.globalwnd.show()
    })

    this.$$subscribe("showGlobalWnd", () => {
      this.$$modules.globalwnd.show()
    })

    this.$$subscribe("notify", text => {
      this.$$modules.globalnotification.notify(text)
    })
  }

  moduleMounted () {
    console.log(this.$$currentModule)
  }

  exampleAction (exampleData) {
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

  ajaxError (text) {
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
