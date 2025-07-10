import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {Pause, Play, VolumeX, Volume2, X} from 'lucide-react-native';
import Icon from '../../../../components/Icon';
export const Header = ({
  onClose,
  username,
  profilePic,
  pause,
  onTogglePause,
  mute,
  onToggleMute,
  createdAt,
  navigation,
  creatorId,
  yourUserId,
}: {
  onClose: () => void;
  username?: string;
  profilePic?: string;
  pause: boolean;
  onTogglePause: () => void;
  mute: boolean;
  onToggleMute: () => void;
  createdAt?: string;
  navigation?: any;
  creatorId?: string;
  yourUserId?: string;
}) => {
  const [timeAgo, setTimeAgo] = useState('');
  useEffect(() => {
    if (!createdAt) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const created = new Date(createdAt);
      const diffMs = now.getTime() - created.getTime();

      if (diffMs >= 24 * 60 * 60 * 1000) {
        setTimeAgo('');
        return;
      }

      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        setTimeAgo(`${hours} giờ trước`);
      } else if (minutes > 0) {
        setTimeAgo(`${minutes} phút trước`);
      } else {
        setTimeAgo(`${seconds} giây trước`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  // ✅ Handle avatar press navigation
  const handleAvatarPress = () => {
    if (!navigation || !creatorId) return;

    // ✅ Pause story khi navigate
    if (!pause) {
      onTogglePause();
    }

    // ✅ Kiểm tra nếu là chính tài khoản hiện tại thì chuyển qua Account
    if (creatorId === yourUserId) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('ProfileComp', {userID: creatorId});
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.viewUser}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={handleAvatarPress}
          activeOpacity={0.7}>
          <Image
            style={styles.avatar}
            source={{
              uri: profilePic,
            }}
          />
          <Text style={styles.nameUser}>{username}</Text>
        </TouchableOpacity>
        {timeAgo ? <Text style={styles.textTime}>{timeAgo}</Text> : null}
      </View>

      <TouchableOpacity style={styles.mute} onPress={onToggleMute}>
        {mute ? (
          <VolumeX size={24} color="#fff" />
        ) : (
          <Volume2 size={24} color="#fff" />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.pause} onPress={onTogglePause}>
        {pause ? (
          <Play size={24} color="#fff" />
        ) : (
          <Pause size={24} color="#fff" />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCloser} onPress={onClose}>
        <Icon name="close" size={20} tintColor="#fff" />
      </TouchableOpacity>
    </View>
  );
};
