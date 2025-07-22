import {createSlice} from '@reduxjs/toolkit';
import {Load, Pagination, LoadLiked, Item} from './postUserType';
import {
  getPostsAndReelsOfUser,
  getPostsOfUser,
  getReelsOfUser,
  getLikedPosts,
} from './postUserSlice';

const emptyPagination: Pagination = {
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 20,
  hasNextPage: false,
  hasPrevPage: false,
};

const initialLiked: LoadLiked = {
  items: [],
  pagination: emptyPagination,
};

interface PostUser {
  posts: Load | {};
  reels: Load | {};
  likedPosts: LoadLiked;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

const initialState: PostUser = {
  posts: {},
  reels: {},
  likedPosts: initialLiked,
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
    },
    clearLikedPosts(state) {
      state.likedPosts.items = [];
      state.likedPosts.pagination = initialLiked.pagination;
    },
    updateIsFollowPostUser(state, action) {
      const {userId, isFollow} = action.payload;

      const updateList = (items: Item[] | undefined) => {
        if (!items) return;
        items.forEach(item => {
          if (item.user?._id === userId) {
            item.isFollow = isFollow;
          }
        });
      };

      // Cập nhật posts
      if ('items' in state.posts) {
        updateList(state.posts.items as Item[]);
      }

      // Cập nhật reels
      if ('items' in state.reels) {
        updateList(state.reels.items as Item[]);
      }

      // Cập nhật likedPosts
      updateList(state.likedPosts.items as Item[]);
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
      // likedPost
      .addCase(getLikedPosts.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = '';
      })
      .addCase(getLikedPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        const {page} = action.meta.arg;
        if (page && page > 1) {
          state.likedPosts.items.push(...action.payload.data);
        } else {
          state.likedPosts.items = action.payload.data;
        }
        state.likedPosts.pagination = action.payload.pagination;
      })
      .addCase(getLikedPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || 'Lấy bài đã thích thất bại.';
        state.likedPosts = initialLiked;
      });
  },
});

export const {clearPostsAndReels, clearLikedPosts, updateIsFollowPostUser} = PostUserReducer.actions;
export default PostUserReducer.reducer;
