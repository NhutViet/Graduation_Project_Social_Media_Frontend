import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import { X } from 'lucide-react-native';

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
      <X color={"#fff"}/>
    </TouchableOpacity>
  </View>
);
