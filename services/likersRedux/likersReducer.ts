import { createSlice } from "@reduxjs/toolkit";
import { Likers } from "./likersSlice";
import { Liker } from "./likersType";

interface Likers {
    listLikers: Liker[],
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    errorMessage: string,
};

const initialState: Likers = {
    listLikers: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
};

const LikersReducer = createSlice({
    name: 'likers',
    initialState,
    reducers: {
        resetLikerStatus: () => initialState,
    },
    extraReducers: (builder) => {
        builder
        .addCase(Likers.pending, (state) => {
            state.errorMessage = '';
            state.isError = false;
            state.isLoading = true;
            state.isSuccess = false;
            state.listLikers = [];
        })
        .addCase(Likers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.listLikers = action.payload?.data;
        })
        .addCase(Likers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.errorMessage = action.payload?.message || 'Đã xảy ra lỗi';
        })
    },
});

export const {resetLikerStatus} = LikersReducer.actions;
export default LikersReducer.reducer;