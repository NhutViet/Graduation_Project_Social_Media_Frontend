import {createAsyncThunk} from '@reduxjs/toolkit';
import {ItemNoti, ResNoti} from './notificationTypes';
import axiosInstance from '@services/axiosInstance';
import {API} from '@services/api';

export const getNotification = createAsyncThunk<
  ResNoti,
  {},
  {rejectValue: {message: string}}
>('notifications', async (_, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get(API.GET_NOTIFICATIONS, {
      headers: {
        token: 'refresh',
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message:
        error?.response?.data?.message || 'Lấy danh sách thông báo thất bại.',
    });
  }
});

export const getUnreadNotificationCount = (notifications: ItemNoti[], userId: string): number => {
  return notifications.reduce((count, noti) => {
    const receiver = noti.receiver.find(r => r.userId === userId);
    return receiver && !receiver.isRead ? count + 1 : count;
  }, 0);
};

