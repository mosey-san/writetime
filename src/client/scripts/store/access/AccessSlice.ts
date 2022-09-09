import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

interface IUserInfo {
  id: string;
  login: string;
  client_id: string;
  display_name: string;
  real_name: string;
  first_name: string;
  last_name: string;
  sex: string;
  default_avatar_id: string;
  is_avatar_empty: boolean;
  psuid: string;
}

export interface AccessState {
  userInfo: IUserInfo | null;
}

const initialState: AccessState = {
  userInfo: null,
};

export const AccessSlice = createSlice({
  name: 'access',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<IUserInfo>) => {
      state.userInfo = action.payload;
    },
  },
});

export const selectAccess = (state: RootState) => state.access;

export const AccessActionCreators = AccessSlice.actions;
export const AccessReducer = AccessSlice.reducer;
