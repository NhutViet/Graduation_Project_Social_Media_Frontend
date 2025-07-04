import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {Colors} from '@assets/color/Colors';
import IncomingCallModal from '../../../../components/IncomingCallModal';
import {useSocket} from '@services/SocketContext';

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

  const handleCall = () => {
    if (socket) {
      socket.emit('incomingCall', {
        callerName: userC?.username,
        type: 'video',
        roomId: room?._id,
      });
    }

    navigation.navigate('ZegoCallScreen', {
      userID: userC?._id,
      userName: userC?.username,
      callID: room?._id,
      callType: 'video',
      image: userC?.profilePic,
      isCaller: true,
    });
  };

  const handleVoiceCall = () => {
    if (socket) {
      socket.emit('incomingCall', {
        callerName: userC?.username,
        type: 'voice',
        roomId: room?._id,
      });
    }

    navigation.navigate('ZegoCallScreen', {
      userID: userC?._id,
      userName: userC?.username,
      callID: room?._id,
      image: userC?.profilePic,
      callType: 'voice',
      isCaller: true,
    });
  };

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

    navigation.navigate('ZegoCallScreen', {
      userID: userC?._id,
      userName: userC?.username,
      callID: room?._id,
      image: userC?.profilePic,
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
        style={[styles.header, {backgroundColor:  'rgba(120, 120, 120, 0)'}]}>
        <View style={styles.rowContainer2}>
          <TouchableOpacity style={styles.blockIcon} onPress={handleGoBack}>
            <Image
              style={[styles.icon, {tintColor: color.text}]}
              source={require('@assets/icon/left.png')}
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
                <Image style={[styles.iconW, {width: 30, height: 30}]} source={{uri: user1?.profilePic}} />
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

          <Text style={{color: color.text, fontSize: 16}} numberOfLines={1}>
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
              style={[styles.icon, {tintColor: color.text}]}
              source={require('@assets/icon/videoCamera.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.blockIcon}>
            <Image
              style={[styles.icon, {tintColor: color.text}]}
              source={require('@assets/icon/info.png')}
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
