/**
 * Class POUI
 */
export default class TableUI {
  constructor() {
    this.id = "Table"
    return this.ui()
  }

  columns () {
    return [
      { id: "id", header: "ID", css: { "text-align": "right" }, width: 50 },
      {
        id: "title",
        header: "Name",
        width: 250,
        template: "{common.treetable()} #title#"
      },
      { id: "description", header: "Description", fillspace: true },
      { id: "sort", header: "Sort", width: 150 },
      { id: "hidden", header: "Hidden", width: 150 }
    ]
  }

  ui () {
    return {
      id: this.id,
      container: "MainContent",
      view: "treetable",
      select: "row",
      selected: true,
      columns: this.columns(),
      height: 300,
    }
  }
}
