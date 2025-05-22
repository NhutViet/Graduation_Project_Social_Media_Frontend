import {
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
  Linking,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useEffect, useRef, useState} from 'react';
import MessageStyles from '../../StyleSheet/MessageStyles';
import {io} from 'socket.io-client';
import {RootStackParamList} from '../../Navigation/AppNavigation';
import {launchImageLibrary} from 'react-native-image-picker';
import LinkPreview from 'react-native-link-preview';
import ModalTheme from './components/ModalTheme';

const socket = io('https://backendchatsocket.onrender.com');

interface ChatMessage {
  id: string;
  name: string;
  image: string;
  content: string;
  room: string;
  reaction?: string;
  isImage?: boolean;
}

export const MessageScreen = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = MessageStyles(theme);

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [name] = useState('Justina Xie');
  const [id] = useState('27052005');
  const flatListRef = useRef<FlatList>(null);

  const route = useRoute<RouteProp<RootStackParamList, 'MessageScreen'>>();
  const room = route?.params?.room;

  const reactions = ['❤️', '😂', '😮', '😢', '😡'];

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [linkPreviews, setLinkPreviews] = useState<{[key: number]: any}>({});
  const [visibleThemeModal, setVisibleThemeModal] = useState(false);
  const [chatBackground, setChatBackground] = useState<string | null>(null);

  useEffect(() => {
    socket.emit('join_room', room);

    socket.on('receive_message', data => {
      setChat(prev => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [room]);

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

  useEffect(() => {
    console.log('visibleThemeModal:', visibleThemeModal);
    console.log('chatBackground:', chatBackground);
  }, [visibleThemeModal, chatBackground]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData: ChatMessage = {
        id,
        name,
        image:
          'https://i.pinimg.com/736x/2d/db/ae/2ddbaec1fb3d18f6ce00c4ebc1693193.jpg',
        content: message,
        room,
      };

      socket.emit('send_message', msgData);
      setMessage('');
    }
  };

  const handleReaction = (emoji: string) => {
    if (selectedMessageIndex === null) return;

    const updatedChat = [...chat];
    updatedChat[selectedMessageIndex].reaction = emoji;
    setChat(updatedChat);

    setReactionModalVisible(false);
    setSelectedMessageIndex(null);
  };

  const sendImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        const msgData: ChatMessage = {
          id,
          name,
          image:
            'https://i.pinimg.com/736x/2d/db/ae/2ddbaec1fb3d18f6ce00c4ebc1693193.jpg',
          content: imageUri || '',
          room,
          isImage: true,
        };
        socket.emit('send_message', msgData);
      }
    });
  };

  const renderItem = ({item, index}: {item: ChatMessage; index: number}) => {
    const isMe = item.id === id;
    const prevMsg = chat[index - 1];
    const showAvatar = !prevMsg || prevMsg.id !== item.id;
    const isSelected = selectedMessageIndex === index;

    return (
      <View
        style={[
          styles.containerMessage,
          {justifyContent: isMe ? 'flex-end' : 'flex-start'},
        ]}>
        {!isMe && showAvatar && (
          <TouchableOpacity style={[styles.blockAvatar, {marginRight: 10}]}>
            <Image source={{uri: item.image}} style={styles.avatar} />
          </TouchableOpacity>
        )}

        <View
          style={[styles.row, {alignItems: isMe ? 'flex-end' : 'flex-start'}]}>
          {!isMe && showAvatar && <Text style={styles.name}>{item.name}</Text>}

          <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={() => {
              setSelectedMessageIndex(index);
              setReactionModalVisible(true);
            }}>
            <View
              style={[
                styles.message,
                {
                  marginLeft: isMe || showAvatar ? 0 : 60,
                  marginRight: isMe ? 0 : 40,
                  backgroundColor: item.isImage
                    ? 'transparent'
                    : isMe
                    ? '#00BFFF'
                    : '#A9A9A9',
                  padding: item.isImage ? 0 : 10,
                  marginBottom: item.reaction ? 15 : 0,
                },
              ]}>
              {item.isImage ? (
                <TouchableOpacity
                  onPress={() => setSelectedImageUri(item.content)}>
                  <Image
                    source={{uri: item.content}}
                    style={{width: 150, height: 150, borderRadius: 8}}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : (
                <>
                  {item.content
                    .split(/(\s+)/)
                    .filter(part => !/^https?:\/\/\S+$/i.test(part))
                    .join('') !== '' && (
                    <Text style={{color: color.text}}>
                      {item.content
                        .split(/(\s+)/)
                        .filter(part => !/^https?:\/\/\S+$/i.test(part))
                        .join('')}
                    </Text>
                  )}
                  {linkPreviews[index] && (
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(linkPreviews[index].url);
                      }}
                      style={{
                        borderRadius: 8,
                        backgroundColor: '#f0f0f0',
                        marginTop: 5,
                        padding: 8,
                        maxWidth: 200,
                      }}>
                      {linkPreviews[index].images?.length > 0 && (
                        <Image
                          source={{uri: linkPreviews[index].images[0]}}
                          style={{
                            width: '100%',
                            height: 120,
                            borderRadius: 6,
                            marginBottom: 6,
                          }}
                          resizeMode="cover"
                        />
                      )}
                      <Text
                        style={{fontWeight: 'bold', color: 'black'}}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        {linkPreviews[index].title}
                      </Text>
                      {linkPreviews[index].description && (
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{color: 'gray', fontSize: 12}}>
                          {linkPreviews[index].description}
                        </Text>
                      )}
                      <Text
                        style={{color: '#007AFF', fontSize: 12, marginTop: 4}}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        {linkPreviews[index].url}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}

              {item.reaction && (
                <View
                  style={[
                    styles.reactionContainer,
                    {
                      [isMe ? 'right' : 'left']: 5,
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                    },
                  ]}>
                  <Text
                    style={{
                      color: color.text,
                      fontSize: 15,
                    }}>
                    {item.reaction}
                  </Text>
                </View>
              )}

              {isSelected && (
                <View
                  style={{
                    width: 190,
                    flexDirection: 'row',
                    position: 'absolute',
                    top: -30,
                    backgroundColor: 'white',
                    padding: 6,
                    borderRadius: 30,
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    elevation: 3,
                    zIndex: 1,
                  }}>
                  {reactions.map((emoji, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleReaction(emoji)}>
                      <Text style={{fontSize: 22, marginHorizontal: 6}}>
                        {emoji}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {chatBackground ? (
        <ImageBackground
          source={{uri: chatBackground}}
          style={{flex: 1}}
          resizeMode="cover"
          onError={() => console.log('Failed to load background image')}>
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
                    console.log('Back button pressed');
                    navigation.goBack();
                  }}>
                  <Image
                    style={styles.icon}
                    source={require('../../../assets/icon/left.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.blockImg} onPress={() => {
                  console.log('avatar');
                  navigation.navigate(room == 'room2' ? "InforGroupChat" :"InfoUser");
                }}>
                  <Image
                    style={styles.img}
                    source={{
                      uri: 'https://i.pinimg.com/736x/2d/db/ae/2ddbaec1fb3d18f6ce00c4ebc1693193.jpg',
                    }}
                  />
                </TouchableOpacity>
                <Text style={{color: color.text, fontSize: 16}}>{name}</Text>
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
                <TouchableOpacity style={styles.blockIcon}>
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
                  keyExtractor={(_, i) => i.toString()}
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
                  <TouchableOpacity
                    style={styles.blockIcon1}
                    onPress={sendImage}>
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
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={styles.blockIcon}
                onPress={() => {
                  console.log('Back button pressed');
                  navigation.goBack();
                }}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/icon/left.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.blockImg} onPress={() => navigation.navigate(room == 'room2' ? "InforGroupChat" :"InfoUser")}>
                <Image
                  style={styles.img}
                  source={{
                    uri: 'https://i.pinimg.com/736x/2d/db/ae/2ddbaec1fb3d18f6ce00c4ebc1693193.jpg',
                  }}
                />
              </TouchableOpacity>
              <Text style={{color: color.text, fontSize: 16}}>{name}</Text>
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
                keyExtractor={(_, i) => i.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingVertical: 30}}
              />
            </TouchableOpacity>

            <View style={[styles.inputContainer, {zIndex: 20}]}>
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
                <TouchableOpacity style={styles.blockIcon1} onPress={sendImage}>
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
      )}

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

      <ModalTheme
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
      />
    </SafeAreaView>
  );
};
