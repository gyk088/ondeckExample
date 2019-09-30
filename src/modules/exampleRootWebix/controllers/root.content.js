/**
 * controller for RootContentUI
 */
import Observable from "OneDeckCore/observ"
import * as webix from "webix"
import RootContentUI from "ExampleRootWebix/views/root.content.ui"

export default class RootContent extends Observable {
  constructor() {
    super()

    this.ui = new RootContentUI()
    this.id = this.ui.id
    this.app = webix.ui(this.ui)
    this.eventHandler()
  }

  eventHandler() {
    $$(this.id + "MenuOpenBtn").attachEvent("onItemClick", (id, e) => {
      this.$emit("openMenu")
    })
  }
}
