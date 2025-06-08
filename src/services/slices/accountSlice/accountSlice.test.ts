import accountReducer, {
  accountLogin,
  accountLogout,
  accountRegister,
  currentUserFetch,
  accountUpdateInfo,
  userOrdersFetch,
  clearUserData,
  clearAuthError,
  initialState
} from './accountSlice';

import { TOrder } from '@utils-types';

const mockUser = {
  name: 'Test User',
  email: 'test@example.com'
};

describe('accountSlice reducer and async actions', () => {
  it('возвращает initialState по умолчанию', () => {
    expect(accountReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // Проверка clearUserData action
  it('clearUserData очищает currentUser', () => {
    const loggedInState = { ...initialState, currentUser: mockUser };
    const state = accountReducer(loggedInState, clearUserData());
    expect(state.currentUser).toBeNull();
  });

  // Проверка accountRegister.fulfilled
  it('accountRegister.fulfilled обновляет currentUser и ставит isLoggedIn', () => {
    const action = {
      type: accountRegister.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = accountReducer(initialState, action);
    expect(state.currentUser).toEqual(mockUser);
    expect(state.isLoggedIn).toBe(true);
    expect(state.authError).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  // Проверка accountRegister.pending
  it('accountRegister.pending устанавливает isLoading и сбрасывает ошибку', () => {
    const action = { type: accountRegister.pending.type };
    const state = accountReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.authError).toBeNull();
    expect(state.hasCheckedAuth).toBe(true);
    expect(state.isLoggedIn).toBe(false);
  });

  // Проверка clearAuthError action
  it('clearAuthError сбрасывает authError', () => {
    const errorState = { ...initialState, authError: 'Ошибка' };
    const state = accountReducer(errorState, clearAuthError());
    expect(state.authError).toBeNull();
  });

  // Проверка accountRegister.rejected
  it('accountRegister.rejected устанавливает authError', () => {
    const errorMsg = 'Registration failed';
    const action = {
      type: accountRegister.rejected.type,
      error: { message: errorMsg }
    };
    const state = accountReducer(initialState, action);
    expect(state.authError).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
    expect(state.hasCheckedAuth).toBe(false);
  });

  // для accountLogin
  it('accountLogin.pending устанавливает флаги загрузки и сбрасывает ошибку', () => {
    const action = { type: accountLogin.pending.type };
    const state = accountReducer(initialState, action);
    expect(state.isLoggingIn).toBe(true);
    expect(state.authError).toBeNull();
    expect(state.isLoggedIn).toBe(false);
    expect(state.hasCheckedAuth).toBe(true);
  });

  it('accountLogin.fulfilled обновляет currentUser и снимает загрузку', () => {
    const action = {
      type: accountLogin.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = accountReducer(initialState, action);
    expect(state.currentUser).toEqual(mockUser);
    expect(state.isLoggedIn).toBe(true);
    expect(state.isLoggingIn).toBe(false);
    expect(state.authError).toBeNull();
  });

  it('accountLogin.rejected устанавливает ошибку и сбрасывает загрузку', () => {
    const errorMsg = 'Login failed';
    const action = {
      type: accountLogin.rejected.type,
      error: { message: errorMsg }
    };
    const state = accountReducer(initialState, action);
    expect(state.authError).toBe(errorMsg);
    expect(state.isLoggingIn).toBe(false);
    expect(state.hasCheckedAuth).toBe(false);
  });

  // Проверка accountLogout.pending
  it('accountLogout.pending ставит isLoading и сбрасывает ошибку', () => {
    const action = { type: accountLogout.pending.type };
    const loggedInState = { ...initialState, isLoggedIn: true };
    const state = accountReducer(loggedInState, action);
    expect(state.isLoading).toBe(true);
    expect(state.authError).toBeNull();
    expect(state.hasCheckedAuth).toBe(true);
    expect(state.isLoggedIn).toBe(true);
  });

  // Проверка accountLogout.fulfilled
  it('accountLogout.fulfilled очищает currentUser и сбрасывает состояния', () => {
    const loggedInState = {
      ...initialState,
      currentUser: mockUser,
      isLoggedIn: true
    };
    const action = { type: accountLogout.fulfilled.type };
    const state = accountReducer(loggedInState, action);
    expect(state.currentUser).toBeNull();
    expect(state.isLoggedIn).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.authError).toBeNull();
  });

  // Проверка accountLogout.rejected
  it('accountLogout.rejected устанавливает ошибку и не сбрасывает isLoggedIn', () => {
    const errorMsg = 'Logout failed';
    const loggedInState = { ...initialState, isLoggedIn: true };
    const action = {
      type: accountLogout.rejected.type,
      error: { message: errorMsg }
    };
    const state = accountReducer(loggedInState, action);
    expect(state.authError).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
    expect(state.isLoggedIn).toBe(true);
  });

  // Проверка currentUserFetch.fulfilled
  it('currentUserFetch.fulfilled обновляет currentUser и снимает загрузку', () => {
    const action = {
      type: currentUserFetch.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = accountReducer(initialState, action);
    expect(state.currentUser).toEqual(mockUser);
    expect(state.isLoggedIn).toBe(true);
    expect(state.isLoggingIn).toBe(false);
  });

  // Проверка currentUserFetch.rejected
  it('currentUserFetch.rejected сбрасывает состояния аутентификации', () => {
    const action = { type: currentUserFetch.rejected.type };
    const state = accountReducer(initialState, action);
    expect(state.isLoggedIn).toBe(false);
    expect(state.isLoggingIn).toBe(false);
    expect(state.hasCheckedAuth).toBe(false);
  });

  // Проверка accountUpdateInfo.fulfilled
  it('accountUpdateInfo.fulfilled обновляет authResponse и сбрасывает ошибки', () => {
    const action = {
      type: accountUpdateInfo.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = accountReducer(initialState, action);
    expect(state.authResponse).toEqual(mockUser);
    expect(state.authError).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  // Проверка accountUpdateInfo.rejected
  it('accountUpdateInfo.rejected устанавливает ошибку', () => {
    const errorMsg = 'Update failed';
    const action = {
      type: accountUpdateInfo.rejected.type,
      error: { message: errorMsg }
    };
    const state = accountReducer(initialState, action);
    expect(state.authError).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
  });

  // Проверка userOrdersFetch.fulfilled
  it('userOrdersFetch.fulfilled обновляет personalOrders', () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        ingredients: [],
        status: 'done',
        name: 'Order 1',
        createdAt: '',
        updatedAt: '',
        number: 123
      }
    ];
    const action = {
      type: userOrdersFetch.fulfilled.type,
      payload: mockOrders
    };
    const state = accountReducer(initialState, action);
    expect(state.personalOrders).toEqual(mockOrders);
    expect(state.isLoading).toBe(false);
    expect(state.authError).toBeNull();
  });

  // Проверка userOrdersFetch.pending
  it('userOrdersFetch.pending устанавливает isLoading', () => {
    const action = { type: userOrdersFetch.pending.type };
    const state = accountReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.authError).toBeNull();
  });

  // Проверка userOrdersFetch.rejected
  it('userOrdersFetch.rejected устанавливает ошибку', () => {
    const errorMsg = 'Orders fetch failed';
    const action = {
      type: userOrdersFetch.rejected.type,
      error: { message: errorMsg }
    };
    const state = accountReducer(initialState, action);
    expect(state.authError).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
  });
});
