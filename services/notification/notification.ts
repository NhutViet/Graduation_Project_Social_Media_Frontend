import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function getFCMToken(): Promise<string | null> {
  const enabled = await requestUserPermission();
  if (!enabled) return null;

  try {
    const token = await messaging().getToken();
    return token;
  } catch (err) {
    console.error('FCM Token Error', err);
    return null;
  }
}

export function onMessageListener(cb: (message: any) => void) {
  return messaging().onMessage(cb);
}

export function onNotificationOpenedApp(cb: (message: any) => void) {
  return messaging().onNotificationOpenedApp(cb);
}

export async function checkInitialNotification(cb: (message: any) => void) {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) cb(remoteMessage);
}