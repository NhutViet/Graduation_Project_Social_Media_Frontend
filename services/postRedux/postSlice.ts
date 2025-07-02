import {createAsyncThunk} from '@reduxjs/toolkit';
import {PostWithMedia, UploadPostPayload, Pagination} from './postTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const fetchPostsWithMedia = createAsyncThunk<
  { items: PostWithMedia[]; pagination: Pagination; isLoadMore: boolean }, 
  { page: number; limit?: number },
  { rejectValue: any }
>(
  'posts/fetchWithMedia',
  async ({ page, limit = 10 }, { rejectWithValue, getState }) => {
    try {
      const { data } = await axiosInstance.get(API.GET_ALL_POST, {
        params: { page, limit },
        headers: { token: 'refresh' },
      });
      
      return { 
        items: data.items, 
        pagination: data.pagination,
        isLoadMore: page > 1 
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const fetchReelsWithMedia = createAsyncThunk<
  { items: PostWithMedia[]; pagination: Pagination; isLoadMore: boolean },
  { page: number; limit?: number },
  { rejectValue: any }
>(
  'posts/fetchReelsWithMedia',
  async ({ page, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.GET_REELS_POST, {
        params: { page, limit },
        headers: { token: 'refresh' },
      });
      return {
        items: response.data.items,
        pagination: response.data.pagination,
        isLoadMore: page > 1,
      };
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

export const hidePost = createAsyncThunk<
  {message: string},
  string,
  {rejectValue: string}
>('posts/hidePost', async (postId, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(
      `${API.HIDDEN_POST}/${postId}`,
      {},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    if (err.response?.status === 409) {
      return rejectWithValue('Bài viết đã bị ẩn trước đó.');
    }
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchTaggingPost = createAsyncThunk<PostWithMedia[]>(
  'posts/tags',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(API.GET_TAGGING_POST, {
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
