import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { fetchReportUser } from './reportUserSlice';
import { ReportUser } from './reportUserTypes';

interface ReportState {
  report?: ReportUser;
  list: ReportUser[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  reportedUsers: string[];
}

const initialState: ReportState = {
  report: undefined,
  list: [],
  pagination: {
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
  isLoading: false,
  isError: false,
  errorMessage: '',
  reportedUsers: []
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    resetReportState: state => {
      state.report = undefined;
      state.list = [];
      state.pagination = initialState.pagination;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = '';
    },
    clearReportedUser: (state, action: PayloadAction<{ userId: string }>) => {
      state.reportedUsers = state.reportedUsers.filter(
        id => id !== action.payload.userId
      );
    },
  },
  extraReducers: builder => {
    // fetchReportUser
    builder
      .addCase(fetchReportUser.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchReportUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.report = payload;
        const { targetId } = payload;
        if (!state.reportedUsers.includes(targetId)) {
          state.reportedUsers.push(targetId);
        }
      })
      .addCase(fetchReportUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = payload?.message || 'Error';
      });
  },
});

export const { resetReportState, clearReportedUser } = reportSlice.actions;
export default reportSlice.reducer;