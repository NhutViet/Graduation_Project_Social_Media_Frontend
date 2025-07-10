import {createSlice} from '@reduxjs/toolkit';
import {fetchPostsWithMedia, fetchReelsWithMedia, hidePost} from './postSlice';
import {PostWithMedia} from './postTypes';

interface PostState {
  posts: PostWithMedia[];
  reels: PostWithMedia[];
  loading: boolean;
  error: string | null;
  page: number;
  hasNextPage: boolean;
  totalItemsLoaded: number;
  firstPageItems: PostWithMedia[];
}

const initialState: PostState = {
  posts: [],
  reels: [],
  loading: false,
  error: null,
  page: 1,
  hasNextPage: true,
  totalItemsLoaded: 0,
  firstPageItems: [],
};

const postReducer = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    updateIsFollowByUserId: (state, action) => {
      const {userId, isFollow} = action.payload;

      const updatedPosts = state.posts.map(item =>
        item.userID === userId
          ? {
              ...item,
              isFollow,
            }
          : item,
      );

      state.posts.length = 0;
      state.posts.push(...updatedPosts);

      const updatedReels = state.reels.map(item =>
        item.userID === userId
          ? {
              ...item,
              isFollow,
            }
          : item,
      );

      state.reels.length = 0;
      state.reels.push(...updatedReels);

      const updatedFirstPageItems = state.firstPageItems.map(item =>
        item.userID === userId
          ? {
              ...item,
              isFollow,
            }
          : item,
      );

      state.firstPageItems.length = 0;
      state.firstPageItems.push(...updatedFirstPageItems);
    },
    trimOldReels: (state, action) => {
      const itemsToRemove = action.payload;
      if (state.reels.length > itemsToRemove) {
        // Remove items from the beginning (oldest items)
        state.reels.splice(0, itemsToRemove);
      }
    },

    resetReels: state => {
      state.reels = [];
      state.page = 1;
      state.hasNextPage = true;
      state.totalItemsLoaded = 0;
      state.firstPageItems = [];
      state.error = null;
    },
    incrementCommentCountByPostId: (state, action) => {
      const postId = action.payload;

      const updateCommentCount = (list: PostWithMedia[]) => {
        return list.map(post =>
          post._id === postId
            ? {
                ...post,
                commentCount: (post.commentCount || 0) + 1,
              }
            : post,
        );
      };

      state.posts = updateCommentCount(state.posts);
      state.reels = updateCommentCount(state.reels);
      state.firstPageItems = updateCommentCount(state.firstPageItems);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPostsWithMedia.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsWithMedia.fulfilled, (state, action) => {
        state.loading = false;
        const {items, pagination} = action.payload;
        if (action.meta.arg.page > 1) {
          state.posts.push(...items);
        } else {
          state.posts = items;
        }
        state.page = pagination.currentPage;
        state.hasNextPage = pagination.hasNextPage;
      })
      .addCase(fetchPostsWithMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /// reels
      .addCase(fetchReelsWithMedia.pending, (state, action) => {
        // Only show loading for initial load or if no items exist
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReelsWithMedia.fulfilled, (state, action) => {
        state.loading = false;
        const {items, pagination, isLoadMore} = action.payload;

        if (isLoadMore) {
          const newItems = items.filter(
            i => !state.reels.some(existing => existing._id === i._id)
          );
          state.reels.push(...newItems);
        } else {
          // initial load or pull-to-refresh: replace the entire list
          state.reels = [...items];
          state.firstPageItems = [...items];
        }

        state.page = pagination.currentPage;
        state.hasNextPage = pagination.hasNextPage;
        state.totalItemsLoaded = state.reels.length;

        // Remove old items
        const MAX_ITEMS = 50;
        const ITEMS_TO_REMOVE = 20;

        if (state.reels.length > MAX_ITEMS && pagination.currentPage > 3) {
          state.reels.splice(0, ITEMS_TO_REMOVE);
        }
      })
      .addCase(fetchReelsWithMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(hidePost.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        state.posts = state.posts.filter((post: PostWithMedia) => post._id !== postId);
        state.reels = state.reels.filter((post: PostWithMedia) => post._id !== postId);
      });
  },
});

export const {
  updateIsFollowByUserId,
  trimOldReels,
  resetReels,
  incrementCommentCountByPostId,
} = postReducer.actions;
export default postReducer.reducer;
