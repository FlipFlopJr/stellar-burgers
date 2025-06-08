import { combineReducers, configureStore } from '@reduxjs/toolkit';
import burgerSlice from './slices/burgerSlice/burgerSlice';
import liveOrdersSlice from './slices/liveOrdersSlice/liveOrdersSlice';
import accountSlice from './slices/accountSlice/accountSlice';
import inventorySlice from './slices/inventSlice/inventSlice';
import orderLookupSlice from './slices/lookupOrderSlice/lookupOrderSlice';

export const rootReducer = combineReducers({
  liveOrders: liveOrdersSlice,
  burgerBuilder: burgerSlice,
  account: accountSlice,
  inventory: inventorySlice,
  orderLookup: orderLookupSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
