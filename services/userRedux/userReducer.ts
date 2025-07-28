import {createSlice} from '@reduxjs/toolkit';
import {
  fetchLogin,
  fetchLogout,
  fetchRegister,
  getPublicProfile,
  fetchEditUser,
  fetchInitForgotPassword,
  fetchConfirmForgotPassword,
} from './userSlice';
import {User, PublicUserRes} from './userTypes';

interface UserState {
  user: User | null;
  publicProfile: PublicUserRes | null;
  refreshToken: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
  isLoadingPublicProfile: boolean;
  isSuccessPublicProfile: boolean;
  isErrorPublicProfile: boolean;
  errorMessagePublicProfile: string;
  loggedInUsers: User[];
  isLoadingForgot: boolean;
  isSuccessForgot: boolean;
  isErrorForgot: boolean;
  forgotMessage: string;
  forgotRefreshToken: string;
  isLoadingConfirm: boolean;
  isSuccessConfirm: boolean;
  isErrorConfirm: boolean;
  confirmMessage: string;
}

const initialState: UserState = {
  user: null,
  publicProfile: null,
  refreshToken: '',
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
  isLoadingPublicProfile: false,
  isSuccessPublicProfile: false,
  isErrorPublicProfile: false,
  errorMessagePublicProfile: '',
  loggedInUsers: [],
  isLoadingForgot: false,
  isSuccessForgot: false,
  isErrorForgot: false,
  forgotMessage: '',
  forgotRefreshToken: '',
  isLoadingConfirm: false,
  isSuccessConfirm: false,
  isErrorConfirm: false,
  confirmMessage: '',
};

const UserReducer = createSlice({
  name: 'auth',
  initialState,
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
    resetUser: state => {
      state.user = null;
      state.refreshToken = '';
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
    },
    resetPublicProfileStatus: state => {
      state.isLoadingPublicProfile = false;
      state.isErrorPublicProfile = false;
      state.isSuccessPublicProfile = false;
      state.errorMessagePublicProfile = '';
    },
    clearPublicProfile: state => {
      state.publicProfile = null;
      state.isLoadingPublicProfile = false;
      state.isSuccessPublicProfile = false;
      state.isErrorPublicProfile = false;
      state.errorMessagePublicProfile = '';
    },
    removeLoggedInUser: (state, action) => {
      state.loggedInUsers = state.loggedInUsers.filter(
        user => user._id !== action.payload,
      );
    },
    resetForgotStatus: state => {
      state.isLoadingForgot =
        state.isSuccessForgot =
        state.isErrorForgot =
          false;
      state.forgotMessage = '';
    },
    resetConfirmStatus: state => {
      state.isLoadingConfirm =
        state.isSuccessConfirm =
        state.isErrorConfirm =
          false;
      state.confirmMessage = '';
    },
  },
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
        state.user = action.payload.user;
        state.refreshToken = action.payload.refreshToken;

        const userId = action.payload.user._id;
        const alreadyLoggedIn = state.loggedInUsers.some(u => u._id === userId);
        if (!alreadyLoggedIn) {
          state.loggedInUsers.push(action.payload.user);
        }
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = 'Login failed';
        state.user = null;
        state.refreshToken = '';

        if (action.payload?.message === 'Invalid credentials') {
          state.errorMessage = 'Sai tài khoản hoặc mật khẩu.';
        }
      })

      .addCase(fetchLogout.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.user = null;
        state.refreshToken = '';
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || 'Logout failed';
      })

      .addCase(fetchRegister.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.errorMessage = '';
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || 'Registration failed';
      })

      .addCase(fetchEditUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchEditUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.errorMessage = '';

        if (state.user) {
          state.user = {
            ...state.user,
            ...action.payload,
          };
        } else {
          state.user = action.payload;
        }

        const index = state.loggedInUsers.findIndex(
          u => u._id === state.user?._id,
        );
        if (index !== -1) {
          state.loggedInUsers[index] = {
            ...state.loggedInUsers[index],
            ...action.payload,
          };
        }
      })
      .addCase(fetchEditUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || 'Update failed';
      })

      /// public profile cases
      .addCase(getPublicProfile.pending, state => {
        state.isLoadingPublicProfile = true;
        state.isErrorPublicProfile = false;
        state.isSuccessPublicProfile = false;
        state.errorMessagePublicProfile = '';
      })
      .addCase(getPublicProfile.fulfilled, (state, action) => {
        state.isLoadingPublicProfile = false;
        state.isSuccessPublicProfile = true;
        state.publicProfile = action.payload;
      })
      .addCase(getPublicProfile.rejected, (state, action) => {
        state.isLoadingPublicProfile = false;
        state.isErrorPublicProfile = true;
        state.errorMessagePublicProfile =
          action.payload?.message || 'Failed to get public profile';
        state.publicProfile = null;
      })

      // INIT FORGOT PASSWORD
      .addCase(fetchInitForgotPassword.pending, state => {
        state.isLoadingForgot = true;
        state.isErrorForgot = state.isSuccessForgot = false;
        state.forgotMessage = '';
      })
      .addCase(fetchInitForgotPassword.fulfilled, (state, action) => {
        state.isLoadingForgot = false;
        state.isSuccessForgot = true;
        state.forgotMessage = action.payload.token;
      })
      .addCase(fetchInitForgotPassword.rejected, (state, action) => {
        state.isLoadingForgot = false;
        state.isErrorForgot = true;
        state.forgotMessage =
          action.payload?.message || 'Init forgot password failed';
      })

      // CONFIRM FORGOT PASSWORD
      .addCase(fetchConfirmForgotPassword.pending, state => {
        state.isLoadingConfirm = true;
        state.isErrorConfirm = state.isSuccessConfirm = false;
        state.confirmMessage = '';
        state.forgotRefreshToken = '';
      })
      .addCase(fetchConfirmForgotPassword.fulfilled, (state, action) => {
        state.isLoadingConfirm = false;
        state.isSuccessConfirm = true;
        state.confirmMessage = action.payload.message;
        state.forgotRefreshToken = action.payload.refreshToken;
        state.refreshToken       = action.payload.refreshToken;
      })
      .addCase(fetchConfirmForgotPassword.rejected, (state, action) => {
        state.isLoadingConfirm = false;
        state.isErrorConfirm = true;
        state.confirmMessage =
          action.payload?.message || 'Confirm forgot password failed';
      })
  },
});

export const {
  resetStatus,
  setUser,
  resetUser,
  resetPublicProfileStatus,
  clearPublicProfile,
  removeLoggedInUser,
  resetForgotStatus,
  resetConfirmStatus,
} = UserReducer.actions;
export default UserReducer.reducer;
