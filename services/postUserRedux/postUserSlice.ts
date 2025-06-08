import { createAsyncThunk } from "@reduxjs/toolkit";
import { ReqGetPosts, ResGetPost, ResGetReels } from "./postUserType";
import axiosInstance from "../axiosInstance";
import { API } from "../api";

export const getPostsOfUser = createAsyncThunk<
    ResGetPost,
    ReqGetPosts,
    {rejectValue: {message: string}}
>(
    'posts/user/getPost',
    async ({type = 'posts', page = 2, limit = 10, refreshToken}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(API.GET_POST, {
                params: {
                    type, page, limit
                },
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                },
            });
            return res.data;
        } catch (error: any) {
            return rejectWithValue({message: error?.response?.data?.message || 'Lấy bài post thất bại'});
        }
    },
);

export const getReelsOfUser = createAsyncThunk<
    ResGetReels,
    ReqGetPosts,
    {rejectValue: {message: string}}
>(
    'posts/user/getReels',
    async ({type = 'reels', page = 1, limit = 15, refreshToken}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(API.GET_POST, {
                params: {
                    type, page, limit
                },
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                },
            });
            return res.data;
        } catch (error: any) {
            return rejectWithValue({message: error?.response?.data?.message || 'Lấy bài post thất bại'});
        }
    },
);