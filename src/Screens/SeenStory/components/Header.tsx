import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {Pause, Play, VolumeX, Volume2} from 'lucide-react-native';

export const Header = ({
  onClose,
  username,
  profilePic,
  pause,
  onTogglePause,
  mute,
  onToggleMute,
}: {
  onClose: () => void;
  username?: string;
  profilePic?: string;
  pause: boolean;
  onTogglePause: () => void;
  mute: boolean;
  onToggleMute: () => void;
}) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.viewUser}>
      <Image
        style={styles.avatar}
        source={{
          uri: profilePic,
        }}
      />
      <Text style={styles.nameUser}>{username}</Text>
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
      <X color={'#fff'} />
    </TouchableOpacity>
  </View>
);
