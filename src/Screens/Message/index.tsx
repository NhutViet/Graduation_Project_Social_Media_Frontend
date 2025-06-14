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

export const MessageScreen = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = MessageStyles(theme);
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState('');
  const {messages, loading, error} = useSelector(
    (state: RootState) => state.messages,
  );
  const [chat, setChat] = useState<Message[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const flatListRef = useRef<FlatList>(null);

  const route = useRoute<RouteProp<RootStackParamList, 'MessageScreen'>>();
  const room = route?.params?.room;

  const themeFromParams = route?.params?.theme;

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [linkPreviews, setLinkPreviews] = useState<{[key: number]: any}>({});
  const [visibleThemeModal, setVisibleThemeModal] = useState(false);
  const [chatBackground, setChatBackground] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

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
    if (chat.length > 0) {
      InteractionManager.runAfterInteractions(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      });
    }
  }, [chat]);

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

  const renderItem = ({item, index}: {item: Message; index: number}) => (
    <MessageItemComponent
      item={item}
      index={index}
      userHandleName={user.user?.handleName ?? ''}
      chat={chat}
      selectedMessageIndex={selectedMessageIndex}
      setSelectedMessageIndex={setSelectedMessageIndex}
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
      {chatBackground ? (
        <ImageBackground
          source={{uri: chatBackground}}
          style={{flex: 1, backgroundColor: 'transparent'}}
          resizeMode="cover"
          onError={() => console.log('❌ Failed to load chat background')}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}>
            <View
              style={[
                styles.header,
                {backgroundColor: 'rgba(255, 255, 255, 0.9)'},
              ]}>
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  style={styles.blockIcon}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Image
                    style={styles.icon}
                    source={require('../../../assets/icon/left.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.blockImg}
                  onPress={() => {
                    console.log('avatar');
                    navigation.navigate(
                      room == 'room2' ? 'InforGroupChat' : 'InfoUser',
                    );
                  }}>
                  <Image
                    style={styles.img}
                    source={{
                      uri: user.user?.profilePic,
                    }}
                  />
                </TouchableOpacity>
                <Text style={{color: color.text, fontSize: 16}}>
                  {user.user?.handleName}
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
                    console.log('Info button pressed, opening ModalTheme');
                    setVisibleThemeModal(true);
                  }}>
                  <Image
                    style={styles.icon}
                    source={require('../../../assets/icon/info.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingBottom: 10,
                paddingHorizontal: 10,
              }}>
              <TouchableOpacity
                style={{flex: 1, zIndex: 10}}
                onLongPress={() => {
                  console.log('Long press detected, opening ModalTheme');
                  setVisibleThemeModal(true);
                }}
                activeOpacity={1}>
                <FlatList
                  ref={flatListRef}
                  data={chat}
                  renderItem={renderItem}
                  keyExtractor={item => item._id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingVertical: 30}}
                />
              </TouchableOpacity>

              <View
                style={[
                  styles.inputContainer,
                  {backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 20},
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
                  <TouchableOpacity style={styles.blockIcon1}>
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
        </ImageBackground>
      ) : (
        <View style={[{flex: 1}, {backgroundColor: color.background}]}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}>
            <View
              style={[
                styles.header,
                {backgroundColor: 'rgba(255, 255, 255, 0.9)'},
              ]}>
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  style={styles.blockIcon}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Image
                    style={styles.icon}
                    source={require('../../../assets/icon/left.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.blockImg}
                  onPress={() => {
                    console.log('avatar');
                    navigation.navigate(
                      room == 'room2' ? 'InforGroupChat' : 'InfoUser',
                    );
                  }}>
                  <Image
                    style={styles.img}
                    source={{
                      uri: user.user?.profilePic,
                    }}
                  />
                </TouchableOpacity>
                <Text style={{color: color.text, fontSize: 16}}>
                  {user.user?.handleName}
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
                    console.log('Info button pressed, opening ModalTheme');
                    setVisibleThemeModal(true);
                  }}>
                  <Image
                    style={styles.icon}
                    source={require('../../../assets/icon/info.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                paddingBottom: 10,
                paddingHorizontal: 10,
              }}>
              <TouchableOpacity
                style={{flex: 1, zIndex: 10}}
                onLongPress={() => {
                  console.log('Long press detected, opening ModalTheme');
                  setVisibleThemeModal(true);
                }}
                activeOpacity={1}>
                <FlatList
                  ref={flatListRef}
                  data={chat}
                  renderItem={renderItem}
                  keyExtractor={item => item._id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingVertical: 30}}
                />
              </TouchableOpacity>

              <View
                style={[
                  styles.inputContainer,
                  {backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 20},
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
                  <TouchableOpacity style={styles.blockIcon1}>
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
        </View>
      )}

      {/* </ImageBackground> */}

      <Modal visible={!!selectedImageUri} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{position: 'absolute', top: 40, right: 20, zIndex: 1}}
            onPress={() => setSelectedImageUri(null)}>
            <Text style={{color: Colors.light.background, fontSize: 24}}>
              ✕
            </Text>
          </TouchableOpacity>
          {selectedImageUri && (
            <Image
              source={{uri: selectedImageUri}}
              style={{width: '90%', height: '80%', borderRadius: 10}}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* <ModalTheme
        visible={visibleThemeModal}
        onClose={() => {
          console.log('Closing ModalTheme');
          setVisibleThemeModal(false);
        }}
        onSelect={selectedBackground => {
          console.log('Selected background:', selectedBackground);
          setChatBackground(selectedBackground);
          setVisibleThemeModal(false);
        }}
      /> */}
    </SafeAreaView>
  );
};
