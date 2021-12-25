import { createSlice } from '@reduxjs/toolkit';
import { getAuthToken, authTokenToUserInfo } from '../context/session.js';

function getCachedUserInfo() {
  const token = getAuthToken();
  return token ? authTokenToUserInfo(token) : null;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: getCachedUserInfo(),
  },
  reducers: {
    login: (state, { payload }) => {
      state.userInfo = payload;
    },
    logout: state => {
      state.userInfo = null;
    },
  }
})

export const selectUserInfo = (state) => state.userInfo;
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
