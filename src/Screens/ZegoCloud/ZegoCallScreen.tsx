import React, {useState} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {ZegoUIKitPrebuiltCall} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {CallAppID, CallAppSign} from '../../../services/api';
import {useNavigation} from '@react-navigation/native';
import {useSocket} from '../../../services/SocketContext';

export default function ZegoCallScreen({route}: any) {
  const {userID, userName, callID, image, isCaller} = route.params;
  const navigation = useNavigation();
  const callStartTimeRef = React.useRef<number | null>(null);
  const {socket} = useSocket();
  const [hasOtherUser, setHasOtherUser] = useState(false);
  const [isInitiator, setIsInitiator] = useState(false);

  useEffect(() => {
    callStartTimeRef.current = Date.now();
  }, []);

  const handleCallCancelled = () => {
    const duration =
      callStartTimeRef.current !== null
        ? Math.floor((Date.now() - callStartTimeRef.current) / 1000)
        : 0;

    if (socket && isCaller) {
      socket.emit('callEnded', {
        roomId: callID,
        senderId: userID,
        callType: 'video',
        missed: !hasOtherUser,
        duration: duration,
      });
    }
    navigation.goBack();
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('callCancelled', handleCallCancelled);

    return () => {
      socket.off('callCancelled', handleCallCancelled);
    };
  }, [socket]);

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={CallAppID}
        appSign={CallAppSign}
        userID={userID}
        userName={userName}
        callID={callID}
        config={{
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          useSpeakerWhenJoining: true,
          layout: 'GROUP',
          showCameraToggleButton: true,
          showMicrophoneToggleButton: true,
          showAudioOutputButton: true,
          showEndCallButton: true,
          onUserJoin: (user: any) => {
            if (user.userID !== userID) {
              setHasOtherUser(true);
            }
          },
          onCallEnd: () => {
            handleCallCancelled();
          },
          timingConfig: {
            isDurationVisible: true,
            onDurationUpdate: (duration: number) => {
              if (duration === 10 * 60) {
                navigation.goBack();
              }
            },
          },
          avatarBuilder: ({userInfo}: {userInfo: {userID: string}}) => (
            <View style={{width: '100%', height: '100%'}}>
              <Image
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
                source={{uri: image}}
              />
            </View>
          ),
          scenario: {
            mode: 'VIDEO_CALL',
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
