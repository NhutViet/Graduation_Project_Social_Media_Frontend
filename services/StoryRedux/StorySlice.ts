import {createAsyncThunk} from '@reduxjs/toolkit';
import {Story, userFollow} from './StoryType';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const seenStory = createAsyncThunk<
  any,
  {storyId: string},
  {rejectValue: string}
>('stories/seenStory', async ({storyId}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.patch(
      '/stories/seen',
      {_id: storyId},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to mark story as seen',
    );
  }
});

export const fetchFollowingStories = createAsyncThunk<
  userFollow[],
  {page: number},
  {rejectValue: {message: string}}
>('stories/fetchFollowing', async ({page}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get(
      `${API.GET_USER_FOLLOW}?page=${page}`,
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Lấy stories thất bại',
    });
  }
});

// lấy story đã đăng
export const fetchGetPostedSotry = createAsyncThunk<
  Story[],
  void,
  {rejectValue: string}
>('stories/fetchPostedSotry', async (_, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get(`/stories/me`, {
      headers: {
        token: 'refresh',
      },
    });
    return response.data?.data || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Không lấy được story đã đăng',
    );
  }
});

export const toggleLikeStory = createAsyncThunk<
  {storyId: string; likedByUsers: string[]},
  {storyId: string},
  {rejectValue: string}
>('stories/toggleLikeStory', async ({storyId}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.patch(
      `/stories/like`,
      {_id: storyId},
      {
        headers: {token: 'refresh'},
      },
    );
    return {
      storyId: res.data.data._id,
      likedByUsers: res.data.data.likedByUsers || [],
    };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to like story',
    );
  }
});
