import QuasarConfif from "./quasar.config"
import ExampleRoot from "ExampleRoot/root.main"

QuasarConfif()

export default {
  historyApi: false,
  apiUrl: API_PREFIX,
  version: VERSION,
  rootPath: ROOT_PATH, // корневой путь для приложения
  rootModule: ExampleRoot,
  mainModule: 'main',
  module404: 'notfound',
  modules: {
    auth: {
      module: "ExampleAuth/auth.main",
      name: "Auth page",
      icon: "fa-camera",
    },
    main: {
      layout: "ExampleLayoutWebix/webix.layout",
      module: "ExampleWebix/webix.main",
      name: "Webix App",
      icon: "fa-camera",
      embed: {
        example: {
          module: "ExampleEmbed/embed.module"
        },
      }
    },
    vueApp: {
      layout: "ExampleLayoutWebix/webix.layout",
      module: "ExampleVue/vue.main",
      name: "Vue App",
      icon: "mdi-watch-import-variant",
      embed: {
        example: {
          module: "ExampleEmbed/embed.module",
        },
      }
    },
    reactApp: {
      layout: "ExampleLayoutVue/vue.layout",
      module: "ExampleReact/react.main",
      name: "React App",
      icon: "fa-address-book",
    },
    notfound: {
      layout: "ExampleLayoutWebix/webix.layout",
      module: "ExampleError404/error.main",
      name: "Not found page",
      icon: "fa-address-book",
    },
    globalwnd: {
      global: true,
      module: "ExampleGLobal/global.module",
      name: "Not found page",
      icon: "fa-address-book",
    },
    globalnotification: {
      global: true,
      module: "ExampleNotification/notification.module",
      name: "Not found page",
      icon: "fa-address-book",
    },
  }
}
