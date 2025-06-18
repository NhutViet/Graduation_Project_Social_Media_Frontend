import React, {useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {styles} from './style';

interface BottomBarProps {
  setVisible: (visible: boolean) => void;
  setVisibleSeeMore: (visible: boolean) => void;
}

export const BottomBar = ({setVisible, setVisibleSeeMore}: BottomBarProps) => (
  <View style={styles.viewBottom}>
    <TouchableOpacity
      style={styles.viewIconItem}
      onPress={() => setVisible(true)}>
      <Image
        style={styles.icon}
        source={require('../../../../assets/icon/users.png')}
      />
      <Text style={styles.txtIcon}>Hoạt động</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.viewIconItem}
      onPress={() => setVisibleSeeMore(true)}>
      <Image
        style={styles.icon}
        source={require('../../../../assets/icon/ellipsis.png')}
      />
      <Text style={styles.txtIcon}>Xem thêm</Text>
    </TouchableOpacity>
  </View>
);
