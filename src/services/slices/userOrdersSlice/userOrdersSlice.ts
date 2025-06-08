import { ApiGetFeeds } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TStateOrdersUsers = {
  completedToday: number;
  totalCompleted: number;
  fetchError: string | null;
  isLoading: boolean;
  liveOrders: TOrder[];
};

export const initialState: TStateOrdersUsers = {
  fetchError: null,
  isLoading: false,
  completedToday: 0,
  totalCompleted: 0,
  liveOrders: []
};

export const liveOrdersFetch = createAsyncThunk(
  'liveOrders/fetchAll',
  ApiGetFeeds
);

export const liveOrdersSlice = createSlice({
  name: 'liveOrders',
  initialState,
  reducers: {},
  selectors: {
    selectLiveOrdersState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(liveOrdersFetch.pending, (state) => {
        state.isLoading = true;
        state.fetchError = null;
      })
      .addCase(liveOrdersFetch.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchError = action.error.message as string;
      })
      .addCase(liveOrdersFetch.fulfilled, (state, action) => {
        state.completedToday = action.payload.totalToday;
        state.liveOrders = action.payload.orders;
        state.totalCompleted = action.payload.total;
        state.isLoading = false;
        state.fetchError = null;
      });
  }
});

export const { selectLiveOrdersState } = liveOrdersSlice.selectors;
export default liveOrdersSlice.reducer;
