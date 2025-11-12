import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserType = "maria" | "leo" | null;

interface AuthState {
  currentUser: UserType;
}

// Load initial state from localStorage
const loadInitialState = (): AuthState => {
  const savedUser = localStorage.getItem("currentUser") as UserType;
  return {
    currentUser: savedUser || null,
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserType>) => {
      state.currentUser = action.payload;
      // Persist to localStorage
      if (action.payload) {
        localStorage.setItem("currentUser", action.payload);
      } else {
        localStorage.removeItem("currentUser");
      }
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { setCurrentUser, logout } = authSlice.actions;
export default authSlice.reducer;
