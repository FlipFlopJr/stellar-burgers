import reducer, { fetchIngredients } from '../ingredientsSlice';

describe('ingredientsSlice', () => {
  it('pending ставит isLoading=true', () => {
    const next = reducer(undefined, fetchIngredients.pending('', undefined));
    expect(next.isLoading).toBe(true);
  });

  it('fulfilled сохраняет данные', () => {
    const mock = [
      {
        _id: '1',
        name: 'test',
        type: 'bun',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 10,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];
    const next = reducer(
      undefined,
      fetchIngredients.fulfilled(mock, '', undefined)
    );
    expect(next.items).toEqual(mock);
    expect(next.isLoading).toBe(false);
  });

  it('rejected сохраняет ошибку', () => {
    const next = reducer(
      undefined,
      fetchIngredients.rejected(new Error('fail'), '', undefined, 'fail')
    );
    expect(next.error).toBe('fail');
    expect(next.isLoading).toBe(false);
  });
});
