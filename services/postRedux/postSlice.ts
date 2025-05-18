import {createAsyncThunk} from '@reduxjs/toolkit';
import {PostWithMedia} from './postTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const fetchPostsWithMedia = createAsyncThunk<PostWithMedia[]>(
  'posts/fetchWithMedia',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(API.GET_ALL_POST);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);
