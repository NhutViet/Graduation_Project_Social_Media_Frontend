import { createAsyncThunk } from "@reduxjs/toolkit";
import { ReqGetPosts, ResGetPost, ResGetPostsAndReels, ResGetReels, ReqGetLikedPosts, ResGetLikedPosts } from "./postUserType";
import axiosInstance from "../axiosInstance";
import { API } from "../api";

export const getPostsOfUser = createAsyncThunk<
  ResGetPost,
  ReqGetPosts,
  {rejectValue: {message: string}}
>(
  'posts/user/getPost',
  async (
    {type = 'posts', page = 1, limit = 10, refreshToken},
    {rejectWithValue},
  ) => {
    try {
      const res = await axiosInstance.get(API.GET_POST, {
        params: {
          type,
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.response?.data?.message || 'Lấy bài post thất bại',
      });
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

export const getPostsAndReelsOfUser = createAsyncThunk<
    ResGetPostsAndReels,
    ReqGetPosts,
    {rejectValue: {message: string}}
>(
    'posts/user/all',
    async ({refreshToken, userId}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/posts/user/${userId}/all`, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                },
            });
            return res.data;
        } catch (error: any) {
            return rejectWithValue({message: error?.response?.data?.message || 'Lấy bài viết và thước phim thất bại.'});
        }
    },
);

export const getLikedPosts = createAsyncThunk<
  ResGetLikedPosts,
  ReqGetLikedPosts,
  { rejectValue: { message: string } }
>(
  'posts/user/getLikedPosts',
  async ({ page = 1, limit = 20, timeRange, sortOrder, refreshToken }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API.GET_LIKED_POSTS, {
        params: { page, limit, timeRange, sortOrder },
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      return res.data as ResGetLikedPosts;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.response?.data?.message || 'Lấy bài đã thích thất bại',
      });
    }
  }
);

export const DeleteMyPost = createAsyncThunk<
  {modifiedCount: number},
  {postIds: string[]},
  {rejectValue: {message: string}}
>(
  'posts/delete',
  async ({postIds}, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(API.DELETE_MY_POST, {postIds}, {
        headers: {
          token: 'refresh',
        },
      });
      return res.data; 
    } catch (error: any) {
      return rejectWithValue({message: error?.response?.data?.message || 'Xóa bài viết thất bại.'})
    }
  }
);