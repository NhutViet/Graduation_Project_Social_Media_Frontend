import { createAsyncThunk } from '@reduxjs/toolkit';
import { Room } from './roomType';
import axiosInstance from '../axiosInstance';
import { API } from '../api';

export const fetchMyRooms = createAsyncThunk<Room[]>(
  'rooms/fetchMyRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API.GET_MY_ROOMS}`, {
        headers: {
          token: 'refresh',
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);