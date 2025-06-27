import {useEffect, useState, useCallback} from 'react';
import {
  checkInitialNotification,
  onMessageListener,
  onNotificationOpenedApp,
} from './notification';

export const useNotificationHandler = (onNavigate: (data: any) => void) => {
  const [modalData, setModalData] = useState<any | null>(null);

  const handleMessage = useCallback((remoteMessage: any) => {
    setModalData({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data,
    });
  }, []);

  const handleNavigate = useCallback(
    (remoteMessage: any) => {
      if (remoteMessage?.data) {
        onNavigate(remoteMessage.data);
      }
    },
    [onNavigate],
  );

  useEffect(() => {
    const unsubscribeOnMessage = onMessageListener(handleMessage);
    const unsubscribeOpenedApp = onNotificationOpenedApp(handleNavigate);
    checkInitialNotification(handleNavigate);

    return () => {
      unsubscribeOnMessage();
      unsubscribeOpenedApp();
    };
  }, [handleMessage, handleNavigate]);

  return {
    modalData,
    clearModal: () => setModalData(null),
  };
};
