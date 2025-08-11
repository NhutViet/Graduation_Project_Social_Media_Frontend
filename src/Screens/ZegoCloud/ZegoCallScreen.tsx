import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Alert} from 'react-native';
import {ZegoUIKitPrebuiltCall} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {CallAppID, CallAppSign} from '../../../services/api';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSocket} from '../../../services/SocketContext';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {RootStackParamList} from 'src/Navigation/AppNavigation';
import type {RouteProp} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../services/store';
import RNCallKeep from 'react-native-callkeep';

export default function ZegoCallScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ZegoCallScreens'>>();
  const {userID, userName, callID, image, isCaller, callType, answeredViaCallKeep, callUUID, roomId} = route.params;

  const navigation = useNavigation();
  const {socket, globalSocket} = useSocket();
  const user = useSelector((state: RootState) => state.user.user);
  const [callEnded, setCallEnded] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState(isCaller ? 'calling' : 'connecting');

  // handle CallKeep answered calls
  useEffect(() => {
    if (answeredViaCallKeep && user?._id) {
      console.log('[ZegoCallScreen] Call was answered via CallKeep, notifying caller...');
      
      const socketToUse = globalSocket || socket;
      if (socketToUse) {
        // Emit that the call was answered
        socketToUse.emit('callAnswered', {
          roomId: roomId || callID,
          calleeId: user._id,
          callerId: userID,
        });

        // Join the call room for WebSocket communication
        socketToUse.emit('joinCall', {
          roomId: roomId || callID,
          userId: user._id,
          callType: callType || 'video',
        });

        console.log('[ZegoCallScreen] Sent callAnswered and joinCall events');
      }

      // Clean up CallKeep 
      if (callUUID) {
        setTimeout(() => {
          RNCallKeep.endCall(callUUID);
        }, 1000);
      }

      setCallStatus('connected');
    }
  }, [answeredViaCallKeep, user?._id, globalSocket, socket]);

  // Listen for call events
  useEffect(() => {
    const socketToUse = globalSocket || socket;
    if (!socketToUse) return;

    const handleCallAnswered = (data: any) => {
      console.log('[ZegoCallScreen] Call was answered:', data);
      if (isCaller && data.callerId === user?._id) {
        setCallStatus('connected');
        console.log('[ZegoCallScreen] Caller notified that call was answered');
      }
    };

    const handleCallDeclined = (data: any) => {
      console.log('[ZegoCallScreen] Call was declined:', data);
      if (isCaller && data.callerId === user?._id) {
        Alert.alert('Cuộc gọi bị từ chối', 'Người dùng đã từ chối cuộc gọi', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    };

    const handleUserJoinedCall = (data: any) => {
      console.log('[ZegoCallScreen] User joined call:', data);
      setCallStatus('connected');
    };

    const handleUserLeftCall = (data: any) => {
      console.log('[ZegoCallScreen] User left call:', data);
      if (data.userId !== user?._id) {
        handleCallCancelled();
      }
    };

    socketToUse.on('callAnswered', handleCallAnswered);
    socketToUse.on('callDeclined', handleCallDeclined);
    socketToUse.on('userJoinedCall', handleUserJoinedCall);
    socketToUse.on('userLeftCall', handleUserLeftCall);

    return () => {
      socketToUse.off('callAnswered', handleCallAnswered);
      socketToUse.off('callDeclined', handleCallDeclined);
      socketToUse.off('userJoinedCall', handleUserJoinedCall);
      socketToUse.off('userLeftCall', handleUserLeftCall);
    };
  }, [globalSocket, socket, isCaller, user?._id]);

  const handleCallCancelled = () => {
    if (callEnded) return;
    setCallEnded(true);

    const socketToUse = globalSocket || socket;
    if (socketToUse && user?._id) {
      // Emit that user is leaving the call
      socketToUse.emit('leaveCall', {
        roomId: roomId || callID,
        userId: user._id,
        reason: 'user_ended',
      });

      socketToUse.emit('callEnded', {
        roomId: roomId || callID,
        senderId: user._id,
        missed: false,
        duration: callDuration,
      });
    }

    navigation.goBack();
  };

  useEffect(() => {
    const socketToUse = globalSocket || socket;
    if (!socketToUse) return;

    socketToUse.on('callCancelled', handleCallCancelled);
    return () => {
      socketToUse.off('callCancelled', handleCallCancelled);
    };
  }, [globalSocket, socket]);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - start) / 1000);
      setCallDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={CallAppID}
        appSign={CallAppSign}
        userID={user?._id || userID}
        userName={user?.username || userName}
        callID={callID}
        config={{
          turnOnCameraWhenJoining: callType === 'video',
          turnOnMicrophoneWhenJoining: true,
          useSpeakerWhenJoining: true,
          layout: 'GROUP',
          showCameraToggleButton: callType === 'video',
          showMicrophoneToggleButton: true,
          showAudioOutputButton: true,
          showEndCallButton: true,
          onCallEnd: () => {
            handleCallCancelled();
          },
          timingConfig: {
            isDurationVisible: true,
            onDurationUpdate: (duration: number) => {
              if (duration === 9 * 60 + 30) {
                GlobalAlertManager.show(
                  'Thông báo',
                  'Cuộc gọi sẽ tự động kết thúc sau 30 giây',
                );
              }
              if (duration === 10 * 60) {
                handleCallCancelled();
              }
            },
          },
          avatarBuilder: ({userInfo}: {userInfo: {userID: string}}) => (
            <View style={{width: '100%', height: '100%'}}>
              <Image
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
                source={{
                  uri: image || 'https://i.pinimg.com/736x/09/80/62/098062ede8791dc791c3110250d2a413.jpg',
                }}
              />
            </View>
          ),
          scenario: {
            mode: callType === 'voice' ? 'VOICE_CALL' : 'VIDEO_CALL',
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
