import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Story} from './StoryType';
import axiosInstance from '../axiosInstance';
import {fetchFollowingStories, seenStory} from './StorySlice';

interface StoryState {
  followingStories: Story[];
  loading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  followingStories: [],
  loading: false,
  error: null,
};

const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFollowingStories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowingStories.fulfilled, (state, action) => {
        state.followingStories = action.payload;
        state.loading = false;
      })
      .addCase(fetchFollowingStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error';
      })
      .addCase(seenStory.fulfilled, (state, action) => {
        const {storyId, userId} = action.meta.arg;
        const story = state.followingStories.find(s => s._id === storyId);
        if (story && !story.viewerId.includes(userId)) {
          story.viewerId.push(userId);
        }
      });
  },
});

export default storySlice.reducer;
