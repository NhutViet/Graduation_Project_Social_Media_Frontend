import React, {useEffect} from 'react';
import AppNavigator from './Navigation/AppNavigation';
import Toast from 'react-native-toast-message';
import {
  GlobalAlert,
  GlobalAlertManager,
  GlobalAlertRef,
} from '../components/Global/AlertModal';
import NotificationModal from '@services/notification/NotificationModal';
import {createNotificationChannel} from '@services/notification/notification';
import {useNotificationHandler} from '@services/notification/useNotification';
import {navigationRef} from './NavigationService';

const AppContent = () => {
  useEffect(() => {
    createNotificationChannel();
  }, []);

  const {modalData, clearModal} = useNotificationHandler(data => {
    if (!navigationRef.isReady()) return;

    switch (data?.type) {
      case 'comment':
        if (data?.postId) {
          navigationRef.navigate('PostDetailScreen', {
            postId: data?.postId,
            commentId: data?.commentId,
          });
        }
        break;
      case 'like':
      case 'post':
        if (data?.postId) {
          navigationRef.navigate('PostDetailScreen', {
            postId: data?.postId,
          });
        }
        break;
      case 'follow':
        navigationRef.navigate('ProfileComp', {
          userID: data?.userId,
        });
        break;
      case 'call':
        navigationRef.navigate('ZegoCallScreen', {
          callID: data.callId,
          userID: data.userId,
          userName: data.userName,
          image: data.image,
          isCaller: false,
        });
        break;
      case 'message':
        navigationRef.navigate('MessageScreen', {
          room: data?.roomId,
          isWaiting: data?.isWaiting,
        });
        break;
      default:
        break;
    }
  });

  const handleAlertRef = (ref: GlobalAlertRef | null) => {
    if (ref) {
      GlobalAlertManager.setAlertRef(ref);
    }
  };

  return (
    <>
      <AppNavigator />
      <Toast />
      {modalData && (
        <NotificationModal
          visible={true}
          title={modalData.title}
          body={modalData.body}
          onClose={clearModal}
          onAction={() => {
            clearModal();
            if (modalData.data) {
              switch (modalData.data.type) {
                case 'comment':
                  if (modalData.data?.postId) {
                    navigationRef.navigate('PostDetailScreen', {
                      postId: modalData.data?.postId,
                      commentId: modalData.data?.commentId,
                    });
                  }
                  break;
                case 'like':
                case 'post':
                  if (modalData.data?.postId) {
                    navigationRef.navigate('PostDetailScreen', {
                      postId: modalData.data?.postId,
                    });
                  }
                  break;
                case 'follow':
                  navigationRef.navigate('ProfileComp', {
                    userID: modalData.data?.userId,
                  });
                  break;
                case 'call':
                  navigationRef.navigate('ZegoCallScreen', {
                    callID: modalData.data.callId,
                    userID: modalData.data.userId,
                    userName: modalData.data.userName,
                    image: modalData.data.image,
                    isCaller: false,
                  });
                  break;
                case 'message':
                  navigationRef.navigate('MessageScreen', {
                    room: modalData.data.roomId,
                    isWaiting: modalData.data?.isWaiting,
                  });
                  break;
                default:
                  break;
              }
            }
          }}
        />
      )}
      <GlobalAlert ref={handleAlertRef} />
    </>
  );
};

export default AppContent;
