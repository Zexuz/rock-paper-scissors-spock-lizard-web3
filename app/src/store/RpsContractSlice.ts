import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GameInfo } from "../types/gameInfo.ts";
import { RpsFactory } from "../lib/rps.ts";

export const fetchGameInfo = createAsyncThunk(
  'rpsContract/fetchGameInfo',
  async (address: string) => {
    const contract = await RpsFactory.getReadWriteContract(address);
    const gameInfo: GameInfo = await contract.GetGameInfo();
    return { address, gameInfo };
  }
);

export interface RpsContractState {
  loading: boolean;
  address: string;
  GameInfo: GameInfo;
}

const initialState: RpsContractState = {
  loading: false,
  address: '',
  GameInfo: {
    player1: '',
    player2: '',
    c1Hash: '',
    c2Move: 0,
    stake: '',
    timeout: 0,
    lastAction: 0,
  }
};

export const rpsContractSlice = createSlice({
  name: 'rpsContract',
  initialState,
  reducers: {
    setContractAddress: (state, action) => {
      state.address = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGameInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload.address;
        state.GameInfo = action.payload.gameInfo;
      })
      .addCase(fetchGameInfo.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setContractAddress } = rpsContractSlice.actions;
export default rpsContractSlice.reducer;
