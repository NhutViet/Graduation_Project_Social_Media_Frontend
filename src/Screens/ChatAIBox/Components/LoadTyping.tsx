import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {DotTypingAnimation} from 'react-native-dot-typing';
import {useTheme} from '../../../../src/util/ThemeContext';
import {Colors} from '@assets/color/Colors';

interface LoadingTypingProps {
  itemLoading?: {
    username?: string;
    profilePic?: string;
  }[];
  Icon?: any;
}

const LoadTyping = (props: LoadingTypingProps) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const {itemLoading, Icon} = props;

  return (
    <View style={styles.containerRow}>
      {Icon && (
        <View style={[styles.containerRow, {alignItems: 'center'}]}>
          <View
            style={[styles.avatarContainer, {backgroundColor: color.primary}]}>
            <Icon size={18} color={color.background} strokeWidth={2.5} />
          </View>
          <Text style={[styles.text, {color: color.text}]}>Đang suy nghĩ</Text>
        </View>
      )}
      {itemLoading?.length === 1 ? (
        <View style={[styles.containerRow, {alignItems: 'center'}]}>
          <TouchableOpacity style={[styles.blockAvatar, {marginRight: 10}]}>
            <Image
              source={{uri: itemLoading[0].profilePic}}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={[styles.text, {color: color.text}]}>
            {itemLoading[0].username} đang nhập tin nhắn
          </Text>
        </View>
      ) : (
        itemLoading &&
        itemLoading?.length > 1 && (
          <View style={[styles.containerRow, {alignItems: 'center'}]}>
            <View>
              <TouchableOpacity style={[styles.blockAvatar, {marginRight: 10}]}>
                <Image
                  source={{uri: itemLoading[1].profilePic}}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.blockAvatar,
                  {
                    marginRight: 10,
                    position: 'absolute',
                    marginLeft: 4,
                    marginTop: 4,
                    zIndex: 1,
                  },
                ]}>
                <Image
                  source={{uri: itemLoading[0].profilePic}}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.text, {color: color.text}]}>
              {itemLoading.length === 2
                ? `${itemLoading[0].username} và ${itemLoading[1].username} đang nhập tin nhắn`
                : `${itemLoading[0].username} và những người khác đang nhập tin nhắn`}
            </Text>
          </View>
        )
      )}
      <DotTypingAnimation
        dotRadius={2}
        dotAmplitude={1}
        dotMargin={8}
        dotColor={color.textSecondary}
        style={{
          alignSelf: 'center',
          marginVertical: 8,
          height: 10,
          marginLeft: 10,
        }}
      />
    </View>
  );
};

export default LoadTyping;

const styles = StyleSheet.create({
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  containerRow: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  blockAvatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
