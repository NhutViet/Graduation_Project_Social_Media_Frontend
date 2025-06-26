import { getMessaging, getToken } from '@react-native-firebase/messaging';
import axiosInstance from './axiosInstance';
import { API } from './api';

export const registerFcmToken = async (userId: string) => {
  try {
    const messaging = getMessaging();
    const fcmToken = await getToken(messaging);

    console.log('📱 FCM token:', fcmToken);

    await axiosInstance.post(API.POST_FCM_TOKEN, {
      userId,
      fcmToken,
    });
  } catch (error: any) {
    console.log('❌ Gửi FCM token lỗi: ', error);
  }
};
