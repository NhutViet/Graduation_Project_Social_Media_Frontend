import { createSlice } from '@reduxjs/toolkit';
import {CommentPost} from './commentTypes';
import { fetchCommentsByPost } from './commentSlice';

interface CommentState {
  comments: CommentPost[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const commentReducer = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCommentsByPost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCommentsByPost.fulfilled,
        (state, action) => {
          state.loading = false;
          state.comments = action.payload;
        },
      )
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load comments';
      });
  },
});

export default commentReducer.reducer;