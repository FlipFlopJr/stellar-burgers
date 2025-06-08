import { ApiOrderBurger } from '../../../utils/burger-api';

import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export type TStateBurger = {
  isLoading: boolean;
  builderData: {
    selectedBun: TConstructorIngredient | null;
    filling: TConstructorIngredient[];
  };
  isOrdering: boolean;
  orderDetails: TOrder | null;
  fetchError: string | null;
};

export const initialState: TStateBurger = {
  isLoading: false,
  builderData: {
    selectedBun: null,
    filling: []
  },
  isOrdering: false,
  orderDetails: null,
  fetchError: null
};

export const orderBurgerSubmit = createAsyncThunk(
  'burger/submitOrder',
  async (ingredientIds: string[]) => ApiOrderBurger(ingredientIds)
);

export const burgerSlice = createSlice({
  name: 'burgerBuilder',
  initialState,
  selectors: {
    selectBurgerBuilder: (state) => state
  },
  reducers: {
    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.builderData.selectedBun = action.payload;
        } else {
          state.builderData.filling.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const uniqueId = nanoid();
        return { payload: { ...ingredient, id: uniqueId } };
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.builderData.filling = state.builderData.filling.filter(
        (item) => item.id !== action.payload
      );
    },
    moveItemUp: (state, action: PayloadAction<number>) => {
      state.builderData.filling.splice(
        action.payload,
        0,
        state.builderData.filling.splice(action.payload - 1, 1)[0]
      );
    },
    moveItemDown: (state, action: PayloadAction<number>) => {
      state.builderData.filling.splice(
        action.payload,
        0,
        state.builderData.filling.splice(action.payload + 1, 1)[0]
      );
    },
    toggleOrderRequest: (state, action) => {
      state.isOrdering = action.payload;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerSubmit.pending, (state) => {
        state.isLoading = true;
        state.isOrdering = true;
        state.fetchError = null;
      })
      .addCase(orderBurgerSubmit.rejected, (state, action) => {
        state.isLoading = false;
        state.isOrdering = false;
        state.fetchError = action.error.message as string;
      })
      .addCase(orderBurgerSubmit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isOrdering = false;
        state.fetchError = null;
        state.orderDetails = action.payload.order;
        state.builderData = {
          selectedBun: null,
          filling: []
        };
        console.log(action.payload);
      });
  }
});

export const {
  toggleOrderRequest,
  addItem,
  removeItem,
  clearOrderDetails,
  moveItemUp,
  moveItemDown
} = burgerSlice.actions;

export const { selectBurgerBuilder } = burgerSlice.selectors;
export default burgerSlice.reducer;
