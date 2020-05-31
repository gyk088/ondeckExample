import QuasarConfif from "./quasar.config"
import WebixApp from "ExampleWebix/webix.main"
import VueApp from "ExampleVue/vue.main"
import ReactApp from "ExampleReact/react.main"
import Error404 from "ExampleError404/error.main"
import ExampleRoot from "ExampleRoot/root.main"
import ExampleAuth from "ExampleAuth/auth.main"
import ExampleLayoutVue from "ExampleLayoutVue/vue.layout"
import ExampleLayoutWebix from "ExampleLayoutWebix/webix.layout"
import ExampleGlobal from "ExampleGLobal/global.module"
import ExampleEmbed from "ExampleEmbed/embed.module"

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
      module: ExampleAuth,
      name: "Auth page",
      icon: "fa-camera",
    },
    main: {
      layout: ExampleLayoutWebix,
      module: window.innerWidth < 1300 ? VueApp : WebixApp,
      name: "Webix App",
      icon: "fa-camera",
      embed: {
        example: {
          module: ExampleEmbed
        },
      }
    },
    vueApp: {
      layout: ExampleLayoutWebix,
      module: VueApp,
      name: "Vue App",
      icon: "mdi-watch-import-variant",
      embed: {
        example: {
          module: ExampleEmbed
        },
      }
    },
    reactApp: {
      layout: ExampleLayoutVue,
      module: ReactApp,
      name: "React App",
      icon: "fa-address-book",
    },
    notfound: {
      layout: ExampleLayoutWebix,
      module: Error404,
      name: "Not found page",
      icon: "fa-address-book",
    },
    globalwnd: {
      global: true,
      module: ExampleGlobal,
      name: "Not found page",
      icon: "fa-address-book",
    },
  }
}
