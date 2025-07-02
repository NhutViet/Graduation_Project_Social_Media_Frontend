import {createSlice} from '@reduxjs/toolkit';
import {
  fetchLogin,
  fetchLogout,
  fetchRegister,
  getPublicProfile,
  fetchEditUser,
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
        state.isSuccess = true;
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
        if (state.user) {
          state.user = {...state.user, ...action.payload};
        } else {
          state.user = action.payload;
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
      });
  },
});

export const {
  resetStatus,
  setUser,
  resetUser,
  resetPublicProfileStatus,
  clearPublicProfile,
} = UserReducer.actions;
export default UserReducer.reducer;
