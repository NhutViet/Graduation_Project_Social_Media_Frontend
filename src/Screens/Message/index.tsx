import {
  FlatList,
  Image,
  InteractionManager,
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

const socket = io('https://backendchatsocket.onrender.com');

interface ChatMessage {
  id: string;
  name: string;
  image: string;
  content: string;
  room: string;
}

export const MessageScreen = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [search, setSearch] = useState('');
  const styles = MessageStyles(theme);

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [name] = useState('Justina Xie');
  const [id] = useState('27052005');
  const flatListRef = useRef<FlatList>(null);

  const route = useRoute<RouteProp<RootStackParamList, 'MessageScreen'>>();
  const {room} = route.params;

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

  const renderItem = ({item, index}: {item: ChatMessage; index: number}) => {
    const isMe = item.id === id;
    const prevMsg = chat[index - 1];
    const showAvatar = !prevMsg || prevMsg.id !== item.id;

    return isMe ? (
      <View style={[styles.containerMessage, {justifyContent: 'flex-end'}]}>
        <View style={[styles.row, {alignItems: 'flex-end'}]}>
          {showAvatar && <Text style={styles.name}>{item.name}</Text>}
          <View
            style={[
              styles.message,
              {marginRight: showAvatar ? 0 : 60, backgroundColor: '#00BFFF'},
            ]}>
            <Text style={{color: color.text}}>{item.content}</Text>
          </View>
        </View>
        {showAvatar && (
          <TouchableOpacity style={[styles.blockAvatar, {marginLeft: 10}]}>
            <Image source={{uri: item.image}} style={styles.avatar} />
          </TouchableOpacity>
        )}
      </View>
    ) : (
      <View style={styles.containerMessage}>
        {showAvatar && (
          <TouchableOpacity style={[styles.blockAvatar, {marginRight: 10}]}>
            <Image source={{uri: item.image}} style={styles.avatar} />
          </TouchableOpacity>
        )}
        <View style={[styles.row, {alignItems: 'flex-start'}]}>
          {showAvatar && <Text style={styles.name}>{item.name}</Text>}
          <View
            style={[
              styles.message,
              {marginLeft: showAvatar ? 0 : 60, backgroundColor: '#696969'},
            ]}>
            <Text style={{color: color.text}}>{item.content}</Text>
          </View>
        </View>
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

      <View style={{flex: 1, padding: 10}}>
        <FlatList
          ref={flatListRef}
          data={chat}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
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
            <TouchableOpacity>
              <Image source={require('../../../assets/icon/Microphone.png')} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../../assets/icon/Picture.png')} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../../assets/icon/another.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
