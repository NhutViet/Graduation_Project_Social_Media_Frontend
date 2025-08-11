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
import {Linking} from 'react-native';
import {navigateFromUrl} from './core/deeplinkHandler';
import RNCallKeep from 'react-native-callkeep';
import { setupCallKeep } from '@services/CallKeepService';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      case 'incoming_call':
      case 'call':
        navigationRef.navigate('ZegoCallScreen', {
          callID: data.callId || data.roomId,
          userID: data.userId,
          userName: data.userName,
          image: data.image,
          isCaller: false,
          callType: data.callType || 'video',
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

  useEffect(() => {
    const sub = Linking.addEventListener('url', ({url}) => {
      if (url) {
        const stripped = url
          .replace('cirla://', '')
          .replace('https://cirla.io.vn/', '');
        navigateFromUrl(stripped);
      }
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    const initializeCallKeep = async () => {
      try {
        await setupCallKeep();
      } catch (err) {
        console.error('[App] CallKeep initialization failed:', err);
      }
    };

    initializeCallKeep();

    const onAnswer = async ({ callUUID }: { callUUID: string }) => {
      console.log(`[CallKeep] Answer call: ${callUUID}`);
      try {
        const raw = await AsyncStorage.getItem(`incoming_call:${callUUID}`);
        
        if (!raw || raw === 'undefined') {
          console.log('[CallKeep] No valid call data found, ending call');
          RNCallKeep.endCall(callUUID);
          return;
        }

        let data;
        try {
          data = JSON.parse(raw);
        } catch (parseErr) {
          console.error('[CallKeep] Failed to parse call data:', parseErr);
          RNCallKeep.endCall(callUUID);
          return;
        }

        console.log('[CallKeep] Retrieved call data:', data);

        if (!data || !data.callId) {
          console.log('[CallKeep] Invalid call data, ending call');
          RNCallKeep.endCall(callUUID);
          return;
        }

        // Navigate to call screen with CallKeep flags
        const navigateToCall = () => {
          if (navigationRef.isReady()) {
            console.log('[CallKeep] Navigating to ZegoCallScreen...');
            
            navigationRef.navigate('ZegoCallScreen', {
              userID: data.userId || 'unknown',
              userName: data.userName || 'Unknown',
              callID: data.callId,
              image: data.image,
              isCaller: false,
              callType: data.callType || 'video',
              answeredViaCallKeep: true, // Answered via CallKeep
              callUUID: callUUID,
              roomId: data.roomId || data.callId,
            });
          } else {
            console.log('[CallKeep] Navigation not ready, retrying...');
            setTimeout(navigateToCall, 100);
          }
        };

        setTimeout(navigateToCall, 300);
        await AsyncStorage.removeItem(`incoming_call:${callUUID}`);
      } catch (err) {
        console.error('[CallKeep] answer handler error', err);
        RNCallKeep.endCall(callUUID);
      }
    };

    const onEnd = async ({ callUUID }: { callUUID: string }) => {
      console.log(`[CallKeep] End call: ${callUUID}`);
      try {
        // Get call data before cleanup
        const raw = await AsyncStorage.getItem(`incoming_call:${callUUID}`);
        if (raw && raw !== 'undefined') {
          try {
            const data = JSON.parse(raw);
            
            // Use global socket to emit call declined
            console.log('[CallKeep] Call was declined/ended via CallKeep for room:', data.roomId);
          } catch (parseErr) {
            console.error('[CallKeep] Failed to parse call data for decline notification:', parseErr);
          }
        }
        
        await AsyncStorage.removeItem(`incoming_call:${callUUID}`);
      } catch (err) {
        console.error('[CallKeep] Error cleaning up call data:', err);
      }
    };

    // Event listeners
    const answerSubscription = RNCallKeep.addEventListener('answerCall', onAnswer);
    const endSubscription = RNCallKeep.addEventListener('endCall', onEnd);

    return () => {
      answerSubscription?.remove?.();
      endSubscription?.remove?.();
    };
  }, []);

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
                case 'incoming_call':
                case 'call':
                  navigationRef.navigate('ZegoCallScreen', {
                    callID: modalData.data.callId || modalData.data.roomId,
                    userID: modalData.data.userId,
                    userName: modalData.data.userName,
                    image: modalData.data.image,
                    isCaller: false,
                    callType: modalData.data.callType || 'video',
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