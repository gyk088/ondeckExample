import Onedeck from 'onedeck';
import WindowModule from 'ExampleGlobalWnd/comtrollers/window';

/**
 * Class ExampleGlobalWnd
 * module use Vue
 */
export default class ExampleGlobalWnd extends Onedeck.Module {
  init(path, state) {
    // console.log('init', this.constructor.name, path, state);

    this.Window = new WindowModule();
    //this.Window.show();
  }

  dispatcher(path, state) {
    // console.log('dispatcher', this.constructor.name, path, state);
  }

  mounted(module, layout) {
    // console.log('mounted', this.constructor.name, module, layout);
  }

  show() {
    this.Window.show();
  }
}
