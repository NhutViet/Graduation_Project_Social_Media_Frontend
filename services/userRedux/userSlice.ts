import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./userTypes";
import axiosInstance from "../axiosInstance";
import { API } from "../api";

export const fetchLogin = createAsyncThunk<User, {email: string, password: string}, {rejectValue: {message: string}}>(
    'auth/login',
    async({email, password}: any, {rejectWithValue}) => {
        try {
            const LoginRes = await axiosInstance.post(API.GET_lOGIN_POST, {email, password});

            //login res khong loi thi tra ve
            const userRes = await axiosInstance.get<User>(API.GET_ME);
            return userRes.data; 
        } catch (error: any) {
            return rejectWithValue({message: error.response?.data?.message || 'Login failed'});
        }
    },
);

export const fetchRefresh = createAsyncThunk<{success: boolean}, void, {rejectValue: {message: string}}>(
    'auth/refresh',
    async(_, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(API.POST_REFRESH);
            return res.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Refresh failed!!!';
            return rejectWithValue({message});
        }
    },
);

export const fetchLogout = createAsyncThunk<{success: string}, void, {rejectValue: {message: string}}>(
    'auth/logout',
    async(_, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(API.POST_LOGOUT);
            return res.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Logout failed!!!';
            return rejectWithValue({message});
        }
    },
);