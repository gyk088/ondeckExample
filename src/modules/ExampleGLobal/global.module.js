import Module from "OneDeckCore/module"
import WindowModule from "ExampleGLobal/comtrollers/window"

/**
 * Class ExampleGlobal
 * module use Vue
 */
export default class ExampleGlobal extends Module {
  constructor() {
    super()
    this.Window = new WindowModule()
    this.Window.show()
  }

  show () {
    this.Window.show()
  }
}
