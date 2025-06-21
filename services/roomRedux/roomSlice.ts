import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  CreateRoomDto,
  CreateRoomResponse,
  Room,
  UpdateRoomNameArgs,
  UpdateRoomThemeArgs,
} from './roomType';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const fetchMyRooms = createAsyncThunk<Room[]>(
  'rooms/fetchMyRooms',
  async (_, {rejectWithValue}) => {
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
  },
);

export const fetchMyWaitingRooms = createAsyncThunk<Room[]>(
  'rooms/fetchMyWaitingRooms',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(`${API.GET_MY_WAITING_ROOMS}`, {
        headers: {
          token: 'refresh',
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateRoomTheme = createAsyncThunk<
  any,
  UpdateRoomThemeArgs,
  {rejectValue: any}
>('rooms/updateRoomTheme', async ({roomId, theme}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(
      `${API.ROOM}/${roomId}/theme`,
      {theme},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateRoomName = createAsyncThunk<
  any,
  UpdateRoomNameArgs,
  {rejectValue: any}
>('rooms/updateRoomName', async ({roomId, name}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(
      `${API.ROOM}/${roomId}/name`,
      {name},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createRoom = createAsyncThunk<
  CreateRoomResponse,
  CreateRoomDto,
  {rejectValue: any}
>('rooms/createRoom', async (payload, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post<CreateRoomResponse>(
      API.ROOM,
      payload,
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});
