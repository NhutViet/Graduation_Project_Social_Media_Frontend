import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useEffect, useMemo, useRef, useState} from 'react';
import MessageStyles from '../../StyleSheet/MessageStyles';
import {io, Socket} from 'socket.io-client';
import {RootStackParamList} from '../../Navigation/AppNavigation';
import LinkPreview from 'react-native-link-preview';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import MessageItemComponent from './components/MessageItemComponent';
import {fetchMessages} from '../../../services/messageRedux/messageSlice';
import {Message} from '../../../services/messageRedux/messageType';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadImageToR2} from '../../core/upload';
import {useUploadProgress} from '../../../services/UploadProgressManager';
import {clearMessages} from '../../../services/messageRedux/messageReducer';
import IncomingCallModal from '../../../components/IncomingCallModal';
import ImagePreviewModal from './components/ImagePreviewModal';
import { BASE_URL } from '../../../services/api';

export const MessageScreen = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = MessageStyles(theme);
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState('');
  const {messages, loading} = useSelector((state: RootState) => state.messages);
  const [chat, setChat] = useState<Message[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const flatListRef = useRef<FlatList>(null);
  const rejectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const route = useRoute<RouteProp<RootStackParamList, 'MessageScreen'>>();
  const roomId = route?.params?.room;
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const room = useMemo(
    () => rooms.find(r => r._id === roomId),
    [rooms, roomId],
  );
  const filteredUsers = room?.user_ids.filter(
    user => user._id !== room.created_by,
  );
  const user1 = filteredUsers ? filteredUsers[0] : undefined;
  const user2 = filteredUsers ? filteredUsers[1] : undefined;

  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [linkPreviews, setLinkPreviews] = useState<{[key: number]: any}>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress();
  const [incomingCall, setIncomingCall] = useState<{
    visible: boolean;
    callerName: string;
    type: 'video' | 'voice';
  }>({
    visible: false,
    callerName: '',
    type: 'video',
  });

  useEffect(() => {
    setChat([]);
    if (room?._id) {
      dispatch(fetchMessages({roomId: room._id}));
    }
  }, []);

  useEffect(() => {
    setChat(messages);
  }, [messages, roomId]);

  useEffect(() => {
    if (!user.user?._id || !roomId) return;

    const newSocket = io(BASE_URL, {
      transports: ['websocket'],
      query: {
        userId: user.user._id,
        roomId: roomId,
      },
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected!');
      newSocket.emit('joinRoom', {roomId: roomId});
    });

    newSocket.on('receiveMessage', data => {
      setChat(prev => [...prev, data]);
    });

    newSocket.on('incomingCall', ({callerName, type}) => {
      setIncomingCall({
        visible: true,
        callerName,
        type,
      });
    });

    newSocket.on('connect_error', err => {
      console.log('❌ Socket connect error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log('🔌 Socket disconnected.');
    };
  }, [room, user.user?._id]);

  useEffect(() => {
    chat.forEach((item, index) => {
      if (!linkPreviews[index] && item.content.match(/https?:\/\/\S+/)) {
        LinkPreview.getPreview(item.content).then(data => {
          setLinkPreviews(prev => ({...prev, [index]: data}));
        });
      }
    });
  }, [chat]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('sendMessage', {
        roomId: roomId,
        content: message,
        senderId: user.user?._id,
      });
      setMessage('');
    }
  };

  const pickImageAndSend = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      const uri = image.uri;

      if (uri && socket) {
        try {
          const imageUrl = await uploadImageToR2(uri, {
            showUploadModal,
            hideUploadModal,
            setProgress,
          });

          socket.emit('sendMessage', {
            roomId: roomId,
            senderId: user.user?._id,
            media: {
              type: 'image',
              url: imageUrl,
            },
          });
        } catch (err) {
          console.error('❌ Upload/send image error:', err);
        }
      }
    }
  };

  const handleGoBack = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setChat([]);
    setMessage('');
    setSelectedImageUri(null);
    setLinkPreviews({});

    dispatch(clearMessages());
    navigation.goBack();
  };

  useEffect(() => {
    if (chat.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  }, [chat]);

  const handleAcceptCall = () => {
    if (rejectTimeoutRef.current) {
      clearTimeout(rejectTimeoutRef.current);
      rejectTimeoutRef.current = null;
    }
    setIncomingCall(prev => ({...prev, visible: false}));
    navigation.navigate('ZegoCallScreen', {
      userID: user.user?._id,
      userName: user.user?.username,
      callID: roomId,
      image: user.user?.profilePic,
    });
  };

  const handleRejectCall = () => {
    if (rejectTimeoutRef.current) {
      clearTimeout(rejectTimeoutRef.current);
      rejectTimeoutRef.current = null;
    }
    if (socket) {
      socket.emit('callEnded', {
        roomId,
        senderId: user.user?._id,
        callType: 'video',
        missed: true,
      });
    }
    setIncomingCall(prev => ({...prev, visible: false}));
  };

  const handleCall = () => {
    if (socket) {
      socket.emit('incomingCall', {
        callerName: user.user?.username,
        type: 'video',
        roomId,
      });
    }
    navigation.navigate('ZegoCallScreen', {
      userID: user.user?._id,
      userName: user.user?.username,
      callID: roomId,
      image: user.user?.profilePic,
    });
  };

  useEffect(() => {
    if (incomingCall.visible) {
      rejectTimeoutRef.current = setTimeout(() => {
        handleRejectCall();
      }, 10000);
    } else {
      if (rejectTimeoutRef.current) {
        clearTimeout(rejectTimeoutRef.current);
        rejectTimeoutRef.current = null;
      }
    }
    return () => {
      if (rejectTimeoutRef.current) {
        clearTimeout(rejectTimeoutRef.current);
      }
    };
  }, [incomingCall.visible]);

  const renderItem = ({item, index}: {item: Message; index: number}) => (
    <MessageItemComponent
      item={item}
      index={index}
      userHandleName={user.user?.handleName ?? ''}
      chat={chat}
      setSelectedImageUri={setSelectedImageUri}
      linkPreviews={linkPreviews}
      styles={styles}
      color={color}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={color.text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {room?.theme && (
        <ImageBackground
          source={{uri: room.theme}}
          style={styles.bg}
          resizeMode="cover"
        />
      )}
      <View
        style={[
          styles.viewDf,
          {
            backgroundColor: room?.theme
              ? 'rgba(0, 0, 0, 0.2)'
              : color.background,
          },
        ]}>
        <View style={{flex: 1}}>
          <View
            style={[
              styles.header,
              {backgroundColor: 'rgba(255, 255, 255, 0.6)'},
            ]}>
            <View style={styles.rowContainer2}>
              <TouchableOpacity style={styles.blockIcon} onPress={handleGoBack}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/icon/left.png')}
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
                    });
                  }
                }}>
                {user2?.profilePic && (
                  <>
                    <Image
                      style={styles.iconW}
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
              </TouchableOpacity>

              <Text
                style={{color: Colors.black, fontSize: 16}}
                numberOfLines={1}>
                {room?.name?.trim() || user1?.handleName || 'No name'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={styles.blockIcon}
                onPress={() => handleCall()}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/icon/videoCamera.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.blockIcon}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/icon/info.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={chat}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 10,
              paddingHorizontal: 10,
              flexGrow: 1,
            }}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({animated: true});
            }}
          />

          <View
            style={[
              styles.inputContainer,
              {backgroundColor: 'rgba(255, 255, 255, 0.6)', zIndex: 20},
            ]}>
            <TouchableOpacity style={styles.blockCamera}>
              <Image
                style={{tintColor: color.text, width: 20, height: 20}}
                source={require('../../../assets/icon/camera.png')}
              />
            </TouchableOpacity>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Soạn tin nhắn..."
              placeholderTextColor={Colors.black}
              style={styles.input}
              multiline={true}
              returnKeyType="default"
              blurOnSubmit={false}
            />
            <>
              {message.trim().length > 0 ? (
                <TouchableOpacity
                  style={styles.blockCamera}
                  onPress={sendMessage}>
                  <Image
                    style={{tintColor: color.text, width: 20, height: 20}}
                    source={require('../../../assets/icon/share.png')}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.rowContainer}>
                  <TouchableOpacity style={styles.blockIcon1}>
                    <Image
                      style={styles.icon}
                      source={require('../../../assets/icon/Microphone.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.blockIcon1}
                    onPress={pickImageAndSend}>
                    <Image
                      style={styles.icon}
                      source={require('../../../assets/icon/Picture.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.blockIcon1}>
                    <Image
                      style={styles.icon}
                      source={require('../../../assets/icon/another.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </>
          </View>
        </View>
      </View>

      <ImagePreviewModal
        visible={!!selectedImageUri}
        imageUri={selectedImageUri}
        onClose={() => setSelectedImageUri(null)}
        backgroundColor={Colors.light.background}
      />
      <IncomingCallModal
        visible={incomingCall.visible}
        callerName={incomingCall.callerName}
        type={incomingCall.type}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </SafeAreaView>
  );
};
