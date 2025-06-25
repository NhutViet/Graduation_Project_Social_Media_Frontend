import {useEffect, useState} from 'react';
import {
  onMessageListener,
  onNotificationOpenedApp,
  checkInitialNotification,
} from './notification';

export const useNotificationHandler = (onNavigate: (data: any) => void) => {
  const [modalData, setModalData] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribeOnMessage = onMessageListener(remoteMessage => {
      setModalData({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
      });
    });

    const unsubscribeOpenedApp = onNotificationOpenedApp(remoteMessage => {
      onNavigate(remoteMessage.data);
    });

    checkInitialNotification(remoteMessage => {
      onNavigate(remoteMessage.data);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOpenedApp();
    };
  }, []);

  return {modalData, clearModal: () => setModalData(null)};
};
