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
import QuasarConfif from './quasar.config';

export default class Root extends Onedeck.RootModule {
  initState() {
    return {
      test1: {
        test3: null,
        test4: null,
      },
      test2: {
        test5: null,
        test6: null,
      },
      token: 'asdasdsdasdas',
    };
  }

  init(path) {
    QuasarConfif();

    console.log('init', this.constructor.name, path);
    this.$$gstore.watchers.test1.add('test', (data) => {
      console.log(data);
    });

    this.$$gstore.watchers.test1.remove('test');
    this.$$gstore.state.test1 = '23233222332';

    this.wnd = new ExampleGlobalWnd();
    this.notify = new ExampleNotification();

    this.eventHandler();
  }

  eventHandler() {
    webix.attachEvent('onAjaxError', this.ajaxError);

    axios.interceptors.response.use(undefined, (error) => {
      this.ajaxError('Request error');
      return Promise.reject(error);
    });

    this.$$on('examplEvent', (exampleData) => {
      this.exampleAction(exampleData);
    });

    this.$$on('showGlobalWnd', () => {
      this.wnd.show();
    });

    this.$$on('notify', (text) => {
      this.notify.notify(text);
    });
  }

  dispatcher(path, state) {
    console.log('dispatcher', this.constructor.name, path, state);
  }

  mounted(module, layout) {
    console.log('mounted', this.constructor.name, module, layout);
  }

  exampleAction(exampleData) {
    webix.confirm({
      title: 'EXAMPLE EVENT',
      ok: 'Yes',
      cancel: 'No',
      type: 'confirm-error',
      text: `exampleData: ${exampleData}`,
    });
  }

  ajaxError(text) {
    webix.confirm({
      title: 'SERVER ERROR',
      ok: 'Yes',
      width: 630,
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
