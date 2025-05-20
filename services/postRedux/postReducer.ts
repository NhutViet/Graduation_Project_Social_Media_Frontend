import {createSlice} from '@reduxjs/toolkit';
import {fetchPostsWithMedia, fetchReelsWithMedia} from './postSlice';
import { Post, PostWithMedia } from './postTypes';

interface PostState {
  posts: PostWithMedia[];
  reels: PostWithMedia[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  reels: [],
  loading: false,
  error: null,
};

const postReducer = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPostsWithMedia.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsWithMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
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
      });
  },
});

export default postReducer.reducer;
