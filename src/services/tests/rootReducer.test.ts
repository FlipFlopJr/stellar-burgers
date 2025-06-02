import { rootReducer } from '../store';
import store from '../store';

describe('rootReducer', () => {
  it('возвращает initialState при неизвестном экшене', () => {
    const expected = store.getState();
    const actual = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(actual).toEqual(expected);
  });
});
