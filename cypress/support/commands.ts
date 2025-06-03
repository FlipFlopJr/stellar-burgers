/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    addIngredient(name: string): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('addIngredient', (name: string) => {
  return cy
    .contains('[data-cy="ingredient-card"]', name)
    .within(() => {
      cy.get('button').first().click();          
    });
});
