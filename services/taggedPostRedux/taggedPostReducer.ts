import {createAction, createReducer, PayloadAction} from '@reduxjs/toolkit';
import {fetchTaggedPosts} from './taggedPostSlice';
import {TaggedPost} from './taggedPostTypes';

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

export const updateTaggedPostFollow = createAction<{
  userId: string;
  isFollow: boolean;
}>('taggedPost/updateFollow');

const taggedPostReducer = createReducer(initialState, builder => {
  builder
    .addCase(
      fetchTaggedPosts.fulfilled,
      (state, action: PayloadAction<TaggedPost[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.message = 'success';
        state.error = undefined;
      },
    )
    .addCase(updateTaggedPostFollow, (state, action) => {
      const {userId, isFollow} = action.payload;
      const arr: TaggedPost[] = Array.isArray(state.data) ? state.data : [];
      state.data = arr.map(post =>
        post.user._id === userId
          ? {...post, isFollow, user: {...post.user, isFollow}}
          : post,
      );
    });
});

export default taggedPostReducer;
