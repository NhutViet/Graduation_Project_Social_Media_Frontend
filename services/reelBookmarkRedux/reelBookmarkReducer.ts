import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface reelSave {
  postId?: string;
}

interface reelBookmark {
  bookmark: reelSave[];
}

const initialState: reelBookmark = {
  bookmark: [],
};

const reelBookmarkReducer = createSlice({
  name: 'reelBookmark',
  initialState,
  reducers: {
    addBookmark: (state, action: PayloadAction<reelSave>) => {
      const exists = state.bookmark.some(
        item => item.postId === action.payload.postId,
      );
      if (!exists) {
        state.bookmark.push(action.payload);
      }
    },
    removeReelBookmark: (state, action: PayloadAction<string>) => {
      state.bookmark = state.bookmark.filter(
        item => item.postId !== action.payload,
      );
    },
  },
});

export const { addBookmark, removeReelBookmark } = reelBookmarkReducer.actions;
export default reelBookmarkReducer.reducer;