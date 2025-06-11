import {createAsyncThunk} from '@reduxjs/toolkit';
import {User, UserRes, PublicUserRes, EditUserDto} from './userTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';
import {resetUser} from './userReducer';

export const fetchLogin = createAsyncThunk<
  {user: UserRes['user']; refreshToken: string},
  {email: string; password: string},
  {rejectValue: {message: string}}
>('auth/login', async ({email, password}, {rejectWithValue}) => {
  try {
    const loginRes = await axiosInstance.post(API.GET_lOGIN_POST, {
      email,
      password,
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
      message: error.response?.data?.message || 'Login failed',
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
      message: error.response?.data?.message || 'Check refresh token failed',
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
    const message = error.response?.data?.message || 'Logout failed!!!';
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
      message: error.response?.data?.message || 'Registration failed',
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
      message: error.response?.data?.message || 'Check email failed',
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

    const { accessToken } = response.data;

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token', error);
    return null;
  }
};

export const fetchEditUser = createAsyncThunk<
  any,
  EditUserDto,
  {rejectValue: string}
>(
  'user/fetchEdituser',
  async (fromData: EditUserDto, {rejectWithValue, getState}) => {
    try {
      const state: any = getState();
      const response = await axiosInstance.patch(API.EDIT_USER, fromData, {
        headers: {
          token: 'refresh',
        },
      });

      return response.data.user;
    } catch (error) {
      console.log('Edit user line 152:', error);
    }
  },
);

export const getPublicProfile  = createAsyncThunk<
  PublicUserRes,
  {userId: string},
  {rejectValue: {message: string}}
>('users/public', async ({userId}, {rejectWithValue}) => {
  try{
    const res = await axiosInstance.get(`${API.GET_PUBLIC_PROFILE}/${userId}`, {
      headers: {
        token: 'refresh'
      },
    });

    return res.data;
  } catch (error: any){
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to get public profile',
    });
  }
});
