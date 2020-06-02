/**
 * Class WindowGlobalUI
 */
export default class WindowGlobalUI {
  constructor() {
    this.id = 'WindowGloba';
    return this.ui();
  }

  ui() {
    return {
      id: this.id,
      view: 'window',
      close: true,
      position: 'center',
      move: true,
      resize: true,
      head: {
        view: 'toolbar',
        cols: [
          { view: 'label', label: 'Global Window' },
          {
            view: 'button', label: 'Close Me', width: 100, align: 'right', id: `${this.id}BtnClose`,
          },
        ],
      },
      body: {
        template: 'GLobal Module',
      },
    };
  }
}
