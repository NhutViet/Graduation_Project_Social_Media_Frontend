import {createSlice} from '@reduxjs/toolkit';
import {UserProfile} from './relationTypes';
import {fetchFollowers, fetchFollowing, fetchBlocking, fetchRecommendations, relationAction, fetchViewedFollowers, fetchViewedFollowing} from './relationSlice';

interface RelationState {
  followers: UserProfile[];
  viewedFollowers: UserProfile[];
  following: UserProfile[];
  viewedFollowing: UserProfile[];
  blocking:    UserProfile[]; 
  recommendations: UserProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: RelationState = {
  followers: [],
  following: [],
  viewedFollowers: [],
  viewedFollowing: [],
  blocking: [],
  recommendations: [],
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
      state.blocking = [];  
      state.recommendations = [];
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    clearBlocking: state => {   
      state.blocking = [];
    },
    clearRecommendations: state => {
      state.recommendations = [];
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
      })

        // fetchBlocking
      .addCase(fetchBlocking.pending, state => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchBlocking.fulfilled, (state, action) => {
        state.loading  = false;
        state.blocking = action.payload;
      })
      .addCase(fetchBlocking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Tải dữ liệu người bị chặn thất bại';
      })

      // fetchRecommendations
      .addCase(fetchRecommendations.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Tải dữ liệu gợi ý thất bại';
      })

      // viewedFollowers
      .addCase(fetchViewedFollowers.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchViewedFollowers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.viewedFollowers = payload;
      })
      .addCase(fetchViewedFollowers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || state.error;
      })

      // viewedFollowing
      .addCase(fetchViewedFollowing.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchViewedFollowing.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.viewedFollowing = payload;
      })
      .addCase(fetchViewedFollowing.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || state.error;
      })

      //relationAction
      .addCase(relationAction.fulfilled, (state, { meta, payload }) => {
        const { action, targetId } = meta.arg;
        if (action === 'follow') {
          const u1 = state.followers.find(u => u._id === targetId)
          if (u1 && !state.following.some(x => x._id === targetId)) {
            state.following.unshift(u1);
          }
          const u2 = state.viewedFollowers.find(u => u._id === targetId);
          if (u2 && !state.viewedFollowing.some(x => x._id === targetId)) {
            state.viewedFollowing.unshift(u2);
          }
        } 
        if (action === 'unfollow') {
          state.following = state.following.filter(u => u._id !== targetId);
          state.viewedFollowing = state.viewedFollowing.filter(u => u._id !== targetId);
        }
      });
  },
});

export const {clearRelations, clearError, clearRecommendations} = relationReducer.actions;
export default relationReducer.reducer;
