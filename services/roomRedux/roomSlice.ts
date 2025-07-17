import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  CreateRoomDto,
  CreateRoomResponse,
  ResRoomUser,
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

export const getRoomById = createAsyncThunk<
  Room,
  string,
  {rejectValue: {message: string}}
>('rooms/getRoomById', async (roomId, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get<Room>(`${API.ROOM}/${roomId}`, {
      headers: {
        token: 'refresh',
      },
    });
    return response.data;
  } catch (err: any) {
    return rejectWithValue({message: err.response?.data?.message || 'Lấy chi tiết phòng chat thất bại.'});
  }
});

export const getRoomUsers = createAsyncThunk<
  ResRoomUser,
  {roomId: string},
  {rejectValue: {message: string}}
>(
  'rooms/users',
  async ({roomId}, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(`${API.ROOM}/${roomId}/users`, {
        headers: {
          token: 'refresh',
        },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue({message: error?.response?.data?.message || 'Không thể lấy danh sách người dùng.'})
    }
  },
);