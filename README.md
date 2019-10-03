# ONEDECK

Это универсальная обертка для написания модульного веб приложения
с использованием различных фреймоврков.
В примере есть реализации модулей с использованием следующих фреймворков:

1. [webix][webix]
2. [vue][vue] и [quasar][quasar]
3. [react][react]

## Инструкция по использованию

Установка рабочего окружения:

    yarn install (npm install)

Запуск сервера для разработки:

    yarn start (npm run start)

Собрать приложение:

    yarn build (npm run build)

## Внутреннее устройство

```
|-- onedeck
    |-- dist
    |-- node_modules
    |-- src
    |   |-- core
    |   |   |--helpers.js
    |   |   |--module.js
    |   |   |--observ.js
    |   |   |--root.module.js
    |   |-- images
    |   |   |--index.js
    |   |-- modules
    |   |   |--exampleAuth
    |   |   |--exampleReact
    |   |   |--exampleRootVue
    |   |   |--exampleRootWebix
    |   |   |--exampleVue
    |   |   |--exampleWebix
    |   |-- config.js
    |   |-- quasar.config.js
    |   |-- index.html
    |   |-- index.js
    |-- .gitignore
    |-- package.json
    |-- postcss.config.js
    |-- README.md
    |-- webpack.config.js
```

- **dist** - папка для хранения скомпилированных файлов
- **src** - весь код программы
- **src/core** - базовые классы для модулей и helpers
- **src/images** - файлы с расширением png|jpeg|jpg|svg
- **src/modules** - модули приложения
- **src/modules/exampleAuth** - пример модуля для авторизации (Vue)
- **src/modules/exampleReact** - пример модуля на React
- **src/modules/exampleRootVue** - пример root модуля на Vue
- **src/modules/exampleRootWebix** - пример root модуля на Webix
- **src/modules/exampleVue** - пример модуля на Vue
- **src/modules/exampleWebix** - пример модуля на Webix
- **src/config.js** - глобальный конфиг приложения
- **src/quasar.config.js** - конфиг для Quasar
- **src/index.html** - главный html шаблон
- **src/index.js** - точка входа

## Модули

Модуль (в контексте данной архитектуры) - это объект которы содержит в себе отдельное веб приложение. Отдельное веб приложение можно собрать вне проекта, при этом внести минимальные правки в код. Модули могут общаться друг с другом при помощи роутинга (метод $$rout), или при помощи пользовательских событий (метод $$publish)

### Главный модуль Root

Модуль Root - это главный модуль всего приложения, он должен быть наследником класса RootMediator (core/root.module.js). Этот класс реализует паттерн [Посредник][mediator]. Он определяет интерфейс для обмена информацией между модулями.

### Модуль

Модуль приложения является оберткой для отдельного веб приложения. Должен быть наследником обстрактного класса Module (core/module.js).

## Пример реализации веб приложения с использованием модульной архитектуры

### Точка входа src/index.js

```
import "Images"
import Config from "./conf"
import Cookies from "js-cookie"

document.addEventListener("DOMContentLoaded", () => {
  let token = Cookies.get("token")

  if (token) {
    new Config.modules["root"].class(Config)
  } else {
    new Config.modules["auth"].class(Config)
  }
})
```

В этом примере реализована простейшая авторизация.

### Config src/conf.js

Config - это файл с настройками нашего приложения. Он подключает все модули приложения, и дополнительные настройки по необходимости.
В примере мы вызываем настройки для [Quasar][quasar] с помощью функции `QuasarConfif()`.

```
import QuasarConfif from "./quasar.config"
import WebixApp from "ExampleWebix/webix.main"
import VueApp from "ExampleVue/vue.main"
import ReactApp from "ExampleReact/react.main"
import ExampleRootVue from "ExampleRootVue/root.main"
import ExampleRootWebix from "ExampleRootWebix/root.main"
import ExampleAuth from "ExampleAuth/auth.main"

QuasarConfif()

export default {
  apiUrl: "http://localhost:3000/api/",
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
```

Объект `modules` содержит в себе объекты с настройками для каждого модуля. Ключем каждого объекта является название модуля, которе используется при роутинге. Например если мы находимся в модуле `vueApp` url будет соответствовать `http://localhost:9001/vueApp`

Объект `modules` долже содеражть следущие обязательные модули:

`root` - модуль контейнер, содержит в себе все модули приложения;

`main` - модуль для главной страницы;

`auth` - модуль авторизации, в случае если она нам необходима;

**Параметры модуля:**

`hidden` (обязательный параметр) - это параметр указывает на то, что этот модуль должен быть скрыт от модуля root. Например модуль root не может сам себя инициализировать, или модуль авторизации (у него отдельная логика работы);

`class` (обязательный параметр) - это параметр содержит в себе класс модуля;

`name` (необязательный параметр) - в данном примере мы используем этот параметр для названия модуля в меню приложения. При клике на пункт меню мы попадаем в модуль который выбрали;

`icon` (необязательный параметр) - это парамет содержит в себе название иконки для вывода в меню;

Обект модуля может содержать в себе любые необходимые нам настройки данного модуля.

В зависимости от различных параметров `class: window.innerWidth < 1300 ? ExampleRootVue : ExampleRootWebix` мы можем использовать различные реализации модулей.

### Пример модуля

```
import React from "react"
import ReactDOM from "react-dom"
import App from "ExampleReact/component/App"
import "ExampleReact/index.css"
import "github-fork-ribbon-css/gh-fork-ribbon.css"
import Module from "OneDeckCore/module"
import Observable from "OneDeckCore/observ"
import axios from "axios"

/**
 * Class ExampleReact
 * module use React
 */
export default class ExampleReact extends Module {
  init(path, state) {
    console.log(path, state)

    this.reactApp = ReactDOM.render(
      <App />,
      document.getElementById("MainContent")
    )

    let observ = new Observable()
    observ.install(this.reactApp)

    this.eventHandler()
  }

  eventHandler() {
    this.reactApp.$on("onSumm", summ => this.$$publish("examplEvent", summ))
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(document.getElementById("MainContent"))
  }
}
```

Каждый модуль (кроме авторизации) содержит в себе следущие методы:

`init(path, state)` - инициализация модуля и вызов метода `eventHandler()`. Метод принимает два параметра:

`path` - урл при инициализации модуля;

`state` - данные которые передали при инициализации данного модуля;

`eventHandler()` - обработчик событий, содрежит в себе события уровня модуля, вызывается из метода `init()`;

`destroy()` - деструктор модуля. Чистит DOM дерево, отписывается от событий уровня модуля;

Каждый модуль может вызвать метод `this.$$rout` - для роутинга и `this.$$publish` - для публикации события.

`this.$$rout({path, state})` - перейти на указанный урл `path` и передать данные `state`:

`obj.path` - урл вида `/module_name/item/1` первый элемент урла должен быть названием модуля, остальные элементы в произвольной форме;

`state` - объект с данными которые мы передаем по указанному урлу;

`this.$$publish(eventName, eventData)` - вызвать пользовательское событие eventName и передать в него данные eventData:

`eventName` - название события;

`eventData` - данные события;

В данном примере для реализации модуля мы используем библиотеку [React][react]. Так как классовый [React][react] компонент не реализует паттерн [Наблюдатель][observer], мы добавляем в него данную функциональность `observ.install(this.reactApp)`.

Методы класса Observable `src/core/observ.js

`$on(channel, cb)` - подписаться на событие:

`channel` - название события;

`cb` - коллбэк функция для обработки события;

`$onOnce(channel, cb)` - подписаться на событие, событие сработает один раз:

`channel` - название события;

`cb` - коллбэк функция для обработки события;

`$off(channel, cb)` - отписаться от события:

`channel` - название события;

`cb` - коллбэк функция;

`$emit(channel, data)` - публикация события:

`channel` - название события;

`data` - данные события;

`install(obj)` - установить в объект паттерн [Наблюдатель][observer]:

`obj` - объект для которго необходимо установить паттерн [Наблюдатель][observer];

### Пример модуля Root

```
/**
 * Class Root
 */
import VueApp from "ExampleRootVue/App.vue"
import Vue from "vue"
import RootModule from "OneDeckCore/root.module"
import axios from "axios"

export default class Root extends RootModule {
  init() {
    VueApp.data.config = this.$$config
    this.VueApp = new Vue(VueApp)

    this.eventHandler()
  }

  eventHandler() {
    axios.interceptors.response.use(undefined, error => {
      this.ajaxError(error.response.data)
      return Promise.reject(error)
    })

    this.VueApp.$on("rout", data =>
      this.$$rout({
        path: data.url,
        state: data.state
      })
    )

    this.$$subscribe(this.$$modules.reactApp, "examplEvent", exampleData => {
      this.exampleAction(exampleData)
    })
  }

  exampleAction(exampleData) {
    console.log(exampleData)
  }

  ajaxError(error) {
    console.log(error)
  }
}
```

Модуль Root - Глобальный модуль всего приложения, содержит в себе глобальные события, например событие ошибки при ajax запросе `{axios.interceptors.response.use}`. Является медиатором (посредником), общение остальных модулей происходит через данный модуль. В нем мы можем подписывать остальные модули на глобальные пользовательсике события с помощь методоа `{this.$$subscribe}`. В Root модуле нет метода `destroy()`.

`this.$$subscribe(moduleObj, eventName, cb)` - подписать модуль на пользовательское событие.

`moduleObj` - объект модуля;

`eventName` - название события;

`cb` - коллбэк функция для обработки события;

`this.$$modules` - объек с модулями.

### Пример модуля Auth (авторизации)

```
import Module from "OneDeckCore/module"
import App from "ExampleAuth/App.vue"
import Vue from "vue"

/**
 * Class ExampleAuth
 * module use Vue
 */
export default class ExampleAuth extends Module {
  constructor() {
    super()
    this.VueApp = new Vue(App)
  }
}
```

Модуль auth в простейшей реализации содержит в себе только конструктор, в котором происходит инициализация приложения для авторизации.

## Роутинг

Роутинг основан на [html5 history api][rout]. Каждый модуль содержит метод `$$rout({path, state})`. Первым элементом урл адреса всегда явлется название модуля (ключ объекта modules в конфиге).

`this.$$rout({path, state})` - перейти на указанный урл `path` и передать данные `state`:

`obj.path` - урл вида `/module_name/item/1` первый элемент урла должен быть названием модуля, остальные элементы в произвольной форме;

`state` - объект с данными которые мы передаем по указанному урлу;

**Переход на новый модуль:**

1. Вызываем в текущем модуле метод `destroy()`

2. Вызываем в новом модуле метод `init(path, state)`:

   `path` - текущий урл

   `state` - объект с данными который передали при переходе

**Переход в текущем модуле:**

1. Вызываем в текущем модуле метод `dispatcher(path, state)`:

   `path` - текущий урл

   `state` - объект с данными который передали при переходе

[webix]: https://webix.com/
[vue]: https://vuejs.org/
[quasar]: https://quasar.dev/
[react]: https://reactjs.org/
[mediator]: https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D1%81%D1%80%D0%B5%D0%B4%D0%BD%D0%B8%D0%BA_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)
[observer]: https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D0%B1%D0%BB%D1%8E%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D1%8C_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)
[rout]: https://developer.mozilla.org/ru/docs/Web/API/History_API
