import ExampleRoot from 'ExampleRoot/root';

export default {
  historyApi: false,
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
      mountId: 'ROOT',
      module: 'ExampleAuth',
      name: 'Auth page',
      icon: 'fa-camera',
    },
    main: {
      layout: 'ExampleLayoutVue',
      mountId: 'MainContent',
      module: 'ExampleWebix',
      name: 'Webix App',
      icon: 'fa-camera',
      embed: {
        example: {
          mountId: 'Embed',
          module: 'ExampleEmbed',
        },
      },
    },
    vueApp: {
      layout: 'ExampleLayoutWebix',
      module: 'ExampleVue',
      mountId: 'MainContent',
      name: 'Vue App',
      icon: 'mdi-watch-import-variant',
      embed: {
        example: {
          mountId: 'Embed',
          module: 'ExampleEmbed',
        },
      },
    },
    reactApp: {
      layout: 'ExampleLayoutVue',
      module: 'ExampleReact',
      mountId: 'MainContent',
      name: 'React App',
      icon: 'fa-address-book',
    },
    notfound: {
      mountId: 'MainContent',
      layout: 'ExampleLayoutWebix',
      module: 'ExampleError404',
      name: 'Not found page',
      icon: 'fa-address-book',
    },
    examplePage: {
      mountId: 'ROOT',
      module: 'ExamplePage',
      name: 'examplePage',
      icon: 'fa-address-book',
    },
    globalwnd: {
      global: true,
      module: 'ExampleGlobalWnd',
      icon: 'fa-address-book',
      embed: {
        example: {
          mountId: 'EmbedWnd',
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
