import {createAsyncThunk} from '@reduxjs/toolkit';
import {PostWithMedia, UploadPostPayload} from './postTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const fetchPostsWithMedia = createAsyncThunk<PostWithMedia[]>(
  'posts/fetchWithMedia',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(API.GET_ALL_POST, {
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

export const fetchReelsWithMedia = createAsyncThunk<PostWithMedia[]>(
  'posts/fetchReelsWithMedia',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(API.GET_REELS_POST, {
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

export const uploadPostWithMedia = createAsyncThunk<
  PostWithMedia,
  UploadPostPayload
>('posts/uploadWithMedia', async (payload, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(API.UPLOAD_POST, payload, {
      headers: {
        token: 'refresh',
      },
    });
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});
