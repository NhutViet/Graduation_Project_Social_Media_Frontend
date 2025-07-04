// SeenStoryOwnerHeader.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Animated} from 'react-native';
import {styles} from './style';
import {Pause, Play, VolumeX, Volume2} from 'lucide-react-native';

import {useSelector} from 'react-redux';
import {RootState} from '@services/store';

interface Props {
  onClose: () => void;
  progressAnims: any[];
  pause: boolean;
  mute: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  createdAt?: string;
  creator: {
    username: string;
    profilePic: string;
  };
}

const SeenStoryOwnerHeader: React.FC<Props> = ({
  onClose,
  progressAnims,
  pause,
  onTogglePause,
  mute,
  onToggleMute,
  createdAt,
  creator,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [timeAgo, setTimeAgo] = useState('');
  useEffect(() => {
    if (!createdAt) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const created = new Date(createdAt);

      // Lấy offset múi giờ hiện tại (ví dụ: -420 phút = GMT+7)
      const timezoneOffset = now.getTimezoneOffset(); // đơn vị: phút
      const localCreated = new Date(
        created.getTime() - timezoneOffset * 60 * 1000,
      );

      const diffMs = now.getTime() - localCreated.getTime();

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
  const renderProgressBars = () => {
    return (
      <View style={styles.progressContainer}>
        {progressAnims.map((anim, index) => {
          const width = anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          });
          return (
            <View key={index} style={styles.progressBarWrapper}>
              <Animated.View
                style={[styles.progressBar, {width, backgroundColor: '#fff'}]}
              />
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.mediaItems}>{renderProgressBars()}</View>
      <TouchableOpacity style={styles.viewUser}>
        <Image style={styles.avatar} source={{uri: creator?.profilePic}} />
        <Text style={styles.nameUser}>{creator?.username}</Text>
        {timeAgo ? <Text style={styles.textTime}>{timeAgo}</Text> : null}
      </TouchableOpacity>
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
        <Image
          style={styles.iconCloser}
          source={require('../../../../assets/icon/closer.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SeenStoryOwnerHeader;
