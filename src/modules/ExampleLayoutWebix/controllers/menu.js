/**
 * controller for RootMenuUI
 */
import Onedeck from 'onedeck';
import * as webix from 'webix';
import MenuUI from 'ExampleLayoutWebix/views/menu.ui';
import Module from 'ExampleLayoutWebix/module';

export default class Menu extends Onedeck.Observable {
  constructor() {
    super();

    this.ui = new MenuUI();
    this.id = this.ui.id;
    this.app = webix.ui(this.ui);
    this.eventHandler();
    this.createMenu();
  }

  eventHandler() {
    $$(`${this.id}List`).attachEvent('onAfterSelect', (key) => {
      $$(this.id).hide();
      this.$$emit('initModule', {
        url: `/${key}`,
        state: null,
      });
    });
  }

  createMenu() {
    const menu = [];
    const module = new Module();
    Object.keys(module.$$config.modules).forEach((key) => {
      const menuItem = module.$$config.modules[key];
      if (!menuItem.global) {
        menu.push({
          id: key,
          value: menuItem.name,
          icon: menuItem.icon,
          class: menuItem.class,
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
