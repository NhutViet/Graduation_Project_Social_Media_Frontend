import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import {API} from '../api';
import {AddCommentPayload, CommentPost} from './commentTypes';

export const fetchCommentsByPost = createAsyncThunk<
  CommentPost[],
  string,
  {rejectValue: string}
>('comments/fetchByPost', async (postId, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get(
      `${API.GET_COMMENT_POST}/${postId}`,
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data as CommentPost[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data || 'Network error');
  }
});

export const addComment = createAsyncThunk<any, AddCommentPayload>(
  'comments/add',
  async (payload, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.post(API.ADD_COMMENT, payload, {
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
