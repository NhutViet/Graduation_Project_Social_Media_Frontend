import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { fetchTaggedPosts } from './taggedPostSlice';
import { TaggedPost } from './taggedPostTypes';

interface TaggedPostsState {
  message: string;
  data: TaggedPost[];
  error?: string;
  loading: boolean;
}

const initialState: TaggedPostsState = {
  message: '',
  data: [],
  error: undefined,
  loading: false,
};

const taggedPostReducer = createReducer(initialState, builder => {
  builder
    .addCase(fetchTaggedPosts.fulfilled, (
      state,
      action: PayloadAction<TaggedPost[]>) => {
      state.loading = false;
      state.data = action.payload;
      state.message = 'success';
      state.error = undefined;
    });
});

export default taggedPostReducer;
