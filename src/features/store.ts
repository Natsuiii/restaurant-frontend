import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import cartReducer from "./cart/cartSlice";
import restoFiltersReducer from "./filters/restoFiltersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    restoFilters: restoFiltersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
