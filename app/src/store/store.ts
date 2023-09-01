import {configureStore} from '@reduxjs/toolkit';
import web3Reducer from './web3Slice';
import uiReducer from './uiSlice';
import rpsContractReducer from "./RpsContractSlice.ts";
import {useSelector} from "react-redux";

export const store = configureStore({
  reducer: {
    web3: web3Reducer,
    ui: uiReducer,
    rpsContract: rpsContractReducer,
  },
});


export const useAppSelector = (selector: (state: RootState) => any) => useSelector(selector);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
