import React, {createContext, useContext, useState, ReactNode} from 'react';

interface NotificationData {
  visible: boolean;
  title: string;
  body: string;
  onAction?: () => void;
}

interface NotificationContextProps {
  showNotification: (data: Omit<NotificationData, 'visible'>) => void;
  hideNotification: () => void;
  notification: NotificationData;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

export const NotificationProvider = ({children}: {children: ReactNode}) => {
  const [notification, setNotification] = useState<NotificationData>({
    visible: false,
    title: '',
    body: '',
  });

  const showNotification = (data: Omit<NotificationData, 'visible'>) => {
    setNotification({visible: true, ...data});
  };

  const hideNotification = () => {
    setNotification(prev => ({...prev, visible: false}));
  };

  return (
    <NotificationContext.Provider
      value={{notification, showNotification, hideNotification}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
