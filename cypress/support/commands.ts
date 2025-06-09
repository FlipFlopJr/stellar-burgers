// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const BASE_URL = 'https://norma.nomoreparties.space/api';
const INGREDIENTS_FIXTURE = 'ingredients.json';
const LOGS_USERS_FIXTURE = 'LogsUsers.json';
const RESPONSE_ORDER_FIXTURE = 'ResponseOrder.json';

// --- Кастомные команды для настройки моков API ---

Cypress.Commands.add('setupInterceptors', () => {
  cy.intercept('GET', `${BASE_URL}/ingredients`, {
    fixture: INGREDIENTS_FIXTURE
  }).as('loadIngredients');
  cy.intercept('POST', `${BASE_URL}/auth/login`, {
    fixture: LOGS_USERS_FIXTURE
  });
  cy.intercept('GET', `${BASE_URL}/auth/user`, { fixture: LOGS_USERS_FIXTURE });
  cy.intercept('POST', `${BASE_URL}/orders`, {
    fixture: RESPONSE_ORDER_FIXTURE
  });
});

// --- Кастомные команды для взаимодействия с UI ---

Cypress.Commands.add('addIngredientToBurger', (ingredientId) => {
  cy.get(`[data-cy="${ingredientId}"]`).find('button').click();
});

Cypress.Commands.add('openIngredientDetailsModal', (ingredientId) => {
  cy.get(`[data-cy="${ingredientId}"]`).find('a').click();
  cy.get('#modals').as('modalContainer').should('exist').and('not.be.empty');
});

Cypress.Commands.add('closeModalByEscape', () => {
  cy.get('body').trigger('keydown', { key: 'Escape' });
  cy.get('@modalContainer').should('be.empty');
});

Cypress.Commands.add('closeModalByCloseButton', () => {
  cy.get('@modalContainer').find('button').click(); // Предполагаем, что кнопка закрытия - это первая кнопка внутри модалки
  cy.get('@modalContainer').should('be.empty');
});

Cypress.Commands.add('closeModalByOverlayClick', () => {
  cy.get('[data-cy="overlay"]').click({ force: true });
  cy.get('@modalContainer').should('be.empty');
});

Cypress.Commands.add('clickOrderButton', () => {
  cy.get('[data-cy="order-button"]').click();
});

// --- Кастомные команды для работы с состоянием аутентификации ---

Cypress.Commands.add('setAuthTokens', () => {
  localStorage.setItem('refreshToken', 'test_refresh');
  cy.setCookie('accessToken', 'test_access');
});

Cypress.Commands.add('clearAuthTokens', () => {
  localStorage.clear();
  cy.clearCookies();
});

// --- Кастомная команда для получения данных фикстуры ---
Cypress.Commands.add('getIngredientFixtureData', (type) => {
  return cy.fixture(INGREDIENTS_FIXTURE).then(({ data }) => {
    if (type) {
      return data.filter((item) => item.type === type);
    }
    return data;
  });
});
