import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../../assets/color/Colors';
import { useTheme } from '../../../util/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight } from 'lucide-react-native';

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
  const { theme } = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();

  return (
    <View style={styles.surround}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          if (nameChat === 'Không xác định') {
            navigation.navigate('MessageUndefined');
          } else {
            navigation.navigate('MessageScreen', {
              room: roomId,
            });
          }
        }}>
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <View
              style={[
                styles.imgContainer,
                { overflow: img1 && !img2 ? 'hidden' : 'visible' },
              ]}>
              {img2 && (
                <>
                  <Image style={styles.iconW} source={{ uri: img1 }} />
                  <Image
                    style={[
                      styles.iconF,
                      {
                        borderColor: color.background,
                        backgroundColor: color.backgroundSecondary,
                      },
                    ]}
                    source={{ uri: img2 }}
                  />
                </>
              )}
              {!img2 && img1 && <Image style={styles.img} source={{ uri: img1 }} />}
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.nameChat, { color: color.text }]}>{nameChat}</Text>
              {latestMessage?.content && (
                <Text
                  style={[styles.textNormal, { color: color.textSecondary }]}
                  numberOfLines={1}>
                  {latestMessage?.content}
                </Text>
              )}
            </View>
          </View>
          <ChevronRight size={22} color={color.textSecondary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  surround: {
    paddingHorizontal: 5,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 32,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imgContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
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
    borderRadius: 25,
  },
  nameChat: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  textNormal: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default ItemNewMessage;
