import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import {API} from '../api';
import {AddCommentPayload, CommentPost, ReqComment} from './commentTypes';

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

export const addComment = createAsyncThunk<any, ReqComment>(
  'comments/add',
  async ({payload, handleName, receiverId, postId, userId}, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.post(API.ADD_COMMENT, payload, {
        headers: {
          token: 'refresh',
        },
      });

      if (response.status >= 200 && response.status <= 300 && userId !== receiverId) {
        await axiosInstance.post(
          API.NOTIFICATION_API,
          {
            receiverIds: [receiverId],
            title: `${handleName} đã bình luận bài viết của bạn`,
            body: 'Nhấn vào để xem chi tiết...',
            data: {
              type: 'comment',
              postId,
              commentId: response.data?.comment?._id,
            },
          },
          {
            headers: {
              token: 'refresh',
            },
          },
        );
      }

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
