import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ItemHomeStyles } from '../component_styles/ItemHomeStyles';
import { formatNumber } from '../util';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react-native';

interface ItemHomeActionsProps {
  iconColor: string;
  likedColor: string;
  bookmarkColor: string;
  isLiked: boolean;
  isBookmarked?: boolean;
  numLike: number;
  commentCount: number;
  share: number;
  onLikePress: () => void;
  onCommentPress: () => void;
  onSharePress: () => void;
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
  onLikePress,
  onCommentPress,
  onSharePress,
  onBookmarkPress,
  onReactionModalPress,
}) => {
  return (
    <View style={[ItemHomeStyles.rowContainer, { justifyContent: 'space-between' }]}>
      <View style={ItemHomeStyles.rowContainer}>
        <TouchableOpacity style={ItemHomeStyles.iconBlock} onPress={onLikePress}>
          <Heart style={ItemHomeStyles.icon} fill={isLiked ? "black" : "none"} color={iconColor}/>
        </TouchableOpacity>
        <Text
          style={{color: iconColor, marginHorizontal: 8}}
          onPress={onReactionModalPress}>
          {formatNumber(numLike)}
        </Text>
        <TouchableOpacity style={ItemHomeStyles.iconBlock} onPress={onCommentPress}>
          <MessageCircle style={ItemHomeStyles.icon} color={iconColor}/>
        </TouchableOpacity>
        <Text style={{color: iconColor, marginHorizontal: 8}}>
          {formatNumber(commentCount)}
        </Text>
        <TouchableOpacity style={ItemHomeStyles.iconBlock} onPress={onSharePress}>
          <Send style={ItemHomeStyles.icon} color={iconColor}/>
        </TouchableOpacity>
        <Text style={{color: iconColor, marginHorizontal: 8}}>
          {formatNumber(share)}
        </Text>
      </View>
      <TouchableOpacity style={ItemHomeStyles.iconBlock} onPress={onBookmarkPress}>
        <Bookmark size={27} style={ItemHomeStyles.icon} fill={isBookmarked ? bookmarkColor : "none"} color={isBookmarked ? bookmarkColor : iconColor}/>
      </TouchableOpacity>
    </View>
  );
};
