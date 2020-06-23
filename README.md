# ONEDECK

Это универсальная обертка для написания модульного веб приложения
с использованием различных фреймоврков.
В примере есть реализации модулей с использованием следующих фреймворков:

1. [webix][webix]
2. [vue][vue] и [quasar][quasar]
3. [react][react]

## Инструкция по использованию

Для запуска приложения необходимо создать файл webpack.constants.js на основании webpack.constants.js.example

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
    |   |-- images
    |   |   |--index.js
    |   |-- modules
    |   |   |--ExampleAuth
    |   |   |--ExampleEmbed
    |   |   |--ExampleEmbedGlobal
    |   |   |--ExampleError404
    |   |   |--ExampleGlobalWnd
    |   |   |--ExampleLayoutVue
    |   |   |--ExampleLayoutWebix
    |   |   |--ExampleNotification
    |   |   |--ExampleReact
    |   |   |--ExampleRoot
    |   |   |--ExampleVue
    |   |   |--ExampleWebix
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
- **src/modules/ExampleEmbed** - пример встраиваемого модуля (Vue)
- **src/modules/ExampleEmbedGlobal** - пример встраиваемого модуля в глобальный модуль (Vue)
- **src/modules/ExampleError404** - пример модуля 404 (Vue)
- **src/modules/ExampleGlobalWnd** - пример модуля глобального окна (Webix)
- **src/modules/ExampleLayoutVue** - пример модуля Layout (Vue)
- **src/modules/ExampleLayoutWebix** - пример модуля Layout (Webix)
- **src/modules/ExampleNotification** - пример глобального модуля для уведомлений (Vue)
- **src/modules/ExampleReact** - пример модуля на React
- **src/modules/ExampleRoot** - пример Root моудля
- **src/modules/ExampleVue** - пример модуля на Vue
- **src/modules/ExampleWebix** - пример модуля на Webix
- **src/config.js** - глобальный конфиг приложения
- **src/quasar.config.js** - конфиг для Quasar
- **src/index.html** - главный html шаблон
- **src/index.js** - точка входа


[webix]: https://webix.com/
[vue]: https://vuejs.org/
[quasar]: https://quasar.dev/
[react]: https://reactjs.org/
