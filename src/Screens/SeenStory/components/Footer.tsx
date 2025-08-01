import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Text,
  Share,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {styles} from './styles';
import {Heart, Link, MessageCircle, Check, Share2} from 'lucide-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {trackStoryShare} from '../../../../services/StoryRedux/StorySlice';
import {AppDispatch} from '../../../../services/store';
import {isStoryVisible} from '../../../../services/storage/storage';

interface FooterProps {
  onLike: () => void;
  isLiked: boolean;
  scaleAnim: any;
  onPressCopyLink: () => void;
  onPressReply: () => void;
  onShare: () => void; // ✅ Thêm prop để pause story khi share
  storyId?: string;
  creatorId?: string;
  shareCount?: number;
  createdAt?: string;
}

export const Footer = ({
  onLike,
  isLiked,
  scaleAnim,
  onPressCopyLink,
  onPressReply,
  onShare, // ✅ Thêm prop onShare
  storyId,
  creatorId,
  shareCount = 0,
  createdAt,
}: FooterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleCopyLink = () => {
    onPressCopyLink();
    setIsLinkCopied(true);

    // Reset the icon after 2 seconds
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  const handleShareStory = async () => {
    if (!storyId || !creatorId) {
      GlobalAlertManager.show('Lỗi', 'Không thể chia sẻ story');
      return;
    }

    // ✅ Check if story has expired before sharing
    if (createdAt && !isStoryVisible(createdAt)) {
      GlobalAlertManager.show('Thông báo', 'Story này đã hết hạn sau 24 giờ và không thể chia sẻ.');
      return;
    }

    // ✅ Pause story khi share
    onShare();

    try {
      // Generate deeplink for the story - use universal link format
      const shareUrl = `https://cirla.io.vn/story/${storyId}/${creatorId}`;
      
      const result = await Share.share({
        message: `Xem story này trên Cirla: ${shareUrl}`,
        url: shareUrl, // For iOS
      });

      // Track share count
      dispatch(trackStoryShare({storyId}));

      // ✅ Resume story sau khi share dialog đóng (nếu không bị cancel)
      if (result.action !== Share.dismissedAction) {
        // Resume story sau 500ms để đảm bảo dialog đã đóng hoàn toàn
        setTimeout(() => {
          onShare(); // Gọi lại để resume
        }, 500);
      }
    } catch (error) {
      console.error('Error sharing story:', error);
      
      // ✅ Kiểm tra loại lỗi để hiển thị thông báo phù hợp
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status === 404) {
          GlobalAlertManager.show('Thông báo', 'Story này không còn tồn tại hoặc đã bị xóa.');
        } else {
          GlobalAlertManager.show('Lỗi', 'Không thể chia sẻ story. Vui lòng thử lại sau.');
        }
      } else {
        GlobalAlertManager.show('Lỗi', 'Không thể chia sẻ story. Vui lòng thử lại sau.');
      }
      
      // ✅ Resume story nếu có lỗi
      setTimeout(() => {
        onShare(); // Gọi lại để resume
      }, 500);
    }
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
        <TouchableOpacity onPress={handleShareStory}>
          <Share2 size={25} color={'#fff'} />
        </TouchableOpacity>
        {shareCount > 0 && (
          <Text style={{color: '#fff', fontSize: 12, marginLeft: 4}}>
            {shareCount}
          </Text>
        )}
      </View>
    </View>
  );
};
