// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer, {AuthState} from './authSlice';
import {loadState,saveState} from '../utils/locakStorage';
import jobReducer,{JobState} from './jobSlice';
interface RootStates {
  auth: AuthState; // State shape includes the AuthState under the auth key
  jobs: JobState; // Add JobState to the RootState interface
}
const preloadedState: RootStates | undefined = loadState();
export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
