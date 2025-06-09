import {createAsyncThunk} from '@reduxjs/toolkit';
import {Story, userFollow} from './StoryType';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const seenStory = createAsyncThunk<
  void,
  {storyId: string; userId: string},
  {rejectValue: string}
>('stories/seenStory', async ({storyId, userId}, {rejectWithValue}) => {
  try {
    await axiosInstance.patch(
      '/stories/seen',
      {_id: storyId, userId},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to mark story as seen',
    );
  }
});

export const fetchFollowingStories = createAsyncThunk<
  userFollow[],
  { page: number },
  {rejectValue: {message: string}}
>('stories/fetchFollowing', async ({ page }, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get(`${API.GET_USER_FOLLOW}?page=${page}`, {
      headers: {
        token: 'refresh',
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Lấy stories thất bại',
    });
  }
});

export const fetchStoriesByIds = createAsyncThunk<
  Story[],
  string[],
  {rejectValue: string}
>('stories/fetchStoriesByIds', async (storyIds, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(
      '/stories/by-ids',
      {storyIds},
      {
        headers: {token: 'refresh'},
      },
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch story details',
    );
  }
});
