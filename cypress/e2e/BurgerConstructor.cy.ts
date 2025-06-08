const BASE_URL = 'https://norma.nomoreparties.space/api';

beforeEach(() => {
  cy.intercept('GET', `${BASE_URL}/ingredients`, {
    fixture: 'ingredients.json'
  }).as('loadIngredients');
  cy.intercept('POST', `${BASE_URL}/auth/login`, { fixture: 'LogsUsers.json' });
  cy.intercept('GET', `${BASE_URL}/auth/user`, { fixture: 'LogsUsers.json' });
  cy.intercept('POST', `${BASE_URL}/orders`, { fixture: 'ResponseOrder.json' });
  cy.visit('/');
  cy.viewport(1280, 720);
  cy.wait('@loadIngredients');
  cy.get('#modals').as('modalContainer');
});

describe('Конструктор бургера — взаимодействие с ингредиентами', () => {
  it('при добавлении ингредиента отображается счётчик', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const mainItem = data.find((item) => item.type === 'main');
      cy.get(`[data-cy="${mainItem._id}"]`).find('button').click();
      cy.get(`[data-cy="${mainItem._id}"]`)
        .find('.counter__num')
        .should('have.text', '1');
    });
  });

  describe('Формирование бургера из ингредиентов', () => {
    it('при добавлении булочки, а затем начинки — отображаются оба элемента', () => {
      cy.fixture('ingredients.json').then(({ data }) => {
        const bun = data.find((item) => item.type === 'bun');
        const filling = data.find((item) => item.type === 'main');
        cy.get(`[data-cy="${bun._id}"]`).find('button').click();
        cy.get(`[data-cy="${filling._id}"]`).find('button').click();
      });
    });

    it('при добавлении начинки до булочки — ингредиенты корректно отображаются', () => {
      cy.fixture('ingredients.json').then(({ data }) => {
        const bun = data.find((item) => item.type === 'bun');
        const filling = data.find((item) => item.type === 'main');
        cy.get(`[data-cy="${filling._id}"]`).find('button').click();
        cy.get(`[data-cy="${bun._id}"]`).find('button').click();
      });
    });
    it('добавление нескольких одинаковых начинок увеличивает счётчик', () => {
      cy.fixture('ingredients.json').then(({ data }) => {
        const filling = data.find((item) => item.type === 'main');

        cy.get(`[data-cy="${filling._id}"]`).find('button').click();
        cy.get(`[data-cy="${filling._id}"]`).find('button').click();

        cy.get(`[data-cy="${filling._id}"]`)
          .find('.counter__num')
          .should('have.text', '2');
      });
    });

    it('не оформляет заказ без булочки — модалка не появляется', () => {
      cy.fixture('ingredients.json').then(({ data }) => {
        const filling = data.find((item) => item.type === 'main');
        cy.get(`[data-cy="${filling._id}"]`).find('button').click();
        cy.get('[data-cy="order-button"]').click();
        cy.get('@modalContainer', { timeout: 4000 }).should('be.empty');
      });
    });
  });

  describe('Изменение булочки в бургере', () => {
    it('переназначение булочки без других ингредиентов', () => {
      cy.fixture('ingredients.json').then(({ data }) => {
        const buns = data.filter((item) => item.type === 'bun');
        cy.get(`[data-cy="${buns[0]._id}"]`).find('button').click();
        cy.get(`[data-cy="${buns[1]._id}"]`).find('button').click();
      });
    });

    it('замена булочки при наличии начинки в заказе', () => {
      cy.fixture('ingredients.json').then(({ data }) => {
        const buns = data.filter((item) => item.type === 'bun');
        const main = data.find((item) => item.type === 'main');
        cy.get(`[data-cy="${buns[0]._id}"]`).find('button').click();
        cy.get(`[data-cy="${main._id}"]`).find('button').click();
        cy.get(`[data-cy="${buns[1]._id}"]`).find('button').click();
      });
    });
  });

  it('булочка отображается с двойным счётчиком (2 раза используется в заказе)', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const bun = data.find((item) => item.type === 'bun');
      cy.get(`[data-cy="${bun._id}"]`).find('button').click();
      cy.get(`[data-cy="${bun._id}"]`)
        .find('.counter__num')
        .should('have.text', '2');
    });
  });
});

describe('Оформление заказа — взаимодействие с сервером', () => {
  beforeEach(() => {
    localStorage.setItem('refreshToken', 'test_refresh');
    cy.setCookie('accessToken', 'test_access');
  });

  afterEach(() => {
    localStorage.clear();
    cy.clearCookies();
  });

  it('при оформлении заказа отображается корректный номер', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const bun = data.find((item) => item.type === 'bun');
      const main = data.find((item) => item.type === 'main');

      cy.get(`[data-cy="${bun._id}"]`).find('button').click();
      cy.get(`[data-cy="${main._id}"]`).find('button').click();
      cy.get('[data-cy="order-button"]').click();

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

  it('при оформлении заказа сначала появляется лоадер', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const bun = data.find((item) => item.type === 'bun');
      const main = data.find((item) => item.type === 'main');

      cy.get(`[data-cy="${bun._id}"]`).find('button').click();
      cy.get(`[data-cy="${main._id}"]`).find('button').click();
      cy.get('[data-cy="order-button"]').click();

      cy.get('@modalContainer')
        .contains('p', 'Ваш заказ начали готовить')
        .should('be.visible');
    });
  });
});

describe('Модальные окна — открытие и закрытие', () => {
  it('открытие модального окна ингредиента по клику', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const ingredient = data.find((item) => item.type === 'main');
      cy.get(`[data-cy="${ingredient._id}"]`).find('a').click();
      cy.get('@modalContainer').should('exist').and('not.be.empty');
      cy.url().should('include', ingredient._id);
    });
  });

  it('закрытие модального окна по клавише Escape', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const ingredient = data.find((item) => item.type === 'main');
      cy.get(`[data-cy="${ingredient._id}"]`).find('a').click();
      cy.get('body').trigger('keydown', { key: 'Escape' });
      cy.get('@modalContainer').should('be.empty');
    });
  });

  it('закрытие модального окна по кнопке ✕', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const ingredient = data.find((item) => item.type === 'main');
      cy.get(`[data-cy="${ingredient._id}"]`).find('a').click();
      cy.get('@modalContainer').find('button').click();
      cy.get('@modalContainer').should('be.empty');
    });
  });

  it('закрытие модального окна по нажатию на overlay', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const ingredient = data.find((item) => item.type === 'main');
      cy.get(`[data-cy="${ingredient._id}"]`).find('a').click();
      cy.get('[data-cy="overlay"]').click({ force: true });
      cy.get('@modalContainer').should('be.empty');
    });
  });
});
