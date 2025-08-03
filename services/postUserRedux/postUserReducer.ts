import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Load, Pagination, LoadLiked, Item} from './postUserType';
import {
  getPostsAndReelsOfUser,
  getPostsOfUser,
  getReelsOfUser,
  getLikedPosts,
  DeleteMyPost,
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
    updateLikePostUser: (
      state,
      action: PayloadAction<{postId: string; isLike: boolean}>,
    ) => {
      const {postId, isLike} = action.payload;
      const delta = isLike ? 1 : -1;
      console.log('chạy');
      console.log('state.posts', state.posts);
      console.log('state.reels', state.reels);

      const updateList = (list: Item[] | undefined): Item[] => {
        if (!list) return [];
        return list.map(post => {
          if (post._id !== postId) return post;
          const current = post.likeCount ?? 0;
          return {
            ...post,
            isLike,
            likeCount: Math.max(0, current + delta),
          };
        });
      };

      if ('items' in state.posts) {
        state.posts.items = updateList(state.posts.items as Item[]);
        console.log('hmmm');
      }

      if ('items' in state.reels) {
        state.reels.items = updateList(state.reels.items as Item[]);
        console.log('hazzzz');
      }
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
      })
      .addCase(DeleteMyPost.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = '';
      })
      .addCase(DeleteMyPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const {modifiedCount} = action.payload;
        if (modifiedCount > 0) {
          const {postIds} = action.meta.arg;

          const filterItems = (items?: Item[]) =>
            items?.filter(item => !postIds.includes(item._id ?? '')) || [];

          // Xóa khỏi posts nếu có
          if ('items' in state.posts) {
            state.posts.items = filterItems(state.posts.items as Item[]);
          }

          // Xóa khỏi reels nếu có
          if ('items' in state.reels) {
            state.reels.items = filterItems(state.reels.items as Item[]);
          }

          state.likedPosts.items = state.likedPosts.items.filter(
            item => !postIds.includes(item._id ?? ''),
          );
        }
      })
      .addCase(DeleteMyPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || 'Xóa bài viết thất bại.';
      });
  },
});

export const {
  clearPostsAndReels,
  clearLikedPosts,
  updateIsFollowPostUser,
  updateLikePostUser,
} = PostUserReducer.actions;
export default PostUserReducer.reducer;
