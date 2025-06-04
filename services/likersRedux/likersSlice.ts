import { createAsyncThunk } from "@reduxjs/toolkit";
import { rejectValue, ResLikersAPost } from "./likersType";
import axiosInstance from "../axiosInstance";
import { RootState } from "../store";

export const Likers = createAsyncThunk<
    ResLikersAPost,
    {postId: string, refreshToken: string},
    {rejectValue: rejectValue; state: RootState}
>(
    'post-like/likers',
    async ({postId, refreshToken}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`post-like/likers/${postId}`, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                }
            });
            
            return res.data as ResLikersAPost;
        } catch (error: any) {
            return rejectWithValue({
                status: error?.response?.status || 500,
                message: error?.response?.data?.message || 'Lỗi tải dữ liệu',
            })
        }
    },
);