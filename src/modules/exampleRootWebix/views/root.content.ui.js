/**
 * Class RootContentUI
 */
export default class RootContentUI {
  constructor() {
    this.id = "RootContent"
    return this.ui()
  }

  content() {
    return {
      template: '<div id="MainContent"></div>'
    }
  }

  toolBar() {
    return {
      view: "toolbar",
      id: this.id + "Toolbar",
      css: "onedeck_toolbar",
      elements: [
        { view: "icon", icon: "mdi mdi-menu", id: this.id + "MenuOpenBtn" },
        { view: "label", label: "OneDeck", id: this.id + "ToolbarLabel" },
        {},
        { view: "icon", icon: "mdi mdi-cogs", id: this.id + "MenuOpenConfig" }
      ]
    }
  }

  ui() {
    return {
      container: "root",
      id: this.id,
      rows: [this.toolBar(), this.content()]
    }
  }
}
