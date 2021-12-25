import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
  },
});

export const selectAuthState = (state) => state.auth;
