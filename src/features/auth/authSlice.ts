import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/auth";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: User | null;
  token: string | null;
}

const STORAGE_KEY = "foody_auth";

function loadInitialState(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw) as AuthState;
    return parsed;
  } catch {
    return { user: null, token: null };
  }
}

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user: state.user, token: state.token })
        );
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
