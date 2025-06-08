import reducer, { initialState } from './lookupOrderSlice';
import { fetchOrderDetails } from './lookupOrderSlice';

describe('orderLookupSlice', () => {
  it('сохраняет детали заказа, если запрос выполнен успешно', () => {
    const mockPayload = {
      orders: [{ number: 777 }]
    };

    const result = reducer(initialState, {
      type: fetchOrderDetails.fulfilled.type,
      payload: mockPayload
    });

    expect(result.orderDetails?.number).toBe(777);
  });

  it('отображает ошибку, если запрос завершился с ошибкой', () => {
    const result = reducer(initialState, {
      type: fetchOrderDetails.rejected.type,
      error: { message: 'Ошибка получения данных' }
    });

    expect(result.fetchError).toBe('Ошибка получения данных');
    expect(result.isFetching).toBe(false);
  });

  it('устанавливает флаг загрузки в true при запуске запроса', () => {
    const result = reducer(initialState, {
      type: fetchOrderDetails.pending.type
    });

    expect(result.isFetching).toBe(true);
    expect(result.fetchError).toBeNull();
  });
});
