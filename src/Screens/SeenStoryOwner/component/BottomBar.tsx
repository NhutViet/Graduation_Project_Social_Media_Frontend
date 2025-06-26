import React, {useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {styles} from './style';
import { UsersRound, Ellipsis } from 'lucide-react-native';

interface BottomBarProps {
  setVisible: (visible: boolean) => void;
  setVisibleSeeMore: (visible: boolean) => void;
}

export const BottomBar = ({setVisible, setVisibleSeeMore}: BottomBarProps) => (
  <View style={styles.viewBottom}>
    <TouchableOpacity
      style={styles.viewIconItem}
      onPress={() => setVisible(true)}>
      <UsersRound style={{marginBottom: 3}} color={"#fff"}/>
      <Text style={styles.txtIcon}>Hoạt động</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.viewIconItem}
      onPress={() => setVisibleSeeMore(true)}>
      <Ellipsis style={{marginBottom: 3}} color={"#fff"}/>
      <Text style={styles.txtIcon}>Xem thêm</Text>
    </TouchableOpacity>
  </View>
);
