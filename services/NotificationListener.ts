import {useEffect} from 'react';
import {useSocket} from './SocketContext';
import Toast from 'react-native-toast-message';

const useNotificationListener = () => {
  const {notificationSocket} = useSocket();

  useEffect(() => {
    if (!notificationSocket) return;

    const handleNotification = (payload: any) => {
      Toast.show({
        type: 'info',
        text1: 'Thông báo mới.',
        text2: payload?.content || 'Bạn có thông báo mới',
        position: 'top',
        visibilityTime: 2000,
      });
    };

    // Lắng nghe các sự kiện từ server
    notificationSocket.on('new_notification', handleNotification);

    // Tuỳ loại
    notificationSocket.on('new_post', handleNotification);
    notificationSocket.on('new_like', handleNotification);
    notificationSocket.on('new_comment', handleNotification);

    return () => {
      // Cleanup để tránh double lắng nghe
      notificationSocket.off('new_notification', handleNotification);
      notificationSocket.off('new_post', handleNotification);
      notificationSocket.off('new_like', handleNotification);
      notificationSocket.off('new_comment', handleNotification);
    };
  }, [notificationSocket]);
};

export default useNotificationListener;
