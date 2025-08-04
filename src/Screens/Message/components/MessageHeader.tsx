import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';
import {Colors} from '@assets/color/Colors';
import IncomingCallModal from '../../../../components/IncomingCallModal';
import {useSocket} from '@services/SocketContext';
import {ArrowLeft, Phone, Video, AlertCircle} from 'lucide-react-native';
import {Room, RoomUser} from '@services/roomRedux/roomType';
import {User} from '@services/userRedux/userTypes';
import {useTheme} from '../../../../src/util/ThemeContext';
import CustomPopupModal, {
  CustomPopupModalRef,
} from '../../../../components/Global/CustomPopupModal';

interface MessageHeaderProps {
  user1?: RoomUser;
  user2?: RoomUser;
  room: Room | null;
  navigation: any;
  handleGoBack: () => void;
  userC: User | null;
  showCallFeatures?: boolean;
  bothFollowing?: boolean;
  messages?: any[];
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  user1,
  user2,
  room,
  navigation,
  handleGoBack,
  userC,
  showCallFeatures = false,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const {socket} = useSocket();
  const modalRef = useRef<CustomPopupModalRef>(null);
  const [incomingCall, setIncomingCall] = useState({
    visible: false,
    callerName: '',
    type: 'video' as 'video' | 'voice',
  });
  const rejectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCall = () => {
    if (!room?._id || !userC) return;

    // Add haptic feedback
    Vibration.vibrate(50);

    if (socket) {
      socket.emit('incomingCall', {
        callerName: userC.username,
        type: 'video',
        roomId: room._id,
      });
    }

    navigation.navigate('ZegoCallScreen', {
      userID: userC._id,
      userName: userC.username,
      callID: room._id,
      callType: 'video',
      image: userC.profilePic,
      isCaller: true,
    });
  };

  const handleVoiceCall = () => {
    if (!room?._id || !userC) return;

    // Add haptic feedback
    Vibration.vibrate(50);

    if (socket) {
      socket.emit('incomingCall', {
        callerName: userC.username,
        type: 'voice',
        roomId: room._id,
      });
    }

    navigation.navigate('ZegoCallScreen', {
      userID: userC._id,
      userName: userC.username,
      callID: room._id,
      image: userC.profilePic,
      callType: 'voice',
      isCaller: true,
    });
  };

  useEffect(() => {
    if (!socket) return;

    const onIncoming = ({
      callerName,
      type,
    }: {
      callerName: string;
      type: 'video' | 'voice';
    }) => {
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

  // Show call icons when:
  // 1. showCallFeatures is true (not a waiting room)
  // 2. AND (bothFollowing is false OR messages length > 2)
  const shouldShowCallIcons =
    showCallFeatures && room?.type != 'waiting' && userC;

  return (
    <>
      <View style={styles.header}>
        <View style={styles.rowContainer2}>
          <TouchableOpacity onPress={handleGoBack}>
            <ArrowLeft size={22} color={color.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                gap: 10,
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
                  nameChat: user1?.username,
                  userId: user1?._id,
                });
              }
            }}>
            <View
              style={[
                styles.imgContainer,
                {
                  overflow:
                    user1?.profilePic && !user2?.profilePic
                      ? 'hidden'
                      : undefined,
                },
              ]}>
              {user2?.profilePic && (
                <>
                  <Image
                    style={[styles.iconW, {width: 30, height: 30}]}
                    source={{uri: user1?.profilePic}}
                  />
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
            </View>

            <Text style={{color: color.text, fontSize: 16}} numberOfLines={1}>
              {room?.name?.trim() || user1?.username || 'Không xác định'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowContainer1}>
          {shouldShowCallIcons && (
            <>
              <TouchableOpacity onPress={handleVoiceCall}>
                <Phone size={22} color={color.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCall}>
                <Video size={22} color={color.text} />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={() => modalRef.current?.open()}>
            <AlertCircle size={20} color={color.text} />
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

      <CustomPopupModal
        ref={modalRef}
        title={undefined}
        showCancelButton={true}
        cancelText="Huỷ"
        cancelTextColor="#007AFF"
        onCancel={() => modalRef.current?.close()}>
        <TouchableOpacity
          style={styles.destructiveButton}
          onPress={() => {
            modalRef.current?.close();
          }}>
          <Text style={[styles.destructiveText, {color: '#007AFF'}]}>
            Ẩn đoạn chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.destructiveButton}
          onPress={() => {
            modalRef.current?.close();
          }}>
          <Text style={[styles.destructiveText, {color: '#007AFF'}]}>
            Rời đoạn chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.destructiveButton}
          onPress={() => {
            modalRef.current?.close();
          }}>
          <Text style={[styles.destructiveText, {color: '#FF3B30'}]}>
            Báo cáo đoạn chat
          </Text>
        </TouchableOpacity>
      </CustomPopupModal>
    </>
  );
};

export default MessageHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(243, 244, 246, 0.7)',
  },
  rowContainer2: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgContainer: {
    position: 'relative',
    width: 35,
    height: 35,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconW: {
    width: '75%',
    height: '75%',
    resizeMode: 'cover',
    borderRadius: 25,
    top: 0,
    left: 0,
    position: 'absolute',
  },
  iconF: {
    width: '85%',
    height: '85%',
    resizeMode: 'cover',
    borderRadius: 25,
    zIndex: 1,
    bottom: 0,
    right: 0,
    borderWidth: 2,
    position: 'absolute',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rowContainer1: {
    width: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },
  destructiveButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E5EA',
  },
  destructiveText: {
    fontSize: 18,
    fontWeight: '600',
  },
  callButton: {
    padding: 10,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
});
