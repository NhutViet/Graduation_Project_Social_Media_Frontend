import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CommentPost} from './commentTypes';
import {fetchCommentsByPost} from './commentSlice';

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

const findAndUpdateComment = (
  comments: CommentPost[],
  commentId: string,
  updater: (comment: CommentPost) => void,
): boolean => {
  for (const comment of comments) {
    if (comment._id === commentId) {
      updater(comment);
      return true;
    }
    if (comment.reply && comment.reply.length > 0) {
      if (findAndUpdateComment(comment.reply, commentId, updater)) return true;
    }
  }
  return false;
};

const commentReducer = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    updateCommentLike(
      state,
      action: PayloadAction<{commentId: string; userId: string}>,
    ) {
      const {commentId} = action.payload;
      findAndUpdateComment(state.comments, commentId, comment => {
        comment.totalLikes += 1;
        comment.isLiked = true;
      });
    },

    updateCommentUnlike(
      state,
      action: PayloadAction<{commentId: string; userId: string}>,
    ) {
      const {commentId} = action.payload;
      findAndUpdateComment(state.comments, commentId, comment => {
        comment.totalLikes = Math.max(0, comment.totalLikes - 1);
        comment.isLiked = false;
      });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCommentsByPost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load comments';
      });
  },
});

export const {updateCommentLike, updateCommentUnlike} = commentReducer.actions;
export default commentReducer.reducer;
