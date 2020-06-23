/**
 * Class Root
 */
import 'webix/webix.css';
import 'webix/skins/mini.min.css';
import * as webix from 'webix';
import Onedeck from 'onedeck';
import axios from 'axios';
import ExampleNotification from 'ExampleNotification/module';
import ExampleGlobalWnd from 'ExampleGlobalWnd/module';

export default class Root extends Onedeck.RootModule {
  init (path) {
    console.log('init', this.constructor.name, path);

    this.eventHandler();
  }

  eventHandler () {
    webix.attachEvent('onAjaxError', this.ajaxError);

    axios.interceptors.response.use(undefined, (error) => {
      this.ajaxError(error.response.data);
      return Promise.reject(error);
    });

    this.$$on('examplEvent', (exampleData) => {
      this.exampleAction(exampleData);
    });

    this.$$on('showGlobalWnd', () => {
      const wnd = new ExampleGlobalWnd();
      wnd.show();
    });

    this.$$on('notify', (text) => {
      const notifyObj = new ExampleNotification();
      notifyObj.notify(text);
    });
  }

  dispatcher (path, state) {
    console.log('dispatcher', this.constructor.name, path, state);
  }

  mounted (module, layout) {
    console.log('mounted', this.constructor.name, module, layout);
  }

  exampleAction (exampleData) {
    webix.confirm({
      title: 'EXAMPLE EVENT',
      ok: 'Yes',
      cancel: 'No',
      type: 'confirm-error',
      text: `exampleData: ${exampleData}`,
    });
  }

  ajaxError (text) {
    webix.confirm({
      title: 'SERVER ERROR',
      ok: 'Yes',
      cancel: 'No',
      type: 'confirm-error',
      text: text || 'Please reload the page',
      callback: (result) => {
        if (result) {
          document.location.reload(true);
        }
      },
    });
  }
}
