import React from 'react';
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useEffect, useRef, useState, useCallback} from 'react';
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
import ImagePreviewModal from './components/ImagePreviewModal';
import {useSocket} from '../../../services/SocketContext';
import ActionModalMessage from './components/ActionModalMessage';
import MessageInput from './components/MessageInput';
import MessageHeader from './components/MessageHeader';

import {getRoomById} from '../../../services/roomRedux/roomSlice';
import {Room} from '../../../services/roomRedux/roomType';
import {
  getRelationShip as fetchRelation,
  updatedRoomStatus,
} from './utils/helpers';
import {fetchMyRooms, fetchMyWaitingRooms} from '@services/roomRedux/roomSlice';
import LoadingModal from '../../../components/Global/LoadingModal';

export const MessageScreen = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [linkPreviews, setLinkPreviews] = useState<{[key: number]: any}>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState<Message>();
  const [relationStatus, setRelationStatus] = useState<boolean>(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  const flatListRef = useRef<FlatList>(null);

  const route = useRoute<RouteProp<RootStackParamList, 'MessageScreen'>>();
  const {
    room: roomId,
    highlightMessageId,
    scrollToIndex,
  } = route?.params || {};
  const userC = useSelector((state: RootState) => state.user.user);
  const {messages, loading} = useSelector((state: RootState) => state.messages);
  const acceptedRooms = useSelector((state: RootState) => state.rooms.rooms);
  const waitingRooms = useSelector(
    (state: RootState) => state.rooms.waitingRooms,
  );

  const [originalRoom, setOriginalRoom] = useState<Room | null>(null);

  const roomFromList =
    acceptedRooms.find(r => r._id === roomId) ||
    waitingRooms.find(r => r._id === roomId);

  const fetchRoomDetail = async (roomId: string) => {
    try {
      const res = await dispatch(getRoomById(roomId)).unwrap();
      setOriginalRoom(res);
    } catch (err) {
      console.error('❌ Lỗi khi fetch room:', err);
    }
  };

  useEffect(() => {
    if (roomFromList) {
      setOriginalRoom(roomFromList);
    } else if (roomId && !originalRoom) {
      fetchRoomDetail(roomId);
    }
  }, [roomFromList, roomId]);

  const rooms = originalRoom;

  const filteredUsers = rooms?.user_ids.filter(user => user._id !== userC?._id);
  const roomMember1 = filteredUsers?.[0];
  const roomMember2 = filteredUsers?.[1];
  const isMeSender = rooms?.created_by === userC?._id;

  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress();
  const {socket, connectToSocket, disconnectSocket} = useSocket();

  useEffect(() => {
    const checkRelation = async () => {
      if (!userC || !roomMember1) return;
      try {
        const res = await fetchRelation({
          fromUserId: userC._id,
          toUserId: roomMember1._id,
        });
        setRelationStatus(Boolean(res));
      } catch (e) {
        console.error('❌ Kiểm tra mối quan hệ thất bại:', e);
      }
    };
    checkRelation();
  }, [roomMember1, userC]);

  useEffect(() => {
    setChat([]);
    if (rooms?._id) {
      dispatch(fetchMessages({roomId: rooms._id}));
    }
  }, [rooms?._id]);

  useEffect(() => {
    setChat(messages);
  }, [messages, roomId]);

  useEffect(() => {
    connectToSocket(roomId);
    return () => disconnectSocket();
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    const onMessage = (data: Message) => {
      setChat(prev => [...prev, data]);
    };

    const onReactionUpdated = ({
      messageId,
      reactions,
    }: {
      messageId: string;
      reactions: Message['reactions'];
    }) => {
      setChat(prev =>
        prev.map(msg => (msg._id === messageId ? {...msg, reactions} : msg)),
      );
    };

    socket.on('receiveMessage', onMessage);
    socket.on('reactionUpdated', onReactionUpdated);

    return () => {
      socket.off('receiveMessage', onMessage);
      socket.off('reactionUpdated', onReactionUpdated);
    };
  }, [socket]);

  useEffect(() => {
    chat.forEach((item, index) => {
      if (!linkPreviews[index] && item.content.match(/https?:\/\/\S+/)) {
        LinkPreview.getPreview(item.content).then(data => {
          setLinkPreviews(prev => ({...prev, [index]: data}));
        });
      }
    });
  }, [chat]);

  useEffect(() => {
    if (chat.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  }, [chat]);

  // Handle highlighting from search results
  useEffect(() => {
    if (highlightMessageId && chat.length > 0) {
      setHighlightedMessageId(highlightMessageId);

      // Scroll to the highlighted message if scrollToIndex is provided
      if (scrollToIndex !== undefined) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: scrollToIndex,
            animated: true,
            viewPosition: 0.5, // Center the message in the view
          });
        }, 1500); // Wait a bit for messages to load
      }

      // Clear highlight after 1.5 seconds
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 1500);
    }
  }, [highlightMessageId, scrollToIndex, chat]);

  const sendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && socket) {
      socket.emit('sendMessage', {
        roomId,
        content: trimmedMessage,
        senderId: userC?._id,
      });
      setMessage('');
    }
  }, [message, socket, roomId, userC?._id]);

  const pickImageAndSend = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets?.length) {
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
            roomId,
            senderId: userC?._id,
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
  }, [
    socket,
    roomId,
    userC?._id,
    showUploadModal,
    hideUploadModal,
    setProgress,
  ]);

  const handleAcceptRequest = useCallback(async () => {
    try {
      await updatedRoomStatus({roomId: rooms!._id});
      setRelationStatus(true);
      dispatch(fetchMyRooms());
      dispatch(fetchMyWaitingRooms());
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  }, [rooms, dispatch]);

  const handleGoBack = useCallback(() => {
    disconnectSocket();
    setChat([]);
    setMessage('');
    setSelectedImageUri(null);
    setLinkPreviews({});
    dispatch(clearMessages());
    setOriginalRoom(null);
    navigation.goBack();
  }, [disconnectSocket, dispatch, navigation]);

  const handleLongPress = useCallback((content: Message) => {
    setModalVisible(true);
    setContent(content);
  }, []);

  const handleCloseImagePreview = useCallback(() => {
    setSelectedImageUri(null);
  }, []);

  const handleCloseActionModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderItem = useCallback(
    ({item, index}: {item: Message; index: number}) => (
      <MessageItemComponent
        roomId={roomId}
        item={item}
        index={index}
        userHandleName={userC?.handleName ?? ''}
        chat={chat}
        setSelectedImageUri={setSelectedImageUri}
        linkPreviews={linkPreviews}
        onLongPress={handleLongPress}
        isHighlighted={highlightedMessageId === item._id}
        userC={userC}
      />
    ),
    [
      roomId,
      userC?.handleName,
      chat,
      linkPreviews,
      handleLongPress,
      highlightedMessageId,
    ],
  );

  const keyExtractor = useCallback((item: Message) => item._id, []);

  const isMessageRequest = !relationStatus && chat.length > 0;
  const isCurrentUserSender =
    isMessageRequest && roomMember1?._id === userC?._id;
  // console.log(` 258 >>>>>>>>> ${isMeSender} <<<<<<<<<<<<< `);
  // console.log(` 259 >>>>>>>>> ${relationStatus} <<<<<<<<<<<<< `);
  const MessageRequestBanner = ({onAccept}: {onAccept: () => void}) => (
    <View style={[styles.requestBanner, {backgroundColor: color.backgroundSecondary}]}>
      <Text style={[styles.requestBannerText, {color: color.text}]}>
        {isMeSender
          ? `Đang chờ ${roomMember1?.handleName} chấp nhận để tiếp tục cuộc trò chuyện.`
          : `${roomMember1?.handleName} muốn nhắn tin cho bạn. Chấp nhận để tiếp tục cuộc trò chuyện.`}
      </Text>
      {!isMeSender && (
        <TouchableOpacity
          style={[
            styles.acceptButton,
            {backgroundColor: color.background, shadowColor: color.text},
          ]}
          onPress={onAccept}>
          <Text style={[styles.callText, {color: color.text}]}>Chấp nhận</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading || !rooms) {
    return (
      <SafeAreaView
        style={[styles.loading, {backgroundColor: color.background}]}>
        <LoadingModal />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {rooms?.theme && (
        <ImageBackground
          source={{uri: rooms.theme}}
          style={styles.bg}
          resizeMode="cover"
        />
      )}
      <View
        style={[
          styles.viewDf,
          {
            backgroundColor: rooms?.theme
              ? 'rgba(0,0,0,0.2)'
              : color.background,
          },
        ]}>
        <View style={{flex: 1}}>
          <MessageHeader
            user1={roomMember1}
            user2={roomMember2}
            room={rooms}
            navigation={navigation}
            handleGoBack={handleGoBack}
            userC={userC}
          />
          <FlatList
            ref={flatListRef}
            data={chat}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: 20,
              paddingHorizontal: 10,
              flexGrow: 1,
            }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({animated: true})
            }
          />
          {isMessageRequest &&
          !isCurrentUserSender &&
          rooms?.type === 'waiting' ? (
            <MessageRequestBanner onAccept={handleAcceptRequest} />
          ) : (
            <MessageInput
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              pickImageAndSend={pickImageAndSend}
              color={color}
            />
          )}
        </View>
      </View>
      <ImagePreviewModal
        visible={!!selectedImageUri}
        imageUri={selectedImageUri}
        onClose={handleCloseImagePreview}
      />
      <ActionModalMessage
        visible={modalVisible}
        onClose={handleCloseActionModal}
        content={content}
        setChat={setChat}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rowContainer1: {
    width: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestBanner: {
    backgroundColor: '#eef5ff',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestBannerText: {
    width: '100%',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  acceptButton: {
    elevation: 2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  acceptButtonText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '700',
  },
  callText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundColor: 'transparent',
  },
  viewDf: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
