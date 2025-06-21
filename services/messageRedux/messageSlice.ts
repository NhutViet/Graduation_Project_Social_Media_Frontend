import {createAsyncThunk} from '@reduxjs/toolkit';
import {API} from '../api';
import axiosInstance from '../axiosInstance';
import {Message} from './messageType';

const getRecentMessages = async (
  roomId: string,
  limit: number = 20,
): Promise<Message[] | null> => {
  try {
    const response = await axiosInstance.get<Message[]>(
      `${API.MESSAGES_URL}/${roomId}`,
      {
        params: {limit},
      },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch recent messages', error);
    return null;
  }
};

export const fetchMessages = createAsyncThunk<
  Message[],
  {roomId: string; limit?: number},
  {rejectValue: string}
>('messages/fetchMessages', async ({roomId, limit = 20}, thunkAPI) => {
  try {
    const res = await getRecentMessages(roomId, limit);
    if (!res) return thunkAPI.rejectWithValue('No data returned');
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to fetch messages');
  }
});

export const deleteMessageById = createAsyncThunk<
  {deleted: boolean; reason?: string},
  {messageId: string},
  {rejectValue: string}
>('messages/deleteById', async ({messageId}, thunkAPI) => {
  try {
    const response = await axiosInstance.delete<{
      deleted: boolean;
      reason?: string;
    }>(`${API.MESSAGES_URL}/${messageId}`, {
      headers: {
        token: 'refresh',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to delete message', error);
    return thunkAPI.rejectWithValue('Failed to delete message');
  }
});
