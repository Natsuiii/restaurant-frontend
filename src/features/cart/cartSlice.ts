import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  restaurantId: number;
  restaurantName: string;
  menuId: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
    },
    updateQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const it = state.items.find((i) => i.id === action.payload.id);
      if (!it) return;
      if (action.payload.qty <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      } else {
        it.qty = action.payload.qty;
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, updateQty, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
