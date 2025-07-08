import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../assets/color/Colors';
import { useTheme } from '../src/util/ThemeContext';

interface ChatRoomAvatarProps {
  roomId: string;
  img1?: string;
  img2?: string;
}

const ChatRoomAvatar: React.FC<ChatRoomAvatarProps> = ({
  roomId,
  img1,
  img2,
}) => {
  const { theme } = useTheme();
  const color = Colors[theme];

  return (
    <View style={styles.container}>
      <View style={[styles.imgContainer]}>        
        {img2 ? (
          <>
            <Image source={{ uri: img1 }} style={[styles.iconW, { borderColor: color.background }]} />
            <Image source={{ uri: img2 }} style={[styles.iconF, { borderColor: color.background, backgroundColor: color.backgroundSecondary }]} />
          </>
        ) : img1 ? (
          <Image source={{ uri: img1 }} style={styles.img} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: color.backgroundSecondary }]} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    position: 'relative',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5
  },
  iconW: {
    width: '75%',
    height: '75%',
    resizeMode: 'cover',
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 2,
  },
  iconF: {
    width: '85%',
    height: '85%',
    resizeMode: 'cover',
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    zIndex: 1,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default ChatRoomAvatar;
