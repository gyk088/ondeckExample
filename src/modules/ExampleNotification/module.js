import Module from 'OneDeckCore/module';
import { Notify } from 'quasar';

/**
 * Class ExampleNotification
 * module use Vue
 */
export default class ExampleNotification extends Module {
  init(path, state) {
    console.log('init', this.constructor.name, path, state);
  }

  dispatcher(path, state) {
    console.log('dispatcher', this.constructor.name, path, state);

    Notify.create({
      color: 'teal',
      position: 'top-right',
      timeout: 5000,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
      message: `MODULE : ${path[0]}`,
    });
  }

  mounted(module, layout) {
    console.log('mounted', this.constructor.name, module, layout);
  }

  notify(text) {
    Notify.create({
      position: 'top',
      timeout: 500,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
      message: text,
    });
  }
}
