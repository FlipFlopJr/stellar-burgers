const BASE_URL = 'https://norma.nomoreparties.space/api'; // Это можно оставить, если используется для других целей

beforeEach(() => {
  cy.setupInterceptors(); // Используем кастомную команду для настройки интерсепторов
  cy.visit('/');
  cy.viewport(1280, 720);
  cy.wait('@loadIngredients');
  cy.get('#modals').as('modalContainer'); // Остается, так как alias привязан к DOM-элементу
});

describe('Конструктор бургера — взаимодействие с ингредиентами', () => {
  it('при добавлении ингредиента отображается счётчик', () => {
    cy.getIngredientFixtureData('main').then((mainIngredients) => {
      const mainItem = mainIngredients[0]; // Берем первый попавшийся "main" ингредиент
      cy.addIngredientToBurger(mainItem._id);
      cy.get(`[data-cy="${mainItem._id}"]`)
        .find('.counter__num')
        .should('have.text', '1');
    });
  });

  describe('Формирование бургера из ингредиентов', () => {
    it('при добавлении булочки, а затем начинки — отображаются оба элемента', () => {
      cy.getIngredientFixtureData('bun').then((buns) => {
        const bun = buns[0];
        cy.addIngredientToBurger(bun._id);
      });
      cy.getIngredientFixtureData('main').then((mainIngredients) => {
        const filling = mainIngredients[0];
        cy.addIngredientToBurger(filling._id);
      });
      // Здесь можно добавить дополнительные проверки, например, что булка и начинка
      // отображаются в соответствующих зонах конструктора.
      // cy.get('[data-cy="burger-constructor-bun-top"]').should('contain.text', bun.name);
      // cy.get('[data-cy="burger-constructor-filling"]').should('contain.text', filling.name);
    });

    it('при добавлении начинки до булочки — ингредиенты корректно отображаются', () => {
      cy.getIngredientFixtureData('main').then((mainIngredients) => {
        const filling = mainIngredients[0];
        cy.addIngredientToBurger(filling._id);
      });
      cy.getIngredientFixtureData('bun').then((buns) => {
        const bun = buns[0];
        cy.addIngredientToBurger(bun._id);
      });
      // Аналогично, можно добавить проверки на отображение в конструкторе
    });

    it('добавление нескольких одинаковых начинок увеличивает счётчик', () => {
      cy.getIngredientFixtureData('main').then((mainIngredients) => {
        const filling = mainIngredients[0];
        cy.addIngredientToBurger(filling._id);
        cy.addIngredientToBurger(filling._id);
        cy.get(`[data-cy="${filling._id}"]`)
          .find('.counter__num')
          .should('have.text', '2');
      });
    });

    it('не оформляет заказ без булочки — модалка не появляется', () => {
      cy.getIngredientFixtureData('main').then((mainIngredients) => {
        const filling = mainIngredients[0];
        cy.addIngredientToBurger(filling._id);
        cy.clickOrderButton();
        cy.get('@modalContainer', { timeout: 4000 }).should('be.empty'); // Тайм-аут для ожидания, что модалка НЕ появится
      });
    });
  });

  describe('Изменение булочки в бургере', () => {
    it('переназначение булочки без других ингредиентов', () => {
      cy.getIngredientFixtureData('bun').then((buns) => {
        cy.addIngredientToBurger(buns[0]._id);
        cy.get(`[data-cy="${buns[0]._id}"]`)
          .find('.counter__num')
          .should('have.text', '2'); // Булочка имеет счетчик 2
        cy.addIngredientToBurger(buns[1]._id);
        cy.get(`[data-cy="${buns[0]._id}"]`)
          .find('.counter__num')
          .should('not.exist'); // Старая булочка не должна иметь счетчика
        cy.get(`[data-cy="${buns[1]._id}"]`)
          .find('.counter__num')
          .should('have.text', '2'); // Новая булочка должна иметь счетчик 2
      });
    });

    it('замена булочки при наличии начинки в заказе', () => {
      cy.getIngredientFixtureData('bun').then((buns) => {
        cy.getIngredientFixtureData('main').then((mainIngredients) => {
          const bun1 = buns[0];
          const bun2 = buns[1];
          const main = mainIngredients[0];

          cy.addIngredientToBurger(bun1._id);
          cy.addIngredientToBurger(main._id);
          cy.addIngredientToBurger(bun2._id);

          // Проверки на счетчики:
          cy.get(`[data-cy="${bun1._id}"]`)
            .find('.counter__num')
            .should('not.exist'); // Старая булка должна быть сброшена
          cy.get(`[data-cy="${bun2._id}"]`)
            .find('.counter__num')
            .should('have.text', '2'); // Новая булка должна иметь счетчик 2
          cy.get(`[data-cy="${main._id}"]`)
            .find('.counter__num')
            .should('have.text', '1'); // Начинка должна остаться
        });
      });
    });
  });

  it('булочка отображается с двойным счётчиком (2 раза используется в заказе)', () => {
    cy.getIngredientFixtureData('bun').then((buns) => {
      const bun = buns[0];
      cy.addIngredientToBurger(bun._id);
      cy.get(`[data-cy="${bun._id}"]`)
        .find('.counter__num')
        .should('have.text', '2');
    });
  });
});

describe('Оформление заказа — взаимодействие с сервером', () => {
  beforeEach(() => {
    cy.setAuthTokens(); // Используем кастомную команду
  });

  afterEach(() => {
    cy.clearAuthTokens(); // Используем кастомную команду
  });

  it('при оформлении заказа отображается корректный номер', () => {
    cy.getIngredientFixtureData('bun').then((buns) => {
      cy.getIngredientFixtureData('main').then((mainIngredients) => {
        const bun = buns[0];
        const main = mainIngredients[0];

        cy.addIngredientToBurger(bun._id);
        cy.addIngredientToBurger(main._id);
        cy.clickOrderButton();

        cy.get('@modalContainer')
          .find('h2.text_type_digits-large')
          .invoke('text')
          .then((orderNumber) => {
            const number = orderNumber.trim();
            expect(number).to.match(/^\d+$/);
            cy.log('Номер заказа:', number);
          });
      });
    });
  });

  it('при оформлении заказа сначала появляется лоадер', () => {
    cy.getIngredientFixtureData('bun').then((buns) => {
      cy.getIngredientFixtureData('main').then((mainIngredients) => {
        const bun = buns[0];
        const main = mainIngredients[0];

        cy.addIngredientToBurger(bun._id);
        cy.addIngredientToBurger(main._id);
        cy.clickOrderButton();

        // Проверяем наличие лоадера или текста "Ваш заказ начали готовить"
        // (в зависимости от того, что появляется первым)
        cy.get('@modalContainer')
          .contains('p', 'Ваш заказ начали готовить')
          .should('be.visible');

        // Можно также добавить ожидание, что лоадер исчезнет,
        // а затем появится номер заказа (если лоадер отдельный элемент)
        // cy.get('[data-cy="order-loader"]').should('not.exist');
        // cy.get('@modalContainer').find('h2.text_type_digits-large').should('be.visible');
      });
    });
  });
});

describe('Модальные окна — открытие и закрытие', () => {
  it('открытие модального окна ингредиента по клику', () => {
    cy.getIngredientFixtureData('main').then((mainIngredients) => {
      const ingredient = mainIngredients[0];
      cy.openIngredientDetailsModal(ingredient._id);
      cy.url().should('include', ingredient._id);
    });
  });

  it('закрытие модального окна по клавише Escape', () => {
    cy.getIngredientFixtureData('main').then((mainIngredients) => {
      const ingredient = mainIngredients[0];
      cy.openIngredientDetailsModal(ingredient._id);
      cy.closeModalByEscape();
      cy.url().should('not.include', ingredient._id); // Проверяем, что URL вернулся
    });
  });

  it('закрытие модального окна по кнопке ✕', () => {
    cy.getIngredientFixtureData('main').then((mainIngredients) => {
      const ingredient = mainIngredients[0];
      cy.openIngredientDetailsModal(ingredient._id);
      cy.closeModalByCloseButton();
      cy.url().should('not.include', ingredient._id); // Проверяем, что URL вернулся
    });
  });

  it('закрытие модального окна по нажатию на overlay', () => {
    cy.getIngredientFixtureData('main').then((mainIngredients) => {
      const ingredient = mainIngredients[0];
      cy.openIngredientDetailsModal(ingredient._id);
      cy.closeModalByOverlayClick();
      cy.url().should('not.include', ingredient._id); // Проверяем, что URL вернулся
    });
  });
});
