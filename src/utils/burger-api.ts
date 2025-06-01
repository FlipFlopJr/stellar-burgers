// src/utils/burger-api.ts

import { setCookie, getCookie, deleteCookie } from './cookie';
import {
  TIngredient,
  TOrder,
  TOrdersData,
  TUser,
  TRegisterData,
  TLoginData
} from './types';

const URL = process.env.BURGER_API_URL;

// Обёртка для проверки fetch-ответа
const checkResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json();
  if (!res.ok) {
    return Promise.reject(data);
  }
  return data;
};

// Общий тип ответа от сервера
type TServerResponse<T> = {
  success: boolean;
} & T;

// Тип для ответа refresh-запроса
type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

// Сохраняем токены в cookie/localStorage
const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// 1) Refresh токена при истёкшем JWT
export const refreshToken = async (): Promise<TRefreshResponse> => {
  const res = await fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });
  const data = await checkResponse<TRefreshResponse>(res);
  if (!data.success) {
    return Promise.reject(data);
  }
  // Сохраняем новые токены
  saveTokens(data.accessToken, data.refreshToken);
  return data;
};

// 2) Универсальный fetch с авто-refresh
export const fetchWithRefresh = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err: any) {
    // Если JWT истёк — пробуем обновить
    if (err?.message === 'jwt expired') {
      const refreshData = await refreshToken();
      // Перезаписываем куку заново, на случай чего
      setCookie('accessToken', refreshData.accessToken);
      // Повторный запрос с новым токеном
      const retry = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers as Record<string, string>),
          authorization: refreshData.accessToken
        }
      });
      return await checkResponse<T>(retry);
    }
    return Promise.reject(err);
  }
};

// 3) Получить список ингредиентов
export const getIngredientsApi = async (): Promise<TIngredient[]> => {
  const res = await fetch(`${URL}/ingredients`);
  const data =
    await checkResponse<TServerResponse<{ data: TIngredient[] }>>(res);
  if (!data.success) {
    return Promise.reject(data);
  }
  return data.data;
};

// 4) Получить все заказы (public)
export const getFeedsApi = async (): Promise<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}> => {
  const res = await fetch(`${URL}/orders/all`);
  const data = await checkResponse<TServerResponse<TOrdersData>>(res);
  if (!data.success) {
    return Promise.reject(data);
  }
  return {
    orders: data.orders,
    total: data.total,
    totalToday: data.totalToday
  };
};

// 5) Получить заказы авторизованного пользователя
export const getOrdersApi = async (): Promise<TOrder[]> => {
  const data = await fetchWithRefresh<TServerResponse<TOrdersData>>(
    `${URL}/orders`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: getCookie('accessToken') || ''
      }
    }
  );
  if (!data.success) {
    return Promise.reject(data);
  }
  return data.orders;
};

// 6) Оформить новый заказ
export const orderBurgerApi = async (
  ingredients: string[]
): Promise<{ order: TOrder; name: string }> => {
  const data = await fetchWithRefresh<
    TServerResponse<{
      order: TOrder;
      name: string;
    }>
  >(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') || ''
    },
    body: JSON.stringify({ ingredients })
  });
  if (!data.success) {
    return Promise.reject(data);
  }
  return data;
};

// 7) Получить заказ по номеру (public)
export const getOrderByNumberApi = async (
  orderNumber: number
): Promise<{ orders: TOrder[] }> => {
  const res = await fetch(`${URL}/orders/${orderNumber}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return await checkResponse<TServerResponse<{ orders: TOrder[] }>>(res);
};

// 8) Регистрация пользователя
export const registerUserApi = async (
  data: TRegisterData
): Promise<TServerResponse<{ user: TUser }>> => {
  const res = await fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });
  const result = await checkResponse<TAuthResponse>(res);
  if (!result.success) {
    return Promise.reject(result);
  }
  saveTokens(result.accessToken, result.refreshToken);
  return result;
};

// 9) Логин пользователя
export type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const loginUserApi = async (
  data: TLoginData
): Promise<TAuthResponse> => {
  const res = await fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });
  const result = await checkResponse<TAuthResponse>(res);
  if (!result.success) {
    return Promise.reject(result);
  }
  saveTokens(result.accessToken, result.refreshToken);
  return result;
};

// 10) Восстановление пароля (запрос кода)
export const forgotPasswordApi = async (data: {
  email: string;
}): Promise<TServerResponse<{}>> => {
  const res = await fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });
  const result = await checkResponse<TServerResponse<{}>>(res);
  if (!result.success) {
    return Promise.reject(result);
  }
  return result;
};

// 11) Сброс пароля по коду
export const resetPasswordApi = async (data: {
  password: string;
  token: string;
}): Promise<TServerResponse<{}>> => {
  const res = await fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });
  const result = await checkResponse<TServerResponse<{}>>(res);
  if (!result.success) {
    return Promise.reject(result);
  }
  return result;
};

// 12) Получить данные текущего пользователя
export const getUserApi = async (): Promise<
  TServerResponse<{ user: TUser }>
> => {
  const data = await fetchWithRefresh<TServerResponse<{ user: TUser }>>(
    `${URL}/auth/user`,
    {
      headers: {
        authorization: getCookie('accessToken') || ''
      }
    }
  );
  if (!data.success) {
    return Promise.reject(data);
  }
  return data;
};

// 13) Обновить профиль пользователя
export const updateUserApi = async (
  user: Partial<TRegisterData>
): Promise<TServerResponse<{ user: TUser }>> => {
  const data = await fetchWithRefresh<TServerResponse<{ user: TUser }>>(
    `${URL}/auth/user`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: getCookie('accessToken') || ''
      },
      body: JSON.stringify(user)
    }
  );
  if (!data.success) {
    return Promise.reject(data);
  }
  return data;
};

// 14) Логаут пользователя
export const logoutApi = async (): Promise<TServerResponse<{}>> => {
  const refreshToken = localStorage.getItem('refreshToken');
  const res = await fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ token: refreshToken })
  });
  const data = await checkResponse<TServerResponse<{}>>(res);
  if (!data.success) {
    return Promise.reject(data);
  }
  // Очищаем токены
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return data;
};
