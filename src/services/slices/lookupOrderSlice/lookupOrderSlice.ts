import { ApiGetOrderByNumber } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';

type TStateOrderLookup = {
  rawResponse: null;
  fetchError: string | null;
  isFetching: boolean;
  orderDetails: TOrder | null;
  allOrders: TOrder[];
};

export const initialState: TStateOrderLookup = {
  fetchError: null,
  rawResponse: null,
  orderDetails: null,
  isFetching: false,
  allOrders: []
};

export const fetchOrderDetails = createAsyncThunk(
  'order/fetchByNumber',
  async (orderNumber: number) => ApiGetOrderByNumber(orderNumber)
);

export const orderLookupSlice = createSlice({
  name: 'orderLookup',
  initialState,
  reducers: {},
  selectors: {
    selectOrderLookupState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.fetchError = null;
        state.isFetching = true;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.fetchError = action.error.message as string;
        state.isFetching = false;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.fetchError = null;
        state.isFetching = false;
        state.orderDetails = action.payload.orders[0];
      });
  }
});

export const { selectOrderLookupState } = orderLookupSlice.selectors;
export default orderLookupSlice.reducer;
