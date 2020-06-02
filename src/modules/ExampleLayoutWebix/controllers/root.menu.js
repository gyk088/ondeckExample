/**
 * controller for RootMenuUI
 */
import Observable from 'OneDeckCore/observ';
import * as webix from 'webix';
import RootMenuUI from 'ExampleLayoutWebix/views/root.menu.ui';

export default class RootMenu extends Observable {
  constructor(config) {
    super();
    this.config = config;
    this.ui = new RootMenuUI();
    this.id = this.ui.id;
    this.app = webix.ui(this.ui);
    this.eventHandler();
    this.createMenu();
  }

  eventHandler() {
    $$(`${this.id}List`).attachEvent('onAfterSelect', (key) => {
      $$(this.id).hide();
      this.$emit('initModule', {
        url: `/${key}`,
        state: null,
      });
    });
  }

  createMenu() {
    const menu = [];
    Object.keys(this.config.modules).forEach((key) => {
      const module = this.config.modules[key];
      if (!module.global) {
        menu.push({
          id: key,
          value: module.name,
          icon: module.icon,
          class: module.class,
        });
      }
    });
    $$(`${this.id}List`).parse(menu);
  }

  show() {
    if ($$(this.id).config.hidden) {
      $$(this.id).show();
    } else {
      $$(this.id).hide();
    }
  }
}
