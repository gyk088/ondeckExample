/**
 * controller for CatalogTableUI
 */
import * as webix from 'webix';
import Observable from 'OneDeckCore/observ';
import TableUI from 'ExampleWebix/views/table.ui';

export default class Table extends Observable {
  constructor() {
    super();

    this.ui = new TableUI();
    this.id = this.ui.id;
    this.app = webix.ui(this.ui);

    this.eventHandler();
    this.loadData();
  }

  destroy() {
    this.app.destructor();
  }

  eventHandler() {
    $$(this.id).attachEvent('onAfterSelect', (id) => this.$$emit('onClickRow', $$(this.id).getItem(id.row)));
  }

  loadData() {
    $$(this.id).parse(this.exampleData());
  }

  exampleData() {
    return [
      {
        id: '1',
        title: 'The Shawshank Redemption',
        hidden: true,
        sort: 15,
        description: 'The Shawshank Redemption',
        open: true,
        data: [
          { id: '1.1', title: 'Part 1', description: 'alpha' },
          {
            id: '1.2',
            title: 'Part 2',
            chaptdescriptioner: 'beta',
            open: true,
            data: [
              { id: '1.2.1', title: 'Part 1', description: 'beta-twin' },
              {
                id: '1.2.2',
                title: 'Part 1',
                chapdescriptionter: 'beta-twin',
              },
            ],
          },
          { id: '1.3', title: 'Part 3', description: 'gamma' },
        ],
      },
      {
        id: '2',
        title: 'The Godfather',
        data: [
          { id: '2.1', title: 'Part 1', description: 'alpha' },
          { id: '2.2', title: 'Part 2', description: 'beta' },
        ],
      },
    ];
  }
}
