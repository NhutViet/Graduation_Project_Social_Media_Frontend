import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "@services/api";
import axiosInstance from "@services/axiosInstance";
import { Pagination, PostWithMedia } from "@services/postRedux/postTypes";

export interface SearchPostState {
  items: PostWithMedia[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  isLoadMore: boolean;
}

const initialState: SearchPostState = {
  items: [],
  pagination: null,
  isLoading: false,
  error: null,
  isLoadMore: false,
};

// 🔍 Async thunk to fetch search posts
export const fetchMedia = createAsyncThunk<
  {items: PostWithMedia[]; pagination: Pagination; isLoadMore: boolean},
  {page: number; limit?: number},
  {rejectValue: any}
>(
  'searchPost/fetch',
  async ({page, limit = 15}, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(API.GET_ALL_POST, {
        params: {page, limit},
        headers: {token: 'refresh'},
      });

      return {
        items: data.items,
        pagination: data.pagination,
        isLoadMore: page > 1,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// Slice
const searchPostSlice = createSlice({
  name: 'searchPost',
  initialState,
  reducers: {
    clearSearchPost: state => {
      state.items = [];
      state.pagination = null;
      state.isLoading = false;
      state.error = null;
      state.isLoadMore = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMedia.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pagination = action.payload.pagination;
        state.isLoadMore = action.payload.isLoadMore;
        if (action.payload.isLoadMore) {
          state.items = [...state.items, ...action.payload.items];
        } else {
          state.items = action.payload.items;
        }
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Lỗi khi tìm kiếm bài viết.';
      });
  },
});

export const {clearSearchPost} = searchPostSlice.actions;
export default searchPostSlice.reducer;
