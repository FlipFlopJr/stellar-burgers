import reducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun1',
  name: 'Булка 1',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

const sauce: TIngredient = { ...bun, _id: 'id2', type: 'sauce', name: 'Соус' };

describe('constructorSlice', () => {
  it('добавляет булку', () => {
    const next = reducer(undefined, setBun(bun));
    expect(next.bun?._id).toBe('bun1');
  });

  it('добавляет начинку', () => {
    const next = reducer(undefined, addIngredient(sauce));
    expect(next.ingredients).toHaveLength(1);
  });

  it('удаляет ингредиент', () => {
    const state = reducer(undefined, addIngredient(sauce));
    const id = state.ingredients[0].id;
    const next = reducer(state, removeIngredient(id));
    expect(next.ingredients).toHaveLength(0);
  });

  it('меняет порядок', () => {
    const first = { ...sauce, _id: '1', name: 'A' };
    const second = { ...sauce, _id: '2', name: 'B' };
    let state = reducer(undefined, addIngredient(first));
    state = reducer(state, addIngredient(second));
    const next = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    expect(next.ingredients[1]._id).toBe('1');
  });

  it('сбрасывает конструктор', () => {
    const filled = reducer(undefined, addIngredient(sauce));
    const next = reducer(filled, resetConstructor());
    expect(next).toEqual({ bun: null, ingredients: [] });
  });
});
