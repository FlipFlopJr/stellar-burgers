import reducer, { initialState } from './userOrdersSlice';
import { liveOrdersFetch } from './userOrdersSlice';

describe('userOrdersSlice: тесты для загрузки живых заказов', () => {
  it('устанавливает ошибку при неудаче запроса (rejected)', () => {
    const state = reducer(initialState, {
      type: liveOrdersFetch.rejected.type,
      error: { message: 'fail' }
    });
    expect(state.fetchError).toBe('fail');
  });

  it('устанавливает флаг загрузки при начале запроса (pending)', () => {
    const state = reducer(initialState, { type: liveOrdersFetch.pending.type });
    expect(state.isLoading).toBe(true);
  });

  it('сохраняет заказы и счетчики при успешном ответе (fulfilled)', () => {
    const payload = { orders: [{ number: 1 }], total: 10, totalToday: 2 };
    const state = reducer(initialState, {
      type: liveOrdersFetch.fulfilled.type,
      payload
    });
    expect(state.liveOrders).toEqual(payload.orders);
    expect(state.totalCompleted).toBe(10);
    expect(state.completedToday).toBe(2);
  });
});
