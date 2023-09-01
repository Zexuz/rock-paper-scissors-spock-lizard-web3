import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {ethers} from "ethers";

export interface Web3State {
  currentUser?: string;
  loading: boolean;
  readOnlyMode: boolean;
}

const initialState: Web3State = {
  loading: false,
  currentUser: undefined,
  readOnlyMode: true,
};

export const getCurrentUser = createAsyncThunk(
  'web3/getCurrentUser',
  async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return signer.getAddress();
  });

export const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.readOnlyMode = action.payload === undefined;
        state.loading = false;
      })
      .addCase(getCurrentUser.rejected, (state, _action) => {
        state.currentUser = undefined;
        state.readOnlyMode = true;
        state.loading = false;
      })
      .addCase(getCurrentUser.pending, (state, _action) => {
        state.loading = true;
      });
  }
});
export default web3Slice.reducer;
