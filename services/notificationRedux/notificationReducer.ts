import { createSlice } from '@reduxjs/toolkit';
import { Noti } from './notificationTypes';
import { getAllNotification } from './notificationSlices';

interface NotificationState {
  notifications: Noti[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: null,
};

const notificationReducer = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotifications: state => {
      state.notifications = [];
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = null;
    },
    resetNotificationStatus: state => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllNotification.pending, state => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(getAllNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
      })
      .addCase(getAllNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || 'Lỗi không xác định';
      });
  },
});

export const {
  clearNotifications,
  resetNotificationStatus,
} = notificationReducer.actions;

export default notificationReducer.reducer;
