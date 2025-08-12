import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ItemHomeStyles} from '../component_styles/ItemHomeStyles';
import {formatNumber} from '../util';
import {
  Heart,
  HeartIcon,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
} from 'lucide-react-native';
import {Share} from 'react-native';

interface ItemHomeActionsProps {
  iconColor: string;
  likedColor: string;
  bookmarkColor: string;
  isLiked: boolean;
  isBookmarked?: boolean;
  numLike: number;
  commentCount: number;
  share: number;
  shareUrl?: string;
  likeDisabled?: boolean;
  onLikePress: () => void;
  onCommentPress: () => void;
  onBookmarkPress: () => void;
  onReactionModalPress: () => void;
}

export const ItemHomeActions: React.FC<ItemHomeActionsProps> = ({
  iconColor,
  likedColor,
  bookmarkColor,
  isLiked,
  isBookmarked,
  numLike,
  commentCount,
  share,
  shareUrl = '',
  likeDisabled = false,
  onLikePress,
  onCommentPress,
  onBookmarkPress,
  onReactionModalPress,
}) => {
  return (
    <View
      style={[ItemHomeStyles.rowContainer, {justifyContent: 'space-between'}]}>
      <View style={ItemHomeStyles.rowContainer}>
        {/* Like */}
        <TouchableOpacity
          style={[ItemHomeStyles.iconBlock, {opacity: likeDisabled ? 0.5 : 1}]}
          onPress={onLikePress}
          disabled={likeDisabled}>
          {isLiked ? (
            <HeartIcon size={22} color={likedColor} fill={likedColor} />
          ) : (
            <Heart size={22} color={likedColor} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onReactionModalPress}>
          <Text style={{color: iconColor, marginLeft: 8, marginRight: 16}}>
            {formatNumber(numLike)}
          </Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity
          style={ItemHomeStyles.iconBlock}
          onPress={onCommentPress}>
          <MessageCircle size={22} color={iconColor} />
        </TouchableOpacity>
        <Text style={{color: iconColor, marginLeft: 8, marginRight: 16}}>
          {formatNumber(commentCount)}
        </Text>

        {/* Share */}
        <TouchableOpacity
          style={ItemHomeStyles.iconBlock}
          onPress={async () => {
            try {
              await Share.share({message: shareUrl});
            } catch (err) {
              console.error('Error sharing:', err);
            }
          }}>
          <Share2 size={22} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Bookmark */}
      <TouchableOpacity
        style={ItemHomeStyles.iconBlock}
        onPress={onBookmarkPress}>
        {isBookmarked ? (
          <BookmarkCheck size={22} color={bookmarkColor} fill={bookmarkColor} />
        ) : (
          <Bookmark size={22} color={bookmarkColor} />
        )}
      </TouchableOpacity>
    </View>
  );
};
