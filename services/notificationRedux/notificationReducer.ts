import {createSlice} from '@reduxjs/toolkit';
import {ItemNoti} from './notificationTypes';
import {getNotification} from './notificationSlice';

interface NotificationState {
  notifications: ItemNoti[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    markAllAsRead(state) {
      state.notifications = state.notifications.map(item => ({
        ...item,
        isRead: true,
      }));
    },
    markAsRead(state, action) {
      const notiId = action.payload;
      state.notifications = state.notifications.map(item =>
        item._id === notiId ? {...item, isRead: true} : item,
      );
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    resetStatus(state) {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.errorMessage = null;
    },
    markMyUnreadAsRead(state, action) {
      const currentUserId = action.payload;
      state.notifications = state.notifications.map(noti => {
        const updatedReceiver = noti.receiver.map(r =>
          r.userId === currentUserId && !r.isRead ? {...r, isRead: true} : r,
        );
        return {
          ...noti,
          receiver: updatedReceiver,
          // Cập nhật isRead ở cấp ngoài nếu cần (ví dụ để hiển thị UI gọn hơn)
          isRead:
            updatedReceiver.find(r => r.userId === currentUserId)?.isRead ??
            noti.isRead,
        };
      });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getNotification.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = null;
      })
      .addCase(getNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const newNotis = action.payload.notifications;

        const existingIds = new Set(state.notifications.map(n => n._id));

        const uniqueNewNotis = newNotis.filter(n => !existingIds.has(n._id));

        state.notifications = [...uniqueNewNotis, ...state.notifications].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      })
      .addCase(getNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || 'Đã có lỗi xảy ra khi lấy thông báo.';
      });
  },
});

export const {markAllAsRead, markAsRead, clearNotifications, resetStatus, markMyUnreadAsRead} =
  notificationSlice.actions;

export default notificationSlice.reducer;
