import {useEffect} from 'react';
import {useSocket} from './SocketContext';

const useNotificationListener = () => {
  const {notificationSocket} = useSocket();

  useEffect(() => {
    if (!notificationSocket) return;

    const handleNotification = (payload: any) => {
      console.log('📩 New notification received:', payload);
      // 👉 có thể dispatch Redux, hiện toast, thêm vào state, v.v.
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
