import { createAsyncThunk } from '@reduxjs/toolkit';
import { TaggedPost } from './taggedPostTypes';
import axiosInstance from '@services/axiosInstance';

export interface ResTaggedPosts {
  message: string;
  data: TaggedPost[];
}

export const fetchTaggedPosts = createAsyncThunk<TaggedPost[], string>(
  'posts/tagged',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ResTaggedPosts>(
        `posts/tagged/${userId}`,
        {
          headers: {
            token: 'refresh',
          },
        }
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
