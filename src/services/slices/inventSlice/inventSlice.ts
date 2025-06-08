import { ApiGetIngredients } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TStateInventory = {
  fetchError: string | null;
  isLoading: boolean;
  inventoryItems: TIngredient[];
};

export const initialState: TStateInventory = {
  fetchError: null,
  isLoading: false,
  inventoryItems: []
};

export const inventoryFetch = createAsyncThunk(
  'inventory/fetchAll',
  ApiGetIngredients
);

export const inventSlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  selectors: {
    selectInventoryState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(inventoryFetch.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchError = action.error.message as string;
      })
      .addCase(inventoryFetch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fetchError = null;
        state.inventoryItems = action.payload;
      })
      .addCase(inventoryFetch.pending, (state) => {
        state.isLoading = true;
        state.fetchError = null;
      });
  }
});

export const { selectInventoryState } = inventSlice.selectors;
export default inventSlice.reducer;
