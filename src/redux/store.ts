import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import lettersReducer from "./lettersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    letters: lettersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
