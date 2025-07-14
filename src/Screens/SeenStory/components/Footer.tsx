import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Text,
} from 'react-native';
import {styles} from './styles';
import {Heart, Send, MessageCircle} from 'lucide-react-native';

interface FooterProps {
  onLike: () => void;
  isLiked: boolean;
  scaleAnim: any;
  onPressSend: () => void;
  onPressReply: () => void;
}

export const Footer = ({
  onLike,
  isLiked,
  scaleAnim,
  onPressSend,
  onPressReply,
}: FooterProps) => (
  <View style={styles.viewBottom}>
    <TouchableOpacity
      style={styles.input}
      onPress={onPressReply}
      activeOpacity={0.7}>
      <Text style={{color: '#fff', opacity: 0.7}}>Gửi tin nhắn</Text>
    </TouchableOpacity>
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
      <TouchableOpacity onPress={onPressSend}>
        <Send size={25} color={'#fff'} />
      </TouchableOpacity>
    </View>
  </View>
);
