import QuasarConfif from "./quasar.config"
import WebixApp from "ExampleWebix/webix.main"
import VueApp from "ExampleVue/vue.main"
import ReactApp from "ExampleReact/react.main"
import ExampleRootVue from "ExampleRootVue/root.main"
import ExampleRootWebix from "ExampleRootWebix/root.main"
import ExampleAuth from "ExampleAuth/auth.main"

QuasarConfif()

export default {
  apiUrl: API_PREFIX,
  mainModule: 'main',
  rootPath: ROOT_PATH, // корневой путь для приложения
  modules: {
    root: {
      name: "root",
      hidden: true,
      class: window.innerWidth < 1300 ? ExampleRootVue : ExampleRootWebix
    },
    auth: {
      name: "auth",
      hidden: true,
      class: ExampleAuth
    },
    main: {
      name: "webixApp",
      hidden: false,
      icon: "fa-camera",
      class: WebixApp
    },
    vueApp: {
      name: "vueApp",
      hidden: false,
      icon: "mdi-watch-import-variant",
      class: VueApp
    },
    reactApp: {
      name: "reactApp",
      hidden: false,
      icon: "fa-address-book",
      class: ReactApp
    }
  }
}
