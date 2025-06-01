import {createAsyncThunk} from '@reduxjs/toolkit';
import {User, UserRes} from './userTypes';
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
    await axiosInstance.post(API.POST_LOGOUT, {}, {
      headers: {
        token: 'refresh',
      },
    });

    dispatch(resetUser());

    return;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Logout failed!!!';
    return rejectWithValue({message});
  }
});

export const fetchRegister = createAsyncThunk<
  { message: string },
  { email: string; password: string, username: string, phoneNumber: string },
  { rejectValue: { message: string } }
>('auth/register', async ({ email, password, username, phoneNumber }, { rejectWithValue }) => {
  try {
    const registerRes = await axiosInstance.post(API.REGISTER, {
      email,
      password,
      username,
      phoneNumber
    });

    return {
      message: registerRes.data.message,
    };
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Registration failed',
    });
  }
});