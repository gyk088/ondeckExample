/**
 * Class Root
 */
import 'webix/webix.css';
import 'webix/skins/mini.min.css';
import Content from 'ExampleLayoutWebix/controllers/content';
import Menu from 'ExampleLayoutWebix/controllers/menu';
import Onedeck from 'onedeck';

import 'ExampleLayoutWebix/scss/main.scss';

export default class ExampleLayoutWebix extends Onedeck.Module {
  init(path, state) {
    // console.log('init', this.constructor.name, path, state);

    this.Content = new Content();
    this.Menu = new Menu();

    this.eventHandler();
  }

  eventHandler() {
    this.Content.$$on('openMenu', () => {
      this.Menu.show();
    });

    this.Menu.$$on('initModule', (data) => this.$$route({
      path: data.url,
      state: data.state,
    }));

    this.Content.$$on('onShowGlobalWnd', () => this.$$gemit('showGlobalWnd'));
  }

  dispatcher(path, state) {
    // console.log('dispatcher', this.constructor.name, path, state);
  }

  mounted(module, layout) {
    // console.log('mounted', this.constructor.name, module, layout);
  }

  destroy() {
    this.Content.app.destructor();
    this.Menu.app.destructor();
  }
}
