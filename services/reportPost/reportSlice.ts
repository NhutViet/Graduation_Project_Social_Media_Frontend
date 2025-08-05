import { createAsyncThunk } from "@reduxjs/toolkit";
import { ReqReportPost } from "./reportTypes";
import axiosInstance from "@services/axiosInstance";
import { API } from "@services/api";

export const reportPost = createAsyncThunk<
    any,
    ReqReportPost,
    {rejectValue: {message: string}}
>(
    'report/post',
    async ({targetId, reason, description}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(API.POSR_REPORT_POST, {targetId, reason, description}, {
                headers: {
                    token: 'refresh',
                },
            });

            return res.data;
        } catch (error: any) {
            return rejectWithValue({message: error?.response?.data?.message || 'Có lỗi xảy ra khi báo cáo.'});
        }
    },
);