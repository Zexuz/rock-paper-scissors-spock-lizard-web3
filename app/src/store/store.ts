import {configureStore} from '@reduxjs/toolkit';
import web3Reducer from './web3Slice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    web3: web3Reducer,
    ui: uiReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
