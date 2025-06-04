import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {userFollow} from './StoryType';
import {fetchFollowingStories, seenStory} from './StorySlice';

interface StoryState {
  followingUsers: userFollow[];
  loading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  followingUsers: [],
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
      .addCase(
        fetchFollowingStories.fulfilled,
        (state, action: PayloadAction<userFollow[]>) => {
          state.followingUsers = Array.isArray(action.payload)
            ? action.payload
            : [action.payload];
          state.loading = false;
        },
      )
      .addCase(fetchFollowingStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error';
      });
  },
});

export default storySlice.reducer;
