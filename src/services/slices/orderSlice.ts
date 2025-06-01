import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface OrderState {
  orderRequest: boolean;
  orderFailed: boolean;
  orderData: TOrder | null;
  error?: string;
}

const initialState: OrderState = {
  orderRequest: false,
  orderFailed: false,
  orderData: null,
  error: undefined
};

export const placeOrder = createAsyncThunk<TOrder, string[]>(
  'order/placeOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      // orderBurgerApi возвращает { order: TOrder; name: string }
      return response.order;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Unknown error');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const { orders } = await getOrderByNumberApi(orderNumber);
      return orders[0];
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Unknown error');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.orderData = null;
      state.orderFailed = false;
      state.orderRequest = false;
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder.pending, (state) => {
      state.orderRequest = true;
      state.orderFailed = false;
      state.error = undefined;
    });
    builder.addCase(
      placeOrder.fulfilled,
      (state, action: PayloadAction<TOrder>) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      }
    );
    builder.addCase(placeOrder.rejected, (state, action) => {
      state.orderRequest = false;
      state.orderFailed = true;
      state.error = action.payload as string;
    });
    builder.addCase(fetchOrderByNumber.pending, (state) => {
      state.orderRequest = true;
      state.orderFailed = false;
      state.error = undefined;
    });
    builder.addCase(
      fetchOrderByNumber.fulfilled,
      (state, action: PayloadAction<TOrder>) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      }
    );
    builder.addCase(fetchOrderByNumber.rejected, (state, action) => {
      state.orderRequest = false;
      state.orderFailed = true;
      state.error = action.payload as string;
    });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
