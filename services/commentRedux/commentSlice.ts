import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import {API} from '../api';
import {CommentPost, ReqComment, UserComment} from './commentTypes';

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

export const addComment = createAsyncThunk<
  CommentPost, // ✅ Trả về một CommentPost
  ReqComment,
  {rejectValue: string}
>(
  'comments/add',
  async (
    {payload, handleName, receiverId, postId, userId, parentUserId},
    {rejectWithValue, getState},
  ) => {
    try {
      const res = await axiosInstance.post(API.ADD_COMMENT, payload, {
        headers: {token: 'refresh'},
      });

      const commentData = res.data;

      const state: any = getState();
      const currentUser = state.user.user;

      const newComment: CommentPost = {
        _id: commentData.comment._id,
        postID: commentData.comment.postID,
        parentID: commentData.comment.parentID,
        content: commentData.comment.content,
        mediaUrl: commentData.comment.mediaUrl,
        isDeleted: commentData.comment.isDeleted,
        createdAt: commentData.comment.createdAt,
        totalLikes: 0,
        isLiked: false,
        reply: [],
        user: {
          _id: currentUser?._id || '',
          handleName: handleName || '',
          profilePic: currentUser?.profilePic,
          username: currentUser?.username,
        },
      };

      if (res.status >= 200 && res.status <= 300 && userId !== receiverId) {
        await axiosInstance.post(
          API.NOTIFICATION_API,
          {
            receiverIds: [receiverId],
            title: `${handleName} đã bình luận bài viết của bạn`,
            body: 'Nhấn vào để xem chi tiết...',
            data: {
              type: 'comment',
              postId,
              commentId: newComment._id,
            },
          },
          {
            headers: {token: 'refresh'},
          },
        );

        if (res.data?.comment?.parentID && parentUserId &&  parentUserId.length > 0 && userId !== parentUserId) {
          await axiosInstance.post(
            API.NOTIFICATION_API,
            {
              receiverIds: [parentUserId],
              title: `${handleName} đã trả lời bình luận của bạn bình luận của bạn`,
              body: 'Nhấn vào để xem chi tiết...',
              data: {
                type: 'comment',
                postId,
                commentId: res.data?.comment?._id,
              },
            },
            {
              headers: {token: 'refresh'},
            },
          );
        }
      };

      return newComment;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Bình luận thất bại',
      );
    }
  },
);

export const likeComment = createAsyncThunk<any, {commentId: string, receiverId?: string, handleName?: string, userId?: string, postId?: string}, {rejectValue: string}>(
  'comments/like',
  async ({commentId, handleName, receiverId, userId, postId}, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(
        `${API.COMMENT}/${commentId}/like`,
        {},
        {
          headers: {
            token: 'refresh',
          },
        },
      );

      if (res.status >= 200 && res.status <= 300 && userId !== receiverId) {
        await axiosInstance.post(
          API.NOTIFICATION_API,
          {
            receiverIds: [receiverId],
            title: `${handleName} đã yêu thích bình luận bài viết của bạn`,
            body: 'Nhấn vào để xem chi tiết...',
            data: {
              type: 'comment',
              postId,
              commentId: commentId,
            },
          },
          {
            headers: {token: 'refresh'},
          },
        );
      };

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const unlikeComment = createAsyncThunk<
  any,
  string,
  {rejectValue: string}
>('comments/unlike', async (commentId, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.post(
      `${API.COMMENT}/${commentId}/unlike`,
      {},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});
