# Проектная работа 11-го спринта

[Макет](<https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack_-Проектные-задачи-(3-месяца)_external_link?type=design&node-id=0-1&mode=design>)

[Чеклист](https://www.notion.so/praktikum/0527c10b723d4873aa75686bad54b32e?pvs=4)

## Общая структура  
```
/stellar-burgers
├─ src/                    # основной код приложения
│  ├─ components/          # UI-компоненты на React
│  ├─ services/            # Redux: слайсы, стор и редьюсер
│  └─ …
├─ cypress/                # End-to-end тесты (Cypress)
│  ├─ fixtures/            # JSON-данные для моков (ingredients.json и др.)
│  ├─ support/             # кастомные команды и настройки окружения
│  └─ e2e/                 # тестовые сценарии (constructor.cy.ts)
├─ tsconfig.json           # настройки TypeScript с алиасами
├─ jest.config.ts          # конфигурация Jest
├─ cypress.config.ts       # настройки Cypress
├─ package.json            # зависимости и скрипты
└─ README.md               # текущий файл
```

## Установка и запуск проекта
Установка зависимостей

```
npm install
```
Запуск дев-сервера
```
npm run start
```
Приложение будет доступно по адресу: http://localhost:4000

Запуск Storybook

```
npm run storybook
```

## Модульные тесты (Jest)
Обычный запуск:

```
npm test
```
В режиме наблюдения (watch):

```
npm run test:watch
```

## E2E-тестирование (Cypress)
Графический интерфейс:

```
npm run cypress
```
Запуск в headless-режиме:

```
npm run cypress:run
```