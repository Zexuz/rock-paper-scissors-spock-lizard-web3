import {createSlice} from '@reduxjs/toolkit';

export interface Web3State {
  readOnlyMode: boolean;
  hasSigner: boolean;
  hasTriedToGetSigner: boolean;
}

const initialState: Web3State = {
  readOnlyMode: true,
  hasSigner: false,
  hasTriedToGetSigner: false,
};

export const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    setReadOnlyMode: (state, action) => {
      state.readOnlyMode = action.payload;
    },
    setHasSigner: (state, action) => {
      state.hasSigner = action.payload;
    },
    setHasTriedToGetSigner: (state, action) => {
      state.hasTriedToGetSigner = action.payload;
    }
  }
});

export default web3Slice.reducer;
