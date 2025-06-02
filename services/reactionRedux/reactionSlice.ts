import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";
import { API } from "../api";
import { ResLikePost } from "./reactionTypes";
import { useSelector } from "react-redux";
import { RootState } from "../store";


export const likePost = createAsyncThunk(
    'reactions/likePost',
    async ({postId, refreshToken} : {postId: string, refreshToken: string}, thunkAPI) => {
        try {
            if(!refreshToken){
                return thunkAPI.rejectWithValue('Mời bạn đăng nhập để tiếp tục yêu thích bài viết');
            }
            const res = await axiosInstance.post(`post-like/${postId}`,{}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                    'Content-Type': 'application/json',
                }
            });
            return { postId };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Yêu thích bài viết thất bại');
        }
    }
);

export const unlikePost = createAsyncThunk(
    'reactions/unlikePost',
    async ({postId, refreshToken} : {postId: string, refreshToken: string}, thunkAPI) => {
        try {
            if(!refreshToken){
                return thunkAPI.rejectWithValue('Mời bạn đăng nhập để tiếp tục');
            }
            const res = await axiosInstance.delete(`post-like/${postId}`, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                }
            });
            return {postId};
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Bỏ yêu thích thất bại!');
        }
    },
);