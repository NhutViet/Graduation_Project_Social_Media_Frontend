// reelSlice.ts
import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {fetchReels} from './reelSlice';
import {Reel} from './reelTypes';

interface ReelState {
  message: string;
  data: Reel[];
  loading: boolean;
  error?: string;
}

const initReelState: ReelState = {
  message: '',
  data: [],
  loading: false,
  error: undefined,
};

const reelReducer = createReducer(initReelState, builder => {
  builder
    .addCase(fetchReels.pending, state => {
      state.loading = true;
      state.error = undefined;
    })
    .addCase(fetchReels.fulfilled, (state, action: PayloadAction<Reel[]>) => {
      state.loading = false;
      state.data = action.payload;
      state.message = 'Fetch reels success';
    })
    .addCase(fetchReels.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Unknown error';
      state.message = 'Fetch reels failed';
    });
});

export default reelReducer;
