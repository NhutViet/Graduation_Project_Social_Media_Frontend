import { createSlice } from "@reduxjs/toolkit";
import { Music } from "./musicType";
import { fetchAllMusic } from "./musicSlice";

interface MusicState {
  musicList: Music[];
  loading: boolean;
  error: string | null;
}

const initialState: MusicState = {
  musicList: [],
  loading: false,
  error: null,
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {},
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

export default musicSlice.reducer;