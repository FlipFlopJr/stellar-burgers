import reducer, { initialState } from './inventSlice';
import { inventoryFetch } from './inventSlice';

describe('inventorySlice: тесты для асинхронного получения ингредиентов', () => {
  it('устанавливает ошибку при отклонении запроса (rejected)', () => {
    const state = reducer(initialState, {
      type: inventoryFetch.rejected.type,
      error: { message: 'Error' }
    });
    expect(state.fetchError).toBe('Error');
  });

  it('устанавливает isLoading в true при начале запроса (pending)', () => {
    const state = reducer(initialState, { type: inventoryFetch.pending.type });
    expect(state.isLoading).toBe(true);
  });

  it('записывает полученные элементы в состояние при успешном запросе (fulfilled)', () => {
    const mockItems = [{ _id: '1', name: 'Test', type: 'main' }];
    const state = reducer(initialState, {
      type: inventoryFetch.fulfilled.type,
      payload: mockItems
    });
    expect(state.inventoryItems).toEqual(mockItems);
  });
});
