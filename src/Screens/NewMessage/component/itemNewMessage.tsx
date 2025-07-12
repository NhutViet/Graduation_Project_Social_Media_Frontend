import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {ChevronRight} from 'lucide-react-native';

interface ItemNewMessageProps {
  roomId: string;
  nameChat: string;
  latestMessage?: {
    content: string;
  };
  img1?: string;
  img2?: string;
  type?: string;
}

const ItemNewMessage: React.FC<ItemNewMessageProps> = ({
  roomId,
  nameChat,
  latestMessage,
  img1,
  img2,
  type,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        console.log(`❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥35 >>>>>> itemNewMsg - RoomID: ${roomId}`);
        if (nameChat === 'Không xác định') {
          navigation.navigate('MessageUndefined');
        } else {
          navigation.navigate('MessageScreen', {
            room: roomId,
            isWaiting: type === 'waiting',
          });
        }
      }}>
      <View style={styles.rowContainer}>
        <View
          style={[
            styles.imgContainer,
            {overflow: img1 && !img2 ? 'hidden' : 'visible'},
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
          {!img2 && img1 && <Image style={styles.img} source={{uri: img1}} />}
        </View>
        <View>
          <Text style={[styles.nameChat, {color: color.text}]}>{nameChat}</Text>
          {latestMessage?.content && (
            <Text
              style={[styles.textNormal, {color: color.text}]}
              numberOfLines={1}>
              {latestMessage?.content}
            </Text>
          )}
        </View>
      </View>
      <ChevronRight size={22} color={color.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgContainer: {
    position: 'relative',
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
  icon: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
  },
  nameChat: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textNormal: {
    fontSize: 14,
  },
});

export default ItemNewMessage;
