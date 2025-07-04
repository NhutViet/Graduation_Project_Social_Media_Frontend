import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import IncomingCallModal from '../../../../components/IncomingCallModal';
import {useSocket} from '../../../../services/SocketContext';

interface MessageHeaderProps {
  user1?: any;
  user2?: any;
  room?: any;
  navigation: any;
  handleGoBack: () => void;
  styles: any;
  color: any;
  userC: any;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  user1,
  user2,
  room,
  navigation,
  handleGoBack,
  styles,
  color,
  userC,
}) => {
  const {socket} = useSocket();
  const [incomingCall, setIncomingCall] = useState({
    visible: false,
    callerName: '',
    type: 'video' as 'video' | 'voice',
  });
  const rejectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const buildAvatars = () => {
    const avatars: Record<string, string> = {};
    if (userC?._id && userC?.profilePic) {
      avatars[userC._id] = userC.profilePic;
    }
    if (user1?._id && user1?.profilePic) {
      avatars[user1._id] = user1.profilePic;
    }
    if (user2?._id && user2?.profilePic) {
      avatars[user2._id] = user2.profilePic;
    }
    return avatars;
  };

  const startCall = (type: 'video' | 'voice') => {
    const avatars = buildAvatars();
    socket?.emit('incomingCall', {
      callerName: userC?.username,
      type,
      roomId: room?._id,
    });

    navigation.navigate('ZegoCallScreen', {
      userID: userC?._id,
      userName: userC?.username,
      callID: room?._id,
      avatars,
      callType: type,
      isCaller: true,
    });
  };

  const handleCall = () => startCall('video');
  const handleVoiceCall = () => startCall('voice');

  useEffect(() => {
    if (!socket) return;

    const onIncoming = ({callerName, type}: any) => {
      setIncomingCall({
        visible: true,
        callerName,
        type,
      });
    };

    socket.on('incomingCall', onIncoming);
    return () => {
      socket.off('incomingCall', onIncoming);
    };
  }, [socket]);

  const handleAcceptCall = () => {
    if (rejectTimeoutRef.current) clearTimeout(rejectTimeoutRef.current);
    setIncomingCall(prev => ({...prev, visible: false}));
    const avatars = buildAvatars();

    navigation.navigate('ZegoCallScreen', {
      userID: userC?._id,
      userName: userC?.username,
      callID: room?._id,
      image: userC?.profilePic,
      avatars,
      callType: incomingCall.type,
      isCaller: false,
    });
  };

  const handleRejectCall = () => {
    if (rejectTimeoutRef.current) clearTimeout(rejectTimeoutRef.current);
    if (socket) {
      socket.emit('callCancelled', {
        roomId: room?._id,
        senderId: userC?._id,
      });
    }
    setIncomingCall(prev => ({...prev, visible: false}));
  };

  useEffect(() => {
    if (incomingCall.visible) {
      rejectTimeoutRef.current = setTimeout(() => {
        handleRejectCall();
      }, 10000);
    }

    return () => {
      if (rejectTimeoutRef.current) clearTimeout(rejectTimeoutRef.current);
    };
  }, [incomingCall.visible]);

  return (
    <>
      <View
        style={[styles.header, {backgroundColor: 'rgba(255, 255, 255, 0.6)'}]}>
        <View style={styles.rowContainer2}>
          <TouchableOpacity style={styles.blockIcon} onPress={handleGoBack}>
            <Image
              style={styles.icon}
              source={require('../../../../assets/icon/left.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.imgContainer,
              {
                overflow:
                  user1?.profilePic && !user2?.profilePic
                    ? 'hidden'
                    : undefined,
              },
            ]}
            onPress={() => {
              if (user1?.profilePic && user2?.profilePic) {
                navigation.navigate('InforGroupChat', {
                  roomId: room?._id,
                  img1: user1?.profilePic,
                  img2: user2?.profilePic,
                });
              } else {
                navigation.navigate('InfoUser', {
                  roomId: room?._id,
                  img1: user1?.profilePic,
                  nameChat: user1?.handleName,
                });
              }
            }}>
            {user2?.profilePic && (
              <>
                <Image style={styles.iconW} source={{uri: user1?.profilePic}} />
                <Image
                  style={[
                    styles.iconF,
                    {
                      borderColor: Colors.white,
                      backgroundColor: color.backgroundSecondary,
                    },
                  ]}
                  source={{uri: user2?.profilePic}}
                />
              </>
            )}
            {!user2?.profilePic && user1?.profilePic && (
              <Image style={styles.img} source={{uri: user1?.profilePic}} />
            )}
          </TouchableOpacity>

          <Text style={{color: Colors.black, fontSize: 16}} numberOfLines={1}>
            {room?.name?.trim() || user1?.handleName || 'No name'}
          </Text>
        </View>

        <View style={styles.rowContainer1}>
          <TouchableOpacity style={styles.blockIcon} onPress={handleVoiceCall}>
            <Image
              style={styles.icon}
              source={require('../../../../assets/icon/telephone.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.blockIcon} onPress={handleCall}>
            <Image
              style={styles.icon}
              source={require('../../../../assets/icon/videoCamera.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.blockIcon}>
            <Image
              style={styles.icon}
              source={require('../../../../assets/icon/info.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <IncomingCallModal
        visible={incomingCall.visible}
        callerName={incomingCall.callerName}
        type={incomingCall.type}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </>
  );
};

export default MessageHeader;
