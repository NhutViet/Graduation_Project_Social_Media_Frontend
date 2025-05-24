import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import {API} from '../api';
import {CommentPost} from './commentTypes';

export const fetchCommentsByPost = createAsyncThunk<
  CommentPost[],
  string,
  {rejectValue: string}
>('comments/fetchByPost', async (postId, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get(
      `${API.GET_COMMENT_POST}/${postId}`,
    );
    return response.data as CommentPost[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data || 'Network error');
  }
});
