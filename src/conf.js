import ExampleRoot from 'ExampleRoot/root';
import QuasarConfif from './quasar.config';

QuasarConfif();

export default {
  historyApi: true,
  apiUrl: API_PREFIX,
  version: VERSION,
  rootPath: ROOT_PATH, // корневой путь для приложения
  rootModule: ExampleRoot,
  mainModule: 'main',
  module404: 'notfound',
  rootElementId: 'ROOT',
  import: async (module) => await import(`./modules/${module}/module`),
  modules: {
    auth: {
      module: 'ExampleAuth',
      name: 'Auth page',
      icon: 'fa-camera',
    },
    main: {
      layout: 'ExampleLayoutWebix',
      module: 'ExampleWebix',
      name: 'Webix App',
      icon: 'fa-camera',
      // embed: {
      //   example: {
      //     module: 'ExampleEmbed',
      //   },
      // },
    },
    vueApp: {
      layout: 'ExampleLayoutWebix',
      module: 'ExampleVue',
      name: 'Vue App',
      icon: 'mdi-watch-import-variant',
      embed: {
        example: {
          module: 'ExampleEmbed',
        },
      },
    },
    reactApp: {
      layout: 'ExampleLayoutVue',
      module: 'ExampleReact',
      name: 'React App',
      icon: 'fa-address-book',
    },
    notfound: {
      layout: 'ExampleLayoutWebix',
      module: 'ExampleError404',
      name: 'Not found page',
      icon: 'fa-address-book',
    },
    globalwnd: {
      global: true,
      module: 'ExampleGlobalWnd',
      icon: 'fa-address-book',
      embed: {
        example: {
          module: 'ExampleEmbedGlobal',
        },
      },
    },
    globalnotification: {
      global: true,
      module: 'ExampleNotification',
      icon: 'fa-address-book',
    },
  },
};
