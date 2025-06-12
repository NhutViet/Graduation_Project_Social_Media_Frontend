import { createAsyncThunk } from "@reduxjs/toolkit";
import { ReqSearch, ReqSearchUser, ResSearchPost, ResSearchUser } from "./searchType";
import axiosInstance from "../axiosInstance";
import { API } from "../api";

export const fetchSearchPost = createAsyncThunk<
    ResSearchPost,
    ReqSearch,
    {rejectValue: {message: string}}
>(
    'posts/search',
    async ({refreshToken, keyword}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(API.POST_SEARCH_POST, {keyword}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                }
            });
            return res.data;
        } catch (error: any) {
            return rejectWithValue({message: error?.response?.data?.message || 'Tìm kiếm thất bại.'})
        }
    },
);

export const fetchSearchUser = createAsyncThunk<
    ResSearchUser,
    ReqSearchUser,
    {rejectValue: {message: string}}
>(
    'users/search',
    async ({refreshToken, keyword, mode}, {rejectWithValue}) => {
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
            return rejectWithValue({message: error?.response?.data?.message || 'Tìm kiếm thất bại.'})
        }
    },
);