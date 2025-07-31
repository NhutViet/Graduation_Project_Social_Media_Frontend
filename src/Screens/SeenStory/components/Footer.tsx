import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Text,
} from 'react-native';
import {styles} from './styles';
import {Heart, Link, MessageCircle, Check} from 'lucide-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

interface FooterProps {
  onLike: () => void;
  isLiked: boolean;
  scaleAnim: any;
  onPressCopyLink: () => void;
  onPressReply: () => void;
}

export const Footer = ({
  onLike,
  isLiked,
  scaleAnim,
  onPressCopyLink,
  onPressReply,
}: FooterProps) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleCopyLink = () => {
    onPressCopyLink();
    setIsLinkCopied(true);

    // Reset the icon after 2 seconds
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  return (
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
        <TouchableOpacity onPress={handleCopyLink}>
          {isLinkCopied ? (
            <Check size={25} color={'#4CAF50'} />
          ) : (
            <Link size={25} color={'#fff'} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
