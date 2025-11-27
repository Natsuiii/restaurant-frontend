// src/features/filters/restoFiltersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type DistanceOption = "nearby" | "1" | "3" | "5" | null;

export interface RestoFilterState {
  distance: DistanceOption;
  priceMin: number | null;
  priceMax: number | null;
  rating: number | null;
}

const initialState: RestoFilterState = {
  distance: null,
  priceMin: null,
  priceMax: null,
  rating: null,
};

const restoFiltersSlice = createSlice({
  name: "restoFilters",
  initialState,
  reducers: {
    setDistance(state, action: PayloadAction<DistanceOption>) {
      state.distance = action.payload;
    },
    setPriceMin(state, action: PayloadAction<number | null>) {
      state.priceMin = action.payload;
    },
    setPriceMax(state, action: PayloadAction<number | null>) {
      state.priceMax = action.payload;
    },
    setRating(state, action: PayloadAction<number | null>) {
      state.rating = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setDistance,
  setPriceMin,
  setPriceMax,
  setRating,
  resetFilters,
} = restoFiltersSlice.actions;

export default restoFiltersSlice.reducer;
