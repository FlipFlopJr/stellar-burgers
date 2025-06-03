/// <reference types="cypress" />

describe('Burger constructor – happy path', () => {
  beforeEach(() => {
    // мокаем загрузку ингредиентов
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    // мокаем получение профиля
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    // мокаем оформление заказа
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // ставим авторизованные токены
    cy.setCookie('accessToken', 'fake-access-token');
    localStorage.setItem('refreshToken', 'fake-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку и соус в конструктор', () => {
    cy.addIngredient('Краторная булка');
    cy.addIngredient('Соус Spicy-X');

    cy.get('[data-cy="constructor-bun"]').should('have.length', 2);
    cy.get('[data-cy="constructor-ingredient"]').should('have.length', 1);
  });

  it('открывает и закрывает модалку ингредиента', () => {
    cy.contains('[data-cy="ingredient-card"]', 'Соус Spicy-X').click();
    cy.get('[data-cy="modal"]')
      .as('modal')
      .should('be.visible')
      .and('contain', 'Соус Spicy-X');

    // закрыть крестиком
    cy.get('[data-cy="modal-close"]').click();
    cy.get('@modal').should('not.exist');

    // открыть и закрыть кликом по оверлею
    cy.contains('[data-cy="ingredient-card"]', 'Соус Spicy-X').click();
    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });
    cy.get('@modal').should('not.exist');
  });

  it('оформляет заказ и очищает конструктор', () => {
    cy.addIngredient('Краторная булка');
    cy.addIngredient('Соус Spicy-X');

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get('[data-cy="modal"]').should('contain', '1234');
    cy.get('[data-cy="modal-close"]').click();

    cy.get('[data-cy="constructor-bun"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredient"]').should('have.length', 0);
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.clear();
  });
});
