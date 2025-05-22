import {useNavigation} from '@react-navigation/native';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../src/Navigation/AppNavigation';

const rooms = ['room1', 'room2'];

type RoomSelectorProp = StackNavigationProp<
  RootStackParamList,
  'PendingMessages'
>;

const MessageItem = (props: any) => {
  const {img, name, description, isGroup = false} = props;
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];

  const navMess = useNavigation<RoomSelectorProp>();

  const enterRoom = (room: string) => {
    navMess.navigate('MessageScreen', {room});
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => enterRoom(isGroup ? rooms[1] : rooms[0])}>
      <View style={styles.userBlock}>
        <View style={styles.imgBlock}>
          <Image style={styles.img} source={{uri: img}} />
          {isGroup && (
            <View style={[styles.img, {position: 'absolute', right: 0, top: 0, width: '90%', height: '90%', zIndex: 1, backgroundColor: color.black, borderRadius: 100}]} />
          )}
        </View>
        <View>
          <Text style={[styles.text, {color: color.text, fontWeight: '500'}]}>
            {name}
          </Text>
          <Text style={[styles.text, {color: '#AAAAAA'}]}>{description}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.iconBlock}>
        <Image
          style={[styles.icon, {tintColor: color.text}]}
          source={require('../assets/icon/camera.png')}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  userBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgBlock: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    fontSize: 14,
  },
  iconBlock: {
    width: 20,
    height: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default MessageItem;
