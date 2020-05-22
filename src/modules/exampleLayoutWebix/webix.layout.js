/**
 * Class Root
 */
import "webix/webix.css"
import "webix/skins/mini.min.css"
import RootContent from "ExampleLayoutWebix/controllers/root.content"
import RootMenu from "ExampleLayoutWebix/controllers/root.menu"
import Module from "OneDeckCore/module"

import "ExampleLayoutWebix/scss/main.scss"

export default class ExampleLayoutWebix extends Module {
  init () {
    this.Content = new RootContent()
    this.Menu = new RootMenu(this.$$config)

    this.eventHandler()
  }

  eventHandler () {
    this.Content.$on("openMenu", () => {
      this.Menu.show()
    })

    this.Menu.$on("initModule", data =>
      this.$$rout({
        path: data.url,
        state: data.state
      })
    )
  }

  mounted (module, layout) {
    console.log(module)
    console.log(layout)
  }

  destroy () {
    this.Content.app.destructor()
    this.Menu.app.destructor()

    console.log(document.getElementById("ROOT"))
  }
}
