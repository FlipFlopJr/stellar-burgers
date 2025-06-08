import { combineReducers, configureStore } from '@reduxjs/toolkit';

import burgerSlice from './slices/burgerSlice/burgerSlice';

import liveOrdersSlice from './slices/liveOrdersSlice/liveOrdersSlice';
import accountSlice from './slices/accountSlice/accountSlice';
import inventSlice from './slices/inventSlice/inventSlice';
import orderLookupSlice from './slices/lookupOrderSlice/lookupOrderSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  inventory: inventSlice,
  orderLookup: orderLookupSlice,
  burgerBuilder: burgerSlice,
  liveOrders: liveOrdersSlice,
  account: accountSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
