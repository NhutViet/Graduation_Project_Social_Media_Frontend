import {createSlice} from '@reduxjs/toolkit';
import {
  fetchLogin,
  fetchLogout,
  fetchRegister,
  getPublicProfile,
  fetchEditUser,
  fetchCheckEmailForgotPassword,
  fetchSendCodeForgotPassword,
  fetchVerifyCodeForgotPassword,
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
  
  isLoadingCheckEmail: boolean;
  isSuccessCheckEmail: boolean;
  isErrorCheckEmail: boolean;
  checkEmailMessage: string;
  hasPhoneNumber: boolean;
  
  isLoadingSendCode: boolean;
  isSuccessSendCode: boolean;
  isErrorSendCode: boolean;
  sendCodeMessage: string;
  forgotPasswordToken: string;
  
  isLoadingVerifyCode: boolean;
  isSuccessVerifyCode: boolean;
  isErrorVerifyCode: boolean;
  verifyCodeMessage: string;
  verifyRefreshToken: string;
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
  
  isLoadingCheckEmail: false,
  isSuccessCheckEmail: false,
  isErrorCheckEmail: false,
  checkEmailMessage: '',
  hasPhoneNumber: false,
  
  isLoadingSendCode: false,
  isSuccessSendCode: false,
  isErrorSendCode: false,
  sendCodeMessage: '',
  forgotPasswordToken: '',
  
  isLoadingVerifyCode: false,
  isSuccessVerifyCode: false,
  isErrorVerifyCode: false,
  verifyCodeMessage: '',
  verifyRefreshToken: '',
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
    resetCheckEmailStatus: state => {
      state.isLoadingCheckEmail = state.isSuccessCheckEmail = state.isErrorCheckEmail = false;
      state.checkEmailMessage = '';
      state.hasPhoneNumber = false;
    },
    resetSendCodeStatus: state => {
      state.isLoadingSendCode = state.isSuccessSendCode = state.isErrorSendCode = false;
      state.sendCodeMessage = '';
      state.forgotPasswordToken = '';
    },
    resetVerifyCodeStatus: state => {
      state.isLoadingVerifyCode = state.isSuccessVerifyCode = state.isErrorVerifyCode = false;
      state.verifyCodeMessage = '';
      state.verifyRefreshToken = '';
    },
    resetAllForgotPasswordStatus: state => {      
      state.isLoadingCheckEmail = state.isSuccessCheckEmail = state.isErrorCheckEmail = false;
      state.checkEmailMessage = '';
      state.hasPhoneNumber = false;
      state.isLoadingSendCode = state.isSuccessSendCode = state.isErrorSendCode = false;
      state.sendCodeMessage = '';
      state.forgotPasswordToken = '';
      state.isLoadingVerifyCode = state.isSuccessVerifyCode = state.isErrorVerifyCode = false;
      state.verifyCodeMessage = '';
      state.verifyRefreshToken = '';
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

      // check email
      .addCase(fetchCheckEmailForgotPassword.pending, state => {
        state.isLoadingCheckEmail = true;
        state.isErrorCheckEmail = state.isSuccessCheckEmail = false;
        state.checkEmailMessage = '';
        state.hasPhoneNumber = false;
      })
      .addCase(fetchCheckEmailForgotPassword.fulfilled, (state, action) => {
        state.isLoadingCheckEmail = false;
        state.isSuccessCheckEmail = true;
        state.checkEmailMessage = action.payload.message;
        state.hasPhoneNumber = action.payload.hasPhoneNumber;
      })
      .addCase(fetchCheckEmailForgotPassword.rejected, (state, action) => {
        state.isLoadingCheckEmail = false;
        state.isErrorCheckEmail = true;
        state.checkEmailMessage = action.payload?.message || 'Kiểm tra email không thành công';
        state.hasPhoneNumber = false;
      })
      
      // send code
      .addCase(fetchSendCodeForgotPassword.pending, state => {
        state.isLoadingSendCode = true;
        state.isErrorSendCode = state.isSuccessSendCode = false;
        state.sendCodeMessage = '';
        state.forgotPasswordToken = '';
      })
      .addCase(fetchSendCodeForgotPassword.fulfilled, (state, action) => {
        state.isLoadingSendCode = false;
        state.isSuccessSendCode = true;
        state.sendCodeMessage = action.payload.message;
        state.forgotPasswordToken = action.payload.token;
      })
      .addCase(fetchSendCodeForgotPassword.rejected, (state, action) => {
        state.isLoadingSendCode = false;
        state.isErrorSendCode = true;
        state.sendCodeMessage = action.payload?.message || 'Gửi mã xác nhận không thành công';
        state.forgotPasswordToken = '';
      })
      
      // verify code
      .addCase(fetchVerifyCodeForgotPassword.pending, state => {
        state.isLoadingVerifyCode = true;
        state.isErrorVerifyCode = state.isSuccessVerifyCode = false;
        state.verifyCodeMessage = '';
        state.verifyRefreshToken = '';
      })
      .addCase(fetchVerifyCodeForgotPassword.fulfilled, (state, action) => {
        state.isLoadingVerifyCode = false;
        state.isSuccessVerifyCode = true;
        state.verifyCodeMessage = action.payload.message;
        state.verifyRefreshToken = action.payload.refreshToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(fetchVerifyCodeForgotPassword.rejected, (state, action) => {
        state.isLoadingVerifyCode = false;
        state.isErrorVerifyCode = true;
        state.verifyCodeMessage = action.payload?.message || 'Xác nhận mã không thành công';
        state.verifyRefreshToken = '';
      });
  },
});

export const {
  resetStatus,
  setUser,
  resetUser,
  resetPublicProfileStatus,
  clearPublicProfile,
  removeLoggedInUser,
  resetCheckEmailStatus,
  resetSendCodeStatus,
  resetVerifyCodeStatus,
  resetAllForgotPasswordStatus,
} = UserReducer.actions;
export default UserReducer.reducer;
