import {createSlice} from '@reduxjs/toolkit';
import {fetchLogin, fetchLogout} from './userSlice';
import {User} from './userTypes';

interface UserState {
  user: User | null;
  refreshToken: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

const initialState: UserState = {
  user: null,
  refreshToken: '',
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
};

const UserReducer = createSlice({
  name: 'auth',
  initialState,
  //nội bộ
  reducers: {
    resetStatus: state => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.errorMessage = '';
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  //ngoài app
  extraReducers: builder => {
    builder
      .addCase(fetchLogin.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.user.refreshToken = action.payload.refreshToken;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || 'Login failed';
        state.user = null;
      });
      builder
      .addCase(fetchLogout.pending, state => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(fetchLogout.fulfilled, state => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || 'Logout failed!!!';
      })
  },
});

export const {resetStatus} = UserReducer.actions;
export default UserReducer.reducer;
