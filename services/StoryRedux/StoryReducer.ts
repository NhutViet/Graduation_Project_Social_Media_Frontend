import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Story, userFollow} from './StoryType';
import {
  fetchFollowingStories,
  fetchGetPostedSotry,
  seenStory,
  toggleLikeStory,
  fetchStoryDetails,
  createHighlightStory, // New thunk
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
  storyDetails: [],
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
      // ====== FOLLOWING STORIES ======
      .addCase(fetchFollowingStories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowingStories.fulfilled, (state, action) => {
        const users = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];

        state.followingUsers = users;
        state.loading = false;

        for (const user of users) {
          const storyIds = user.stories || [];

          for (const storyId of storyIds) {
            const exists = state.storyDetails.some(s => s._id === storyId);
            if (!exists) {
              state.storyDetails.push({
                _id: storyId,
                userId: user._id,
                type: 'stories',
                mediaUrl: '',
                viewsCount: 0,
                isArchived: false,
                viewerId: [],
                likedByUsers: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              } as Story);
            }
          }
        }
      })
      .addCase(fetchFollowingStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Lỗi tải stories';
      })

      // ====== STORY DETAILS ======
      .addCase(fetchStoryDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStoryDetails.fulfilled,
        (state, action: PayloadAction<Story[]>) => {
          state.loading = false;
          action.payload.forEach(newStory => {
            const index = state.storyDetails.findIndex(
              s => s._id === newStory._id,
            );
            if (index !== -1) {
              state.storyDetails[index] = newStory;
            } else {
              state.storyDetails.push(newStory);
            }

            // Update storyDetails in followingUsers
            for (const user of state.followingUsers) {
              if (user.stories?.includes(newStory._id)) {
                if (!user.storyDetails) user.storyDetails = [];
                const userStoryIndex = user.storyDetails.findIndex(
                  s => s._id === newStory._id,
                );
                if (userStoryIndex !== -1) {
                  user.storyDetails[userStoryIndex] = newStory;
                } else {
                  user.storyDetails.push(newStory);
                }
              }
            }
          });
        },
      )
      .addCase(fetchStoryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi tải chi tiết story';
      })

      // ====== SEEN STORY ======
      .addCase(seenStory.fulfilled, (state, action) => {
        const story = action.payload?.data;
        if (!story || !story._id) return;

        const index = state.storyDetails.findIndex(s => s._id === story._id);
        if (index !== -1) {
          state.storyDetails[index] = story;
        } else {
          state.storyDetails.push(story);
        }

        for (const user of state.followingUsers) {
          if (user.stories?.includes(story._id)) {
            if (!user.storyDetails) user.storyDetails = [];

            const idx = user.storyDetails.findIndex(s => s._id === story._id);
            if (idx !== -1) {
              user.storyDetails[idx] = story;
            } else {
              user.storyDetails.push(story);
            }
          }
        }
      })
      .addCase(seenStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Xem story thất bại';
      })

      // ====== MY STORIES ======
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

      // ====== LIKE STORY ======
      .addCase(toggleLikeStory.pending, state => {
        state.loading = true;
      })
      .addCase(
        toggleLikeStory.fulfilled,
        (
          state,
          action: PayloadAction<{
            storyId: string;
            likedByUsers: string[];
          }>,
        ) => {
          const {storyId, likedByUsers} = action.payload;

          const index = state.storyDetails.findIndex(s => s._id === storyId);
          if (index !== -1) {
            state.storyDetails[index].likedByUsers = likedByUsers;
          }

          for (const user of state.followingUsers) {
            const story = user.storyDetails?.find(s => s._id === storyId);
            if (story) {
              story.likedByUsers = likedByUsers;
            }
          }
        },
      )
      .addCase(toggleLikeStory.rejected, (state, action) => {
        state.error = action.payload || 'Không thể like story';
      })
      // ====== Create highlight story  ======
      .addCase(createHighlightStory.pending, state => {
        (state.loading = true), (state.error = null);
      })
      .addCase(
        createHighlightStory.fulfilled,
        (state, action: PayloadAction<Story>) => {
          state.loading = false;
          state.error = null;
          state.myStories.push(action.payload);
        },
      )
      .addCase(createHighlightStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể tạo highlight';
      });
  },
});

export default storySlice.reducer;
