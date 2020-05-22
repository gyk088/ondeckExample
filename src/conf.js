import QuasarConfif from "./quasar.config"
import WebixApp from "ExampleWebix/webix.main"
import VueApp from "ExampleVue/vue.main"
import ReactApp from "ExampleReact/react.main"
import ExampleRoot from "ExampleRoot/root.main"
import ExampleAuth from "ExampleAuth/auth.main"
import ExampleLayoutVue from "ExampleLayoutVue/vue.layout"
import ExampleLayoutWebix from "ExampleLayoutWebix/webix.layout"

QuasarConfif()

export default {
  historyApi: true,
  apiUrl: API_PREFIX,
  rootPath: ROOT_PATH, // корневой путь для приложения
  rootModule: ExampleRoot,
  mainModule: 'main',
  modules: {
    auth: {
      module: ExampleAuth,
      name: "auth",
      icon: "fa-camera",
    },
    main: {
      layout: ExampleLayoutWebix,
      module: WebixApp,
      name: "webixApp",
      icon: "fa-camera",
    },
    vueApp: {
      layout: ExampleLayoutWebix,
      module: VueApp,
      name: "vueApp",
      icon: "mdi-watch-import-variant",
    },
    reactApp: {
      layout: ExampleLayoutVue,
      module: ReactApp,
      name: "reactApp",
      icon: "fa-address-book",
    }
  }
}
