/**
 * Class ContentUI
 */

import Module from 'ExampleLayoutWebix/module';

export default class ContentUI {
  constructor() {
    this.id = 'Content';
    this.module = new Module();
    return this.ui();
  }

  content() {
    console.log('ExampleLayoutWebix', this.module);
    return {
      template: '<div id="MainContent"></div><div id="Embed"></div>',
    };
  }

  toolBar() {
    return {
      view: 'toolbar',
      id: `${this.id}Toolbar`,
      css: 'onedeck_toolbar',
      elements: [
        { view: 'icon', icon: 'mdi mdi-menu', id: `${this.id}MenuOpenBtn` },
        { view: 'label', label: 'OneDeck', id: `${this.id}ToolbarLabel` },
        {},
        { view: 'icon', icon: 'mdi mdi-cogs', id: `${this.id}GlobalWndBtn` },
      ],
    };
  }

  ui() {
    return {
      container: this.module.$$rootElementId,
      id: this.id,
      rows: [this.toolBar(), this.content()],
    };
  }
}
