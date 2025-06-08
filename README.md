# Stellar Burger

**Stellar Burger** — это современное SPA-приложение для создания и заказа бургеров. Пользователи могут собирать собственные бургеры, оформлять заказы и отслеживать их в реальном времени.

---

## 🚀 Возможности

- Личный кабинет с историей заказов
- Покрытие тестами: Jest (юнит) и Cypress (e2e)
- Просмотр информации об ингредиентах в модальных окнах
- Регистрация, вход и выход из аккаунта
- Живая лента заказов (WebSocket)
- Оформление и отслеживание заказов

---

## 🛠️ Стек технологий

- React + Redux Toolkit
- TypeScript
- React Router v6
- Webpack (ручная настройка)
- Jest + React Testing Library
- Cypress для e2e тестирования
- UI-компоненты: `@zlden/react-developer-burger-ui-components`

---

## 📁 Структура проекта

```
src/
├── components/ # Компоненты интерфейса
├── pages/ # Страницы приложения
├── services/ # Redux slices, store
├── utils/ # Типы, API, утилиты
├── index.tsx # Входная точка приложения
├── cypress/ # Тесты и фикстуры для Cypress
├── public/ # Статические файлы
├── jest.config.ts # Конфигурация для Jest
├── tsconfig.json # Настройки TypeScript
└── webpack.config.js # Сборка проекта```

---

## 🚀 Как запустить

```bash
git clone https://github.com/FlipFlopJr/stellar-burger.git
cd stellar-burger
npm install

скрипты:  

Скрипт	     ---   Назначение
npm run start	   Запуск дев-сервера
npm run build	   Продакшен-сборка проекта
npm run test	   Запуск юнит-тестов
npm run cypress	   Открытие Cypress GUI
npm run lint	   Линтинг кода ESLint'ом
```
## Тесты
Redux-слайсы покрыты unit-тестами на Jest
```
Пользовательские сценарии протестированы через Cypress

После выполнения npm run test отображается покрытие
```

Аутентификация
```
JWT-авторизация: accessToken — в cookies, refreshToken — в localStorage

Защищённые маршруты: оформление заказа, личный кабинет, история заказов
```

---
📬 Автор  
GitHub: FlipFlopJr

