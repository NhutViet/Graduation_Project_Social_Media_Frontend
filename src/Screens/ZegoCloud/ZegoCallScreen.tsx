import React from 'react';
import {ZegoUIKitPrebuiltCall} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {CallAppID, CallAppSign} from '../../../services/api';
import {useNavigation} from '@react-navigation/native';

const ZegoCallScreen = ({route}: any) => {
  const {userID, userName, callID, isVideoCall} = route.params;
  const navigation = useNavigation();

  return (
    <ZegoUIKitPrebuiltCall
      appID={CallAppID}
      appSign={CallAppSign}
      userID={userID}
      userName={userName}
      callID={callID}
      config={{
        turnOnCameraWhenJoining: isVideoCall,
        turnOnMicrophoneWhenJoining: true,
        useSpeakerWhenJoining: true,
        layout: 'GROUP',
        showCameraToggleButton: isVideoCall,
        showMicrophoneToggleButton: true,
        showAudioOutputButton: true,
        showEndCallButton: true,
        onHangUp: () => {
          navigation.goBack();
        },
        onOnlySelfInRoom: () => {
          setTimeout(() => {
            navigation.goBack();
          }, 10000);
        },
        scenario: {
          mode: isVideoCall ? 'VIDEO_CALL' : 'VOICE_CALL',
        },
      }}
    />
  );
};

export default ZegoCallScreen;
