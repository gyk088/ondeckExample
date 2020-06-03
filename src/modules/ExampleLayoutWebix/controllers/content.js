/**
 * controller for RootContentUI
 */
import Observable from 'OneDeckCore/observ';
import * as webix from 'webix';
import ContentUI from 'ExampleLayoutWebix/views/content.ui';

export default class RootContent extends Observable {
  constructor() {
    super();

    this.ui = new ContentUI();
    this.id = this.ui.id;
    this.app = webix.ui(this.ui);
    this.eventHandler();
  }

  eventHandler() {
    $$(`${this.id}MenuOpenBtn`).attachEvent('onItemClick', () => this.$$emit('openMenu'));
    $$(`${this.id}GlobalWndBtn`).attachEvent('onItemClick', () => this.$$emit('onShowGlobalWnd'));
  }
}
