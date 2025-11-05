import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LettersState {
  visitedLetterIds: number[];
}

const initialState: LettersState = {
  visitedLetterIds: [],
};

const lettersSlice = createSlice({
  name: "letters",
  initialState,
  reducers: {
    markLetterAsVisited: (state, action: PayloadAction<number>) => {
      if (!state.visitedLetterIds.includes(action.payload)) {
        state.visitedLetterIds.push(action.payload);
      }
    },
    clearVisitedLetters: (state) => {
      state.visitedLetterIds = [];
    },
  },
});

export const { markLetterAsVisited, clearVisitedLetters } =
  lettersSlice.actions;
export default lettersSlice.reducer;
