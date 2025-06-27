// SeenStoryOwnerHeader.tsx
import React from 'react';
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
}

const SeenStoryOwnerHeader: React.FC<Props> = ({
  onClose,
  progressAnims,
  pause,
  onTogglePause,
  mute,
  onToggleMute,
}) => {
  const user = useSelector((state: RootState) => state.user.user);

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
        <Image style={styles.avatar} source={{uri: user?.profilePic}} />
        <Text style={styles.nameUser}>{user?.username}</Text>
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
