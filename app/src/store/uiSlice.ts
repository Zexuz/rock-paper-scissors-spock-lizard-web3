import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  successSnackbar: string | null;
  errorSnackbar: string | null;
}

const initialState: UiState = {
  successSnackbar: null,
  errorSnackbar: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSuccessSnackbar: (state, action: PayloadAction<string>) => {
      state.successSnackbar = action.payload;
    },
    clearSuccessSnackbar: (state) => {
      state.successSnackbar = null;
    },
    setErrorSnackbar: (state, action: PayloadAction<string>) => {
      state.errorSnackbar = action.payload;
    },
    clearErrorSnackbar: (state) => {
      state.errorSnackbar = null;
    },
  },
});

export const {
  setSuccessSnackbar,
  clearSuccessSnackbar,
  setErrorSnackbar,
  clearErrorSnackbar
} = uiSlice.actions;

export default uiSlice.reducer;
