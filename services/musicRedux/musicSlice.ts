import {createAsyncThunk} from '@reduxjs/toolkit';
import {Music} from './musicType';
import {API} from '../api';
import axiosInstance from '../axiosInstance';

export const fetchAllMusic = createAsyncThunk<Music[]>(
  'music/fetchAllMusic',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(API.GET_ALL_MUSIC, {
        headers: {
          token: 'refresh',
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Unknown error');
    }
  },
);
