import {createSlice} from '@reduxjs/toolkit';
import {likePost, unlikePost} from './reactionSlice';

interface ReactionState {
  likePosts: string[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: ReactionState = {
  likePosts: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: null,
};

const reactionReducer = createSlice({
  name: 'reaction',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //like post
      .addCase(likePost.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const postId = action.payload.postId;
        if (!state.likePosts.includes(postId)) {
          state.likePosts.push(postId);
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          (action.payload as string) || 'Yêu thích bài viết thất bại';
      })

      //unlike post
      .addCase(unlikePost.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = null;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const postId = action.payload.postId;
        state.likePosts = state.likePosts.filter(id => id !== postId);
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });
  },
});

export default reactionReducer.reducer;
