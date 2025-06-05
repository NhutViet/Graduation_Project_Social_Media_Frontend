import {createAsyncThunk} from '@reduxjs/toolkit';
import {userFollow} from './StoryType';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

// export const fetchFollowingStories = createAsyncThunk<
//   Story[],
//   string,
//   {rejectValue: string}
// >('stories/fetchFollowingStories', async (userId, {rejectWithValue}) => {
//   try {
//     const response = await axiosInstance.get(
//       `${API.GET_STORY_BY_USERID}/${userId}`,
//     );
//     console.log('Story', response);
//     return response.data;
//   } catch (err: any) {
//     return rejectWithValue(
//       err.response?.data?.message || 'Failed to fetch stories',
//     );
//   }
// });

export const seenStory = createAsyncThunk<
  void,
  {storyId: string; userId: string},
  {rejectValue: string}
>('stories/seenStory', async ({storyId, userId}, {rejectWithValue}) => {
  try {
    await axiosInstance.patch('/stories/seen', {storyId, userId});
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to mark story as seen',
    );
  }
});

export const fetchFollowingStories = createAsyncThunk<
  userFollow[],
  void,
  {rejectValue: {message: string}}
>(
  'stories/fetchFollowing',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(`${API.GET_USER_FOLLOW}`, {
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
  }
);
