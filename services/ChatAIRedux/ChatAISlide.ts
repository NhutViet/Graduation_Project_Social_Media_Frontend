import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@services/api";
import axiosInstance from "@services/axiosInstance";
import { ResHistoryChatAI } from "./ChatAITypes";

export const askAI = createAsyncThunk<
    {answer: string},
    {prompt: string},
    {rejectValue: {message: string}}
>(
    'chat/ask',
    async ({prompt}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(API.POST_ASK_AI, {prompt}, {
                headers: {
                    token: 'refresh',
                },
            });

            return res.data;
        } catch (error: any) {
            return rejectWithValue({message: error?.response?.data?.message || 'Không thể trả lời câu hỏi.'});
        }
    },
);

export const getHistoryChatAI = createAsyncThunk<
    ResHistoryChatAI,
    {page: number, limit: number},
    {rejectValue: {message: string}}
>(
    'chat-box/history',
    async ({page, limit}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(API.GET_HISTORY_CHAT_AI, {
                params: {page, limit},
                headers: {
                    token: 'refresh',
                },
            });

            return res.data;
        } catch (error: any) {
            return rejectWithValue({message: error?.response?.data?.message || 'Lấy lịch sử chat thất bại.'});
        }
    },
);