import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {ItemHomeStyles} from '../component_styles/ItemHomeStyles';
import {formatNumber} from '../util';

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
    <View style={[ItemHomeStyles.rowBottom, {justifyContent: 'space-between'}]}>
      <View style={ItemHomeStyles.rowBottom}>
        <TouchableOpacity
          style={ItemHomeStyles.iconBlock}
          onPress={onLikePress}>
          <Image
            style={[{tintColor: likedColor}, ItemHomeStyles.icon]}
            source={
              isLiked
                ? require('../../../../assets/icon/heart_fill.png')
                : require('../../../../assets/icon/heart.png')
            }
          />
        </TouchableOpacity>
        <Text
          style={{color: iconColor, marginHorizontal: 8}}
          onPress={onReactionModalPress}>
          {formatNumber(numLike)}
        </Text>
        <TouchableOpacity
          style={ItemHomeStyles.iconBlock}
          onPress={onCommentPress}>
          <Image
            style={[{tintColor: iconColor}, ItemHomeStyles.icon]}
            source={require('../../../../assets/icon/comment.png')}
          />
        </TouchableOpacity>
        <Text style={{color: iconColor, marginHorizontal: 8}}>
          {formatNumber(commentCount)}
        </Text>
        <TouchableOpacity
          style={ItemHomeStyles.iconBlock}
          onPress={onSharePress}>
          <Image
            style={[{tintColor: iconColor}, ItemHomeStyles.icon]}
            source={require('../../../../assets/icon/share.png')}
          />
        </TouchableOpacity>
        <Text style={{color: iconColor, marginHorizontal: 8}}>
          {formatNumber(share)}
        </Text>
      </View>
      <TouchableOpacity
        style={ItemHomeStyles.iconBlock}
        onPress={onBookmarkPress}>
        <Image
          style={[{tintColor: bookmarkColor}, ItemHomeStyles.icon]}
          source={
            isBookmarked
              ? require('../../../../assets/icon/bookmark_fill.png')
              : require('../../../../assets/icon/bookmark.png')
          }
        />
      </TouchableOpacity>
    </View>
  );
};
