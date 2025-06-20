import {createAsyncThunk} from '@reduxjs/toolkit';
import {Reel} from './reelTypes';
import axiosInstance from '@services/axiosInstance';

export const fetchReels = createAsyncThunk<Reel[], string>(
  'reels/fetchReels',
  async (userId, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(`posts/reels/${userId}`, {
        headers: {
          token: 'refresh',
        },
      });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
