import {createSlice} from '@reduxjs/toolkit';
import {fetchPostsWithMedia, fetchReelsWithMedia, hidePost} from './postSlice';
import {PostWithMedia} from './postTypes';

interface PostState {
  posts: PostWithMedia[];
  reels: PostWithMedia[];
  loading: boolean;
  error: string | null;
  page: number;
  hasNextPage: boolean;
}

const initialState: PostState = {
  posts: [],
  reels: [],
  loading: false,
  error: null,
  page: 1,
  hasNextPage: true,  
};

const postReducer = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    updateIsFollowByUserId: (state, action) => {
      const {userId, isFollow} = action.payload;

      const updatedPosts = state.posts.map(item =>
        item.userID === userId
          ? {
              ...item,
              isFollow,
            }
          : item,
      );

      state.posts.length = 0;
      state.posts.push(...updatedPosts);

      const updatedReels = state.reels.map(item =>
        item.userID === userId
          ? {
              ...item,
              isFollow,
            }
          : item,
      );

      state.reels.length = 0;
      state.reels.push(...updatedReels);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPostsWithMedia.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsWithMedia.fulfilled, (state, action) => {
        state.loading = false;
        const { items, pagination } = action.payload;
        if (action.meta.arg.page > 1) {
          state.posts.push(...items);          
        } else {
          state.posts = items;                 
        }
        state.page = pagination.currentPage;
        state.hasNextPage = pagination.hasNextPage;
      })
      .addCase(fetchPostsWithMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /// reels
      .addCase(fetchReelsWithMedia.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReelsWithMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.reels = action.payload;
      })
      .addCase(fetchReelsWithMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(hidePost.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        state.posts = state.posts.filter((post: any) => post._id !== postId);
        state.reels = state.reels.filter((post: any) => post._id !== postId);
      });
  },
});

export const {updateIsFollowByUserId} = postReducer.actions;
export default postReducer.reducer;
