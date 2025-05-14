import {
  FlatList,
  Image,
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
import {io} from 'socket.io-client';
import {RootStackParamList} from '../../Navigation/AppNavigation';
import {launchImageLibrary} from 'react-native-image-picker';

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
  const {room} = route.params;

  const reactions = ['❤️', '😂', '😮', '😢', '😡'];

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);

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
                  marginLeft: showAvatar ? 0 : 60,
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
                <Image
                  source={{uri: item.content}}
                  style={{width: 150, height: 150, borderRadius: 8}}
                  resizeMode="cover"
                />
              ) : (
                <Text style={{color: color.text}}>{item.content}</Text>
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

              {/* Reaction */}
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

        {/* {isMe && showAvatar && (
          <TouchableOpacity style={[styles.blockAvatar, {marginLeft: 10}]}>
            <Image source={{uri: item.image}} style={styles.avatar} />
          </TouchableOpacity>
        )} */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
          <View style={styles.blockImg}>
            <Image
              style={styles.img}
              source={{
                uri: 'https://i.pinimg.com/736x/2d/db/ae/2ddbaec1fb3d18f6ce00c4ebc1693193.jpg',
              }}
            />
          </View>
          <Text style={{color: color.text, fontSize: 16}}>{name}</Text>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.blockIcon}>
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
        <FlatList
          ref={flatListRef}
          data={chat}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 30}}
        />

        <View style={styles.inputContainer}>
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
    </SafeAreaView>
  );
};
