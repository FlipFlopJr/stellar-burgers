import reducer, {
  addItem,
  removeItem,
  moveItemUp,
  moveItemDown,
  clearOrderDetails,
  toggleOrderRequest,
  initialState,
  TStateBurger
} from './burgerSlice';
import { TConstructorIngredient } from '@utils-types';

describe('burgerSlice: редьюсеры и асинхронные действия', () => {
  // Тестовые ингредиенты
  const bunIngredient: TConstructorIngredient = {
    _id: '123',
    name: 'Булка тестовая',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 500,
    image: '',
    image_mobile: '',
    image_large: '',
    id: 'bun-1'
  };

  const mainIngredient: TConstructorIngredient = {
    ...bunIngredient,
    type: 'main',
    id: 'main-1'
  };

  it('удаляет ингредиент из filling по id', () => {
    const filledState: TStateBurger = {
      ...initialState,
      builderData: {
        selectedBun: null,
        filling: [mainIngredient]
      }
    };
    const state = reducer(filledState, removeItem('main-1'));
    expect(state.builderData.filling).toHaveLength(0);
  });

  it('перемещает ингредиент вверх внутри filling', () => {
    const itemA = { ...mainIngredient, id: 'a' };
    const itemB = { ...mainIngredient, id: 'b' };
    const preState: TStateBurger = {
      ...initialState,
      builderData: {
        selectedBun: null,
        filling: [itemA, itemB]
      }
    };
    const state = reducer(preState, moveItemUp(1));
    // Ожидаем, что itemB поднимется вверх и станет на первую позицию
    expect(state.builderData.filling[0].id).toBe('b');
  });

  it('устанавливает состояние isOrdering через toggleOrderRequest', () => {
    const state = reducer(initialState, toggleOrderRequest(true));
    expect(state.isOrdering).toBe(true);
    const newState = reducer(state, toggleOrderRequest(false));
    expect(newState.isOrdering).toBe(false);
  });

  it('должен добавлять ингредиент типа "main" в список filling', () => {
    const state = reducer(initialState, addItem(mainIngredient));
    expect(state.builderData.filling).toHaveLength(1);
    expect(state.builderData.filling[0]._id).toBe(mainIngredient._id); // Сравниваем по _id
    expect(state.builderData.filling[0].type).toBe('main');
  });

  it('перемещает ингредиент вниз внутри filling', () => {
    const itemA = { ...mainIngredient, id: 'a' };
    const itemB = { ...mainIngredient, id: 'b' };
    const preState: TStateBurger = {
      ...initialState,
      builderData: {
        selectedBun: null,
        filling: [itemA, itemB]
      }
    };
    const state = reducer(preState, moveItemDown(0));
    // Ожидаем, что itemA опустится вниз и станет на вторую позицию
    expect(state.builderData.filling[1].id).toBe('a');
  });

  it('очищает детали заказа, сбрасывая orderDetails в null', () => {
    const modifiedState: TStateBurger = {
      ...initialState,
      orderDetails: {
        _id: 'order1',
        number: 123,
        status: 'done',
        name: 'Тестовый заказ',
        createdAt: '',
        updatedAt: '',
        ingredients: []
      }
    };
    const state = reducer(modifiedState, clearOrderDetails());
    expect(state.orderDetails).toBeNull();
  });

  it('должен корректно добавлять булку как selectedBun', () => {
    const state = reducer(initialState, addItem(bunIngredient));
    expect(state.builderData.selectedBun?._id).toBe('123');
  });

  describe('extraReducers для orderBurgerSubmit', () => {
    it('pending: активирует загрузку и процесс заказа', () => {
      const state = reducer(initialState, {
        type: 'burger/submitOrder/pending'
      });
      expect(state.isLoading).toBe(true);
      expect(state.isOrdering).toBe(true);
      expect(state.fetchError).toBeNull();
    });

    it('fulfilled: сохраняет детали заказа, очищает конструктор и сбрасывает состояние загрузки', () => {
      const orderPayload = {
        order: {
          _id: 'order123',
          number: 42,
          status: 'done',
          name: 'Бургер',
          createdAt: '2025-06-08',
          updatedAt: '2025-06-08',
          ingredients: []
        }
      };
      const action = {
        type: 'burger/submitOrder/fulfilled',
        payload: orderPayload
      };
      const preState: TStateBurger = {
        ...initialState,
        builderData: {
          selectedBun: bunIngredient,
          filling: [mainIngredient]
        },
        isLoading: true,
        isOrdering: true
      };
      const state = reducer(preState, action);
      expect(state.isLoading).toBe(false);
      expect(state.isOrdering).toBe(false);
      expect(state.fetchError).toBeNull();
      expect(state.orderDetails).toEqual(orderPayload.order);
      expect(state.builderData.selectedBun).toBeNull();
      expect(state.builderData.filling).toHaveLength(0);
    });

    it('rejected: останавливает загрузку, снимает флаг заказа и устанавливает ошибку', () => {
      const action = {
        type: 'burger/submitOrder/rejected',
        error: { message: 'Ошибка запроса' }
      };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.isOrdering).toBe(false);
      expect(state.fetchError).toBe('Ошибка запроса');
    });
  });
});
