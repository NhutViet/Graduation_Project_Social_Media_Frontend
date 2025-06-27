import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

/**
 * Xin quyền nhận thông báo từ người dùng.
 * Trả về true nếu được cấp quyền.
 */
export async function requestUserPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

/**
 * Lấy FCM Token sau khi được cấp quyền.
 */
export async function getFCMToken(): Promise<string | null> {
  const hasPermission = await requestUserPermission();
  if (!hasPermission) return null;

  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('[FCM] Error getting token:', error);
    return null;
  }
}

/**
 * Tạo notification channel cho Android (gọi 1 lần khi app khởi động)
 */
export async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

/**
 * Lắng nghe thông báo khi app đang mở (foreground)
 */
export function onMessageListener(callback: (message: any) => void) {
  return messaging().onMessage(callback);
}

/**
 * Lắng nghe khi người dùng mở app từ background bằng cách bấm vào thông báo
 */
export function onNotificationOpenedApp(callback: (message: any) => void) {
  return messaging().onNotificationOpenedApp(callback);
}

/**
 * Kiểm tra xem app có được mở từ quit state bằng thông báo không
 */
export async function checkInitialNotification(
  callback: (message: any) => void,
) {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    callback(remoteMessage);
  }
}
