import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Music } from "./musicType";
import { fetchAllMusic } from "./musicSlice";

interface MusicState {
  musicList: Music[];
  musicBookmark: Music[];
  loading: boolean;
  error: string | null;
}

const initialState: MusicState = {
  musicList: [],
  musicBookmark: [],
  loading: false,
  error: null,
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    addToBookmark: (state, action: PayloadAction<Music>) => {
      const exists = state.musicBookmark.find(item => item._id === action.payload._id);
      if (!exists) {
        state.musicBookmark.push(action.payload);
      }
    },
    removeFromBookmark: (state, action: PayloadAction<string>) => {
      state.musicBookmark = state.musicBookmark.filter(
        (item) => item._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMusic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMusic.fulfilled, (state, action) => {
        state.loading = false;
        state.musicList = action.payload;
      })
      .addCase(fetchAllMusic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addToBookmark, removeFromBookmark } = musicSlice.actions;
export default musicSlice.reducer;