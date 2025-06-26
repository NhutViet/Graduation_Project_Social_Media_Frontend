import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { registerFcmToken } from './fcm';
import useNotificationListener from './NotificationListener';

const NotificationManager = () => {
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user?._id) {
      registerFcmToken(user._id);
    }
  }, [user]);

  useNotificationListener();

  return null;
};

export default NotificationManager;
