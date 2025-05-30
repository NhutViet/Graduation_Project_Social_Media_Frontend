import {createAsyncThunk} from '@reduxjs/toolkit';
import {UserRes} from './userTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const fetchLogin = createAsyncThunk<
  UserRes,
  {email: string; password: string},
  {rejectValue: {message: string}}
>('auth/login', async ({email, password}, {rejectWithValue}) => {
  try {
    const loginRes = await axiosInstance.post(API.GET_lOGIN_POST, {
      email,
      password,
    });

    const refreshToken = loginRes.data.refreshToken;
    const userRes = await axiosInstance.get<UserRes['user']>(API.GET_ME);
    console.log('token: ', refreshToken);
    console.log('user: ', userRes.data);
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

export const fetchRefresh = createAsyncThunk<
  {success: boolean},
  void,
  {rejectValue: {message: string}}
>('auth/refresh', async (_, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.post(API.POST_REFRESH);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Refresh failed!!!';
    return rejectWithValue({message});
  }
});

export const fetchLogout = createAsyncThunk<
  {success: string},
  void,
  {rejectValue: {message: string}}
>('auth/logout', async (_, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.post(API.POST_LOGOUT);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Logout failed!!!';
    return rejectWithValue({message});
  }
});
