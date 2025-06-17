import React from 'react';
import { ZegoUIKitPrebuiltCall } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { CallAppID, CallAppSign } from '../../../services/api';

const ZegoCallScreen = ({ route }: any) => {
  const { userID, userName, callID, isVideoCall } = route.params;

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
        scenario: {
          mode: isVideoCall ? 'VIDEO_CALL' : 'VOICE_CALL',
        },
      }}
    />
  );
};

export default ZegoCallScreen;
