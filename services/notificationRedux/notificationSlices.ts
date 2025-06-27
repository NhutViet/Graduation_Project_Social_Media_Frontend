import { createAsyncThunk } from "@reduxjs/toolkit";
import { Noti } from "./notificationTypes";
import axiosInstance from "@services/axiosInstance";
import { API } from "@services/api";

export const getAllNotification = createAsyncThunk<
    Noti[],
    {refreshToken: string},
    {rejectValue: {message: string}}
>(
    'notifications/all',
    async ({refreshToken}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(API.GET_ALL_NOTIFICATION, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                }
            });
            return res.data;
        } catch (error: any) {
            return rejectWithValue({message: error?.response?.data?.message || 'Lấy danh sách thông báo thất bại.'});
        }
    },
);