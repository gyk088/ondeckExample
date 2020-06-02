import Module from 'OneDeckCore/module';
import { Notify } from 'quasar';

/**
 * Class ExampleNotification
 * module use Vue
 */
export default class ExampleNotification extends Module {
  dispatcher(module) {
    Notify.create({
      color: 'teal',
      position: 'top-right',
      timeout: 5000,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
      message: `MODULE : ${module[0]}`,
    });
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
