import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  SafeAreaView,
  View,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useEffect, useMemo, useRef, useState} from 'react';
import MessageStyles from '../../StyleSheet/MessageStyles';
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

export const MessageScreen = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = MessageStyles(theme);
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState('');
  const {messages, loading} = useSelector((state: RootState) => state.messages);
  const [chat, setChat] = useState<Message[]>([]);
  const userC = useSelector((state: RootState) => state.user.user);
  const flatListRef = useRef<FlatList>(null);
  const route = useRoute<RouteProp<RootStackParamList, 'MessageScreen'>>();
  const roomId = route?.params?.room;
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const room = useMemo(
    () => rooms.find(r => r._id === roomId),
    [rooms, roomId],
  );
  const filteredUsers = room?.user_ids.filter(user => user._id !== userC?._id);
  const user1 = filteredUsers ? filteredUsers[0] : undefined;
  const user2 = filteredUsers ? filteredUsers[1] : undefined;
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [linkPreviews, setLinkPreviews] = useState<{[key: number]: any}>({});
  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress();
  const {socket, connectToSocket, disconnectSocket} = useSocket();
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState<Message>();

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
    connectToSocket(roomId);
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    const onMessage = (data: Message) => {
      setChat(prev => [...prev, data]);
    };

    socket.on('receiveMessage', onMessage);

    return () => {
      socket.off('receiveMessage', onMessage);
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

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('sendMessage', {
        roomId: roomId,
        content: message,
        senderId: userC?._id,
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
  };

  const handleGoBack = () => {
    disconnectSocket();
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

  const renderItem = ({item, index}: {item: Message; index: number}) => (
    <MessageItemComponent
      item={item}
      index={index}
      userHandleName={userC?.handleName ?? ''}
      chat={chat}
      setSelectedImageUri={setSelectedImageUri}
      linkPreviews={linkPreviews}
      styles={styles}
      color={color}
      onLongPress={(content: Message) => {
        setModalVisible(true);
        setContent(content);
      }}
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
          <MessageHeader
            user1={user1}
            user2={user2}
            room={room}
            navigation={navigation}
            handleGoBack={handleGoBack}
            styles={styles}
            color={color}
            userC={userC}
          />

          <FlatList
            ref={flatListRef}
            data={chat}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 10,
              flexGrow: 1,
            }}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({animated: true});
            }}
          />

          <MessageInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            pickImageAndSend={pickImageAndSend}
            styles={styles}
            color={color}
          />
        </View>
      </View>

      <ImagePreviewModal
        visible={!!selectedImageUri}
        imageUri={selectedImageUri}
        onClose={() => setSelectedImageUri(null)}
        backgroundColor={Colors.light.background}
      />
      <ActionModalMessage
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        content={content}
        setChat={setChat}
      />
    </SafeAreaView>
  );
};
