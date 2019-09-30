# ONEDECK

Это универсальная обертка для написания модульного веб приложения
с использованием различных фреймоврков.
В примере есть реализации модулей с использованием следующих фреймворков:

1. [webix][1]
2. [vue][2] и [quasar][3]
3. [react][4]

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

[1]: https://webix.com/
[2]: https://vuejs.org/
[3]: https://quasar.dev/
[4]: https://reactjs.org/
