import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface ChatRoomAvatarProps {
  avatars: string[]; // mảng URI avatar, tối đa 3 phần tử
  size?: number;     // đường kính avatar
  overlap?: number;  // độ chồng lên (px)
}

const ChatRoomAvatar: React.FC<ChatRoomAvatarProps> = ({
  avatars,
  size = 40,
  overlap = 12,
}) => {
  return (
    <View style={[styles.container, { width: size + (avatars.length - 1) * (size - overlap), height: size }]}>
      {avatars.slice(0, 3).map((uri, idx) => {
        // tính zIndex sao cho ảnh sau luôn nằm trên ảnh trước
        const zIndex = idx;
        const left = idx * (size - overlap);
        const top = idx * (size - overlap);
        return (
          <Image
            key={idx}
            source={{ uri }}
            style={[
              styles.avatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                left,
                top,
                zIndex,
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default ChatRoomAvatar;