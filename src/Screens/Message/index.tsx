import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  InteractionManager,
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
import {useEffect, useRef, useState} from 'react';
import MessageStyles from '../../StyleSheet/MessageStyles';
import {io, Socket} from 'socket.io-client';
import {RootStackParamList} from '../../Navigation/AppNavigation';
import LinkPreview from 'react-native-link-preview';
import ModalTheme from './components/ModalTheme';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import MessageItemComponent from './components/MessageItemComponent';
import {fetchMessages} from '../../../services/messageRedux/messageSlice';
import {Message} from '../../../services/messageRedux/messageType';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadImageToR2} from '../../core/upload';
import {useUploadProgress} from '../../../services/UploadProgressManager';
import {clearMessages} from '../../../services/messageRedux/messageReducer';

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

  const route = useRoute<RouteProp<RootStackParamList, 'MessageScreen'>>();
  const room = route?.params?.room;
  const img1 = route?.params?.img1;
  const img2 = route?.params?.img2;
  const nameChat = route?.params?.nameChat;
  const themeFromParams = route?.params?.theme;

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [linkPreviews, setLinkPreviews] = useState<{[key: number]: any}>({});
  const [visibleThemeModal, setVisibleThemeModal] = useState(false);
  const [chatBackground, setChatBackground] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress();

  useEffect(() => {
    setChat([]);
    dispatch(fetchMessages({roomId: room}));
  }, []);

  useEffect(() => {
    setChat(messages);
  }, [messages, room]);

  useEffect(() => {
    if (themeFromParams) {
      setChatBackground(themeFromParams);
    }
  }, [themeFromParams]);

  useEffect(() => {
    if (!user.user?._id || !room) return;

    const newSocket = io('http://cirla.io.vn', {
      transports: ['websocket'],
      query: {
        userId: user.user._id,
        roomId: room,
      },
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected!');
      newSocket.emit('joinRoom', {roomId: room});
    });

    newSocket.on('connect_error', err => {
      console.log('❌ Socket connect error:', err.message);
    });

    newSocket.on('receiveMessage', data => {
      setChat(prev => [...prev, data]);
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
        roomId: room,
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
            roomId: room,
            senderId: user.user?._id,
            media: imageUrl,
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
    setSelectedMessageIndex(null);
    setLinkPreviews({});
    setChatBackground(null);

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
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color.background,
        }}>
        <ActivityIndicator size="large" color={color.text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {chatBackground && (
        <ImageBackground
          source={{uri: chatBackground}}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            backgroundColor: 'transparent',
          }}
          resizeMode="cover"
          onError={() => console.log('❌ Failed to load chat background')}
        />
      )}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: chatBackground
            ? 'rgba(0, 0, 0, 0.2)'
            : color.background,
          zIndex: 1,
        }}>
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
                  {overflow: img1 && !img2 ? 'hidden' : undefined},
                ]}>
                {img2 && (
                  <>
                    <Image style={styles.iconW} source={{uri: img1}} />
                    <Image
                      style={[
                        styles.iconF,
                        {
                          borderColor: color.background,
                          backgroundColor: color.backgroundSecondary,
                        },
                      ]}
                      source={{uri: img2}}
                    />
                  </>
                )}
                {!img2 && img1 && (
                  <Image style={styles.img} source={{uri: img1}} />
                )}
              </TouchableOpacity>

              <Text style={{color: color.text, fontSize: 16}} numberOfLines={1}>
                {nameChat}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={styles.blockIcon}
                onPress={() => {
                  console.log('Video camera button pressed');
                }}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/icon/videoCamera.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.blockIcon}
                onPress={() => {
                  setVisibleThemeModal(true);
                }}>
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
              {backgroundColor: color.backgroundSecondary, zIndex: 20},
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
              placeholder="Type a message..."
              placeholderTextColor={color.text}
              style={styles.input}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />

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
          </View>
        </View>
      </View>

      <Modal visible={!!selectedImageUri} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{position: 'absolute', top: 30, right: 20, zIndex: 1}}
            onPress={() => setSelectedImageUri(null)}>
            <Text style={{color: Colors.light.background, fontSize: 24}}>
              ✕
            </Text>
          </TouchableOpacity>
          {selectedImageUri && (
            <View
              style={{
                width: '90%',
                height: '80%',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <Image
                source={{uri: selectedImageUri}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </Modal>

      <ModalTheme
        visible={visibleThemeModal}
        onClose={() => {
          setVisibleThemeModal(false);
        }}
        onSelect={selectedBackground => {
          setChatBackground(selectedBackground);
          setVisibleThemeModal(false);
        }}
      />
    </SafeAreaView>
  );
};
