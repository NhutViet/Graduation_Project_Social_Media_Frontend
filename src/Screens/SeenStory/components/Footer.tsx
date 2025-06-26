import React from 'react';
import {View, TextInput, TouchableOpacity, Image, Animated} from 'react-native';
import {styles} from './styles';
import {Heart, Send} from 'lucide-react-native';
export const Footer = ({onLike, isLiked, scaleAnim}: any) => (
  <View style={styles.viewBottom}>
    <TextInput
      style={styles.input}
      placeholder="Gửi tin nhắn"
      placeholderTextColor={'#fff'}
    />
    <View style={styles.viewIcon}>
      <TouchableOpacity onPress={onLike}>
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <Heart
            size={30}
            color={isLiked ? '#ff3040' : '#fff'}
            fill={isLiked ? '#ff3040' : 'transparent'}
          />
        </Animated.View>
      </TouchableOpacity>
      <Send size={25} color={"#fff"}/>
    </View>
  </View>
);
