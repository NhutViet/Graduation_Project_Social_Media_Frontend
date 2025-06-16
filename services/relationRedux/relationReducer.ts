import {createSlice} from '@reduxjs/toolkit';
import {UserProfile, RelationWithUser} from './relationTypes';
import {fetchFollowers, fetchFollowing} from './relationSlice';

interface RelationState {
  followers: UserProfile[];
  following: UserProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: RelationState = {
  followers: [],
  following: [],
  loading: false,
  error: null,
};

const relationReducer = createSlice({
  name: 'relations',
  initialState,
  reducers: {
    clearRelations: state => {
      state.followers = [];
      state.following = [];
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
        //fetchFollower
      .addCase(fetchFollowers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Tải dữ liệu người theo dõi thất bại';
      })
        
        //fetchFollowing
      .addCase(fetchFollowing.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Tải dữ liệu người đang theo dõi thất bại';
      });
  },
});

export const {clearRelations, clearError} = relationReducer.actions;
export default relationReducer.reducer;
