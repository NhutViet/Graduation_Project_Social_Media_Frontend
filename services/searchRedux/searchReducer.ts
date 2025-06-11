import { createSlice } from "@reduxjs/toolkit";
import { Post, UserR } from "./searchType";
import { fetchSearchPost, fetchSearchUser } from "./searchSlice";

interface Search {
    posts: Post | {};
    reels: Post | {};
    users: UserR | {};
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    errorMessage: string;
}

const initialState: Search = {
    posts: {},
    reels: {},
    users: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
};

const SearchReducer = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(fetchSearchPost.pending, (state) => {
            state.errorMessage = '';
            state.isError = false;
            state.isLoading = true;
            state.isSuccess = false;
        })
        .addCase(fetchSearchPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.posts = action.payload.posts;
            state.reels = action.payload.reels;
        })
        .addCase(fetchSearchPost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.errorMessage = action.error.message || 'Tìm kiếm thất bại';
        })
        .addCase(fetchSearchUser.pending, (state) => {
            state.errorMessage = '';
            state.isError = false;
            state.isLoading = true;
            state.isSuccess = false;
        })
        .addCase(fetchSearchUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.users = action.payload.users;
        })
        .addCase(fetchSearchUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.errorMessage = action.error.message || 'Tìm kiếm thất bại';
        })
    },
});

export default SearchReducer.reducer;