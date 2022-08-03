import 'webix/webix.css';
import 'webix/skins/mini.min.css';
import * as webix from 'webix';
import Table from 'ExampleWebix/controllers/table';
import Onedeck from 'onedeck';

/**
 * Class ExampleWebix
 * module use Webix
 */
export default class ExampleWebix extends Onedeck.Module {
  init(path, state) {
    // console.log('init', this.constructor.name, path, state);

    this.Table = new Table();

    this.eventHandler();
  }

  destroy() {
    console.log('destroy');
    this.Table.destroy();
  }

  eventHandler() {
    // Открыть меню
    this.Table.$$on('onClickRow', (row) => {
      this.$$route({
        path: `/main/item/${row.id}`,
        state: row,
      });
    });
  }

  watchTest1(data) {
    this.showItem(data.newValue, data.newValue.id);
  }

  dispatcher(path, state) {
    // console.log('dispatcher', this.constructor.name, path, state);

    if (!path) return;
    // if (path[1] === 'item') this.showItem(state, path[2]);
  }

  mounted(module, layout) {
    // console.log('mounted', this.constructor.name, module, layout);
  }

  showItem(state, id) {
    let text = '';
    if (state) {
      Object.keys(state).forEach((key) => {
        text += `${key} : ${state[key]} </br>`;
      });
    } else {
      text = 'API REQUEST IN THIS CASE';
    }

    webix.confirm({
      title: `ID: ${id}`,
      ok: 'Yes',
      cancel: 'No',
      type: 'confirm-error',
      text,
      callback: (result) => {
        if (result) {
          // console.log('OK');
        }
      },
    });
  }
}
