/**
 * controller for WindowGlobal
 */
import Observable from 'OneDeckCore/observ';
import * as webix from 'webix';
import WindowGlobalUI from 'ExampleGLobal/views/window.ui';

export default class WindowGlobal extends Observable {
  constructor() {
    super();

    this.ui = new WindowGlobalUI();
    this.id = this.ui.id;
    this.app = webix.ui(this.ui);
    this.eventHandler();
  }

  eventHandler() {
    $$(`${this.id}BtnClose`).attachEvent('onItemClick', () => this.hide());
  }


  show() {
    this.app.show();
  }

  hide() {
    this.app.hide();
  }
}
