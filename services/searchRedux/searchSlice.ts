import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from '../store';
import { 
  ReqSearch, 
  ReqSearchUser, 
  ResSearchPost, 
  ResSearchUser, 
  SearchState 
} from "./searchType";
import axiosInstance from "../axiosInstance";
import { API } from "../api";

// Add initial state
const initialState: SearchState = {
  posts: undefined,
  users: undefined,
  isLoading: false,
  isError: false,
  errorMessage: undefined
};

export const fetchSearchPost = createAsyncThunk<
  ResSearchPost,
  ReqSearch,
  { rejectValue: { message: string } }
>(
  'posts/search',
  async ({ refreshToken, keyword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API.POST_SEARCH_POST, { keyword }, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        }
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue({ message: error?.response?.data?.message || 'Tìm kiếm thất bại.' })
    }
  },
);

export const fetchSearchUser = createAsyncThunk<
  ResSearchUser,
  ReqSearchUser,
  { rejectValue: { message: string } }
>(
  'users/search',
  async ({ refreshToken, keyword, mode }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API.POST_SEARCH_USER, {
        keyword, mode
      }, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        }
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue({ message: error?.response?.data?.message || 'Tìm kiếm thất bại.' })
    }
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchSearchPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = undefined;
      })
      .addCase(fetchSearchPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchSearchPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })
      // Fetch Users
      .addCase(fetchSearchUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = undefined;
      })
      .addCase(fetchSearchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchSearchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      });
  }
});

export default searchSlice.reducer;

// Type-safe selector with RootState
export const selectSearchLoading = (state: RootState) => state.search.isLoading;
export const selectSearchError = (state: RootState) => ({
  isError: state.search.isError,
  message: state.search.errorMessage
});