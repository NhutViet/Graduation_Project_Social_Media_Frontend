import {createSlice} from '@reduxjs/toolkit';
import {Load, Pagination} from './postUserType';
import {
  getPostsAndReelsOfUser,
  getPostsOfUser,
  getReelsOfUser,
  getLikedPosts
} from './postUserSlice';

const emptyPagination: Pagination = {
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 20,
  hasNextPage: false,
  hasPrevPage: false,
};
const initialLoad: Load = { items: [], pagination: emptyPagination };

interface PostUser {
  posts: Load | {};
  reels: Load | {};
  likedPosts: Load | {};  
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

const initialState: PostUser = {
  posts: {},
  reels: {},
  likedPosts: initialLoad, 
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
};

const PostUserReducer = createSlice({
  name: 'postsUser',
  initialState,
  reducers: {
    clearPostsAndReels(state) {
      state.posts = {};
      state.reels = {};
      state.likedPosts = {};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getPostsOfUser.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = '';
        state.posts = {};
      })
      .addCase(getPostsOfUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.posts;
      })
      .addCase(getPostsOfUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || 'Lấy bài viết thất bại.';
      })
      .addCase(getReelsOfUser.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = '';
        state.reels = {};
      })
      .addCase(getReelsOfUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reels = action.payload.reels;
      })
      .addCase(getReelsOfUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || 'Lấy thước phim thất bại.';
      })
      ////lấy cả post và reels
      .addCase(getPostsAndReelsOfUser.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = '';
        state.posts = {}; // reset cả hai
        state.reels = {};
      })
      .addCase(getPostsAndReelsOfUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.posts;
        state.reels = action.payload.reels;
      })
      .addCase(getPostsAndReelsOfUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || 'Lấy bài viết và thước phim thất bại.';
        state.posts = {};
        state.reels = {};
      })
      // lấy bài viết đã tim
      .addCase(getLikedPosts.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = '';
        state.likedPosts = {};
      })
      .addCase(getLikedPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.likedPosts = {
          items: action.payload.data,
          pagination: action.payload.pagination,
        };
      })
      .addCase(getLikedPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || 'Lấy bài đã thích thất bại.';
      });
  },
});

export const {clearPostsAndReels} = PostUserReducer.actions;
export default PostUserReducer.reducer;
