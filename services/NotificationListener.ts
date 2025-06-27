import {useEffect} from 'react';
import {useSocket} from './SocketContext';
import {useNotification} from './NotificationContext';

const useNotificationListener = () => {
  const {notificationSocket} = useSocket();
  const {showNotification} = useNotification();

  useEffect(() => {
    if (!notificationSocket) return console.log('No socket');

    const handleNotification = (payload: any) => {
      showNotification({
        title: 'Thông báo mới',
        body: payload?.caption || 'Bạn có thông báo mới',
        onAction: () => {
          console.log('User tapped the notification!');
        },
      });
    };

    notificationSocket.on('new_notification', handleNotification);
    notificationSocket.on('post_like', handleNotification);
    notificationSocket.on('new_post_like', handleNotification);
    notificationSocket.on('new_comment', handleNotification);

    return () => {
      notificationSocket.off('new_notification', handleNotification);
      notificationSocket.off('post_like', handleNotification);
      notificationSocket.off('new_post_like', handleNotification);
      notificationSocket.off('new_comment', handleNotification);
    };
  }, [notificationSocket, showNotification]);
};

export default useNotificationListener;
