import Onedeck from 'onedeck';
import Notify from 'simple-notify';
import 'simple-notify/dist/simple-notify.min.css';
import 'ExampleNotification/css/main.css';

/**
 * Class ExampleNotification
 * module use Vue
 */
export default class ExampleNotification extends Onedeck.Module {
  init(path, state) {
    // console.log('init', this.constructor.name, path, state);
  }

  dispatcher(path, state) {
    // console.log('dispatcher', this.constructor.name, path, state);
    this.notifyObj = new Notify({
      status: 'success',
      title: 'Notify Title',
      text: `MODULE : ${path[0]}`,
      effect: 'fade',
      speed: 300,
      customClass: null,
      customIcon: null,
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 3000,
      gap: 20,
      distance: 20,
      type: 1,
      position: 'right top',
    });
  }

  mounted(module, layout) {
    // console.log('mounted', this.constructor.name, module, layout);
  }

  notify(text) {
    // console.log('dispatcher', this.constructor.name, path, state);
    this.notifyObj = new Notify({
      status: 'success',
      title: 'Notify Title',
      text,
      effect: 'fade',
      speed: 300,
      customClass: null,
      customIcon: null,
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 1000,
      gap: 20,
      distance: 20,
      type: 1,
      position: 'right top',
    });
  }
}
