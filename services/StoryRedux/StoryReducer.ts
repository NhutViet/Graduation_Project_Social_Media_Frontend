import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Story, userFollow} from './StoryType';
import {
  fetchFollowingStories,
  fetchGetPostedSotry,
  fetchStoriesByIds,
  seenStory,
  toggleLikeStory,
} from './StorySlice';

interface StoryState {
  followingUsers: userFollow[];
  storyDetails: Story[];
  myStories: Story[];
  loading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  followingUsers: [],
  storyDetails: [], // Khởi tạo storyDetails
  myStories: [],
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
      })
      .addCase(fetchStoriesByIds.pending, state => {
        state.loading = true;
        console.log('fetchStoriesByIds pending');
      })
      .addCase(
        fetchStoriesByIds.fulfilled,
        (state, action: PayloadAction<Story[]>) => {
          state.storyDetails = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchStoriesByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy chi tiết story thất bại';
      })
      .addCase(fetchGetPostedSotry.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGetPostedSotry.fulfilled,
        (state, action: PayloadAction<Story[]>) => {
          state.myStories = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchGetPostedSotry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể lấy story đã đăng';
      })
      .addCase(toggleLikeStory.fulfilled, (state, action) => {
        const {storyId, userId} = action.payload;
        for (const user of state.followingUsers) {
          const story = user.storyDetails?.find((s: any) => s._id === storyId);
          if (story) {
            const index = story.likedByUsers.indexOf(userId);
            if (index > -1) {
              story.likedByUsers.splice(index, 1);
            } else {
              story.likedByUsers.push(userId);
            }
          }
        }
      });
  },
});

export default storySlice.reducer;
