import {createSlice} from '@reduxjs/toolkit';
import {fetchPostsWithMedia} from './postSlice';
import { Post, PostWithMedia } from './postTypes';

interface PostState {
  posts: PostWithMedia[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
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
      });
  },
});

export default postReducer.reducer;
