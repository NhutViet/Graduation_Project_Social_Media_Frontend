import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';

export const Header = ({
  onClose,
  username,
  profilePic,
}: {
  onClose: () => void;
  username?: string;
  profilePic?: string;
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
    <TouchableOpacity style={styles.btnCloser} onPress={onClose}>
      <Image
        style={styles.iconCloser}
        source={require('../../../../assets/icon/closer.png')}
      />
    </TouchableOpacity>
  </View>
);
