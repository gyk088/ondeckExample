import "webix/webix.css"
import "webix/skins/mini.min.css"
import Table from "./controllers/table"
import Module from "../../core/module"
import * as webix from "webix"

/**
 * Class ExampleWebix
 * module use Webix
 */
export default class ExampleWebix extends Module {
  init (path, state) {
    console.log(path, state)

    this.Table = new Table()

    this.eventHandler()

    this.dispatcher(path, state)
  }

  destroy () {
    this.Table.destroy()
  }

  eventHandler () {
    // Открыть меню
    this.Table.$on("onClickRow", row => {
      console.log(row)
    })
  }

  dispatcher (module, state) {
    console.log(module)
    if (!module) return
    if (module[1] === "item")
      return this.showItem(state, module[2])
  }

  showItem (state, id) {
    let text = ""
    if (state) {
      Object.keys(state).forEach(key => {
        text += `${key} : ${state[key]} </br>`
      })
    } else {
      text = "API REQUEST IN THIS CASE"
    }

    webix.confirm({
      title: `ID: ${id}`,
      ok: "Yes",
      cancel: "No",
      type: "confirm-error",
      text: text,
      callback: result => {
        if (result) console.log("OK")
      }
    })
  }
}
