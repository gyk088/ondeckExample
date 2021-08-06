/**
 * controller for WindowGlobal
 */
import Onedeck from 'onedeck';
import * as webix from 'webix';
import WindowGlobalUI from 'ExampleGlobalWnd/views/window.ui';
import Module from 'ExampleGlobalWnd/module';

export default class WindowGlobal extends Onedeck.Observable {
  constructor() {
    super();

    this.module = new Module();
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
