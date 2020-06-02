import React from "react"
import ReactDOM from "react-dom"
import App from "ExampleReact/component/App"
import "ExampleReact/index.css"
import "github-fork-ribbon-css/gh-fork-ribbon.css"
import Module from "OneDeckCore/module"
import Observable from "OneDeckCore/observ"
import axios from "axios"

/**
 * Class ExampleReact
 * module use React
 */
export default class ExampleReact extends Module {
  init (module, state) {
    console.log(module, state)

    this.reactApp = ReactDOM.render(
      <App />,
      document.getElementById("MainContent")
    )

    axios("/some.pl")

    let observ = new Observable()
    observ.install(this.reactApp)

    this.eventHandler()
  }

  eventHandler () {
    this.reactApp.$on("onSumm", summ => this.$$publish("examplEvent", summ))
    this.reactApp.$on("notify", btnmane => this.$$publish("notify", btnmane))
  }

  destroy () {
    ReactDOM.unmountComponentAtNode(document.getElementById("MainContent"))
  }
}
