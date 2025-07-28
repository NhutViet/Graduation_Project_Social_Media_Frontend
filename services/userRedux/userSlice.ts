import {createAsyncThunk} from '@reduxjs/toolkit';
import {UserRes, PublicUserRes, EditUserDto} from './userTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';
import {resetUser} from './userReducer';
import { RootState } from '@services/store';

export const fetchLogin = createAsyncThunk<
  {user: UserRes['user']; refreshToken: string},
  {email: string; password: string; fcmToken?: string},
  {rejectValue: {message: string}}
>('auth/login', async ({email, password, fcmToken}, {rejectWithValue}) => {
  try {
    const loginRes = await axiosInstance.post(API.GET_lOGIN_POST, {
      email,
      password,
      fcmToken,
    });

    const refreshToken = loginRes.data.refreshToken;
    const accessToken = loginRes.data.accessToken;

    const userRes = await axiosInstance.get<UserRes['user']>(API.GET_ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      user: userRes.data,
      refreshToken,
    };
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Đăng nhập thất bại',
    });
  }
});

export const fetchCheckRefreshToken = createAsyncThunk<
  {valid: boolean; message: string},
  void,
  {rejectValue: {message: string}}
>('auth/checkRefreshToken', async (_, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.post(
      API.CHECK_REFRESH_TOKEN,
      {},
      {
        headers: {
          token: 'refresh',
        },
      },
    );

    return res.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Kiểm tra token thất bại',
    });
  }
});

export const fetchLogout = createAsyncThunk<
  void,
  void,
  {rejectValue: {message: string}}
>('auth/logout', async (_, {dispatch, rejectWithValue}) => {
  try {
    await axiosInstance.post(
      API.POST_LOGOUT,
      {},
      {
        headers: {
          token: 'refresh',
        },
      },
    );

    dispatch(resetUser());

    return;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Đang xuất thất bại';
    return rejectWithValue({message});
  }
});

export const fetchRegister = createAsyncThunk<
  {message: string},
  {email: string; password: string; profilePic?: string},
  {rejectValue: {message: string}}
>('auth/register', async ({email, password, profilePic}, {rejectWithValue}) => {
  try {
    const payload: {
      email: string;
      password: string;
      profilePic?: string;
    } = {
      email,
      password,
    };

    if (profilePic) {
      payload.profilePic = profilePic;
    }

    const registerRes = await axiosInstance.post(API.REGISTER, payload);

    return {
      message: registerRes.data.message,
    };
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Đăng ký thất bại',
    });
  }
});

export const fetchCheckEmail = createAsyncThunk<
  {exists: boolean; message?: string},
  {email: string},
  {rejectValue: {message: string}}
>('auth/checkEmail', async ({email}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.post(API.CHECK_EMAIL, {email});

    return res.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Kiểm tra email thất bại',
    });
  }
});

export const getAccessTokenFromRefresh = async (): Promise<string | null> => {
  try {
    const response = await axiosInstance.post(
      API.GET_ACCESS_TOKEN,
      {},
      {
        headers: {
          token: 'refresh',
        },
      },
    );

    const {accessToken} = response.data;

    return accessToken;
  } catch (error) {
    console.error('Thất bại khi lấy token', error);
    return null;
  }
};

export const fetchEditUser = createAsyncThunk<
  any,
  EditUserDto,
  { rejectValue: string; state: RootState }
>(
  'user/fetchEdituser',
  async (formData, { rejectWithValue, getState }) => {
    try {
      // 1) Grab the token
      const { refreshToken } = getState().user;
      console.log('[fetchEditUser] using refreshToken:', refreshToken);

      // 2) Build the header
      const headers = { Authorization: `Bearer ${refreshToken}` };
      console.log('[fetchEditUser] headers:', headers);

      // 3) Fire the request
      const response = await axiosInstance.patch(
        API.EDIT_USER,
        formData,
        { headers }
      );

      console.log('[fetchEditUser] response status:', response.status);
      console.log('[fetchEditUser] response data:', response.data);

      return response.data.user;
    } catch (error: any) {
      // 4) Log the full error
      console.error('[fetchEditUser] caught error:', error);
      console.error(
        '[fetchEditUser] error response data:',
        error.response?.data
      );
      return rejectWithValue('Could not update user');
    }
  }
);


export const getPublicProfile = createAsyncThunk<
  PublicUserRes,
  {userId: string},
  {rejectValue: {message: string}}
>('users/public', async ({userId}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.get(`${API.GET_PUBLIC_PROFILE}/${userId}`, {
      headers: {
        token: 'refresh',
      },
    });

    return res.data;
  } catch (error: any) {
    return rejectWithValue({
      message:
        error.response?.data?.message || 'Lấy thông tin người dùng thất bại',
    });
  }
});

export const fetchUserIdByHandleName = createAsyncThunk<
  {userId: string},
  {handleName: string},
  {rejectValue: {message: string}}
>('users/fetchUserIdByHandleName', async ({handleName}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.get(
      `${API.GET_USER_ID_BY_HANDLE}/${handleName}`,
      {
        headers: {
          token: 'refresh',
        },
      },
    );

    return {userId: res.data.userId};
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Lấy ID người dùng thất bại',
    });
  }
});

type InitForgotPasswordArgs =
  | { email: string; phone?: never }
  | { phone: string; email?: never }

export const fetchInitForgotPassword = createAsyncThunk<
  { token: string },
  InitForgotPasswordArgs,
  { rejectValue: { message: string } }
>(
  'auth/initForgotPassword',
  async ({ email, phone }, { rejectWithValue }) => {
    // ensure exactly one of email/phone is provided
    if ((!email && !phone) || (email && phone)) {
      return rejectWithValue({
        message: 'Vui lòng cung cấp email hoặc số điện thoại, không được cả hai.'
      })
    }

    try {
      // build payload with the correct field
      const payload: Record<string, string> = {}
      if (email) payload.email = email
      else payload.phone = phone!

      const res = await axiosInstance.post<{ token: string }>(
        API.INIT_FORGOT_PASSWORD,
        payload
      )
      return { token: res.data.token }
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          'Gửi mã xác nhận không thành công.'
      })
    }
  }
)

export const fetchConfirmForgotPassword = createAsyncThunk<
  { message: string; refreshToken: string },
  { token: string; code: string },
  { rejectValue: { message: string } }
>('auth/confirmForgotPassword', async ({ token, code }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post<{ message: string; refreshToken: string }>(
      API.CONFIRM_NEW_PASSWORD,
      { token, code }
    );
    return { message: res.data.message, refreshToken: res.data.refreshToken };
  } catch (error: any) {
    return rejectWithValue({ message: error.response?.data?.message || 'Confirm forgot password failed' });
  }
});

export const validateUserId = createAsyncThunk<
  { message: string; success: boolean },
  { userId: string },
  { rejectValue: { message: string } }
>('users/validate', async ({userId}, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`${API.VALIDATE_USER}/${userId}`, {
      headers: {
        token: 'refresh',
      },
    });

    return res.data;
  } catch (error: any){
    return rejectWithValue({
      message:
        error.response?.data?.message || 'Lỗi khi xác thực người dùng',
    });
  }
})