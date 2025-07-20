import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import { API } from '../api';
import {
  CreateReportUserDto,
  ReportUser,
} from './reportUserTypes';

export const fetchReportUser = createAsyncThunk<
  ReportUser,
  CreateReportUserDto,
  { rejectValue: { message: string } }
>(
  'report/reportUser',
  async (dto, { rejectWithValue, getState }) => {
    try {
      const res = await axiosInstance.post<ReportUser>(
        API.REPORT_USER,
        dto,
        { headers: { token: 'refresh' } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue({
        message: err.response?.data?.message || 'Báo cáo thất bại',
      });
    }
  }
);