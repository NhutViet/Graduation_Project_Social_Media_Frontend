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
  likeDisabled?: boolean;
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
  likeDisabled = false, 
  onLikePress,
  onCommentPress,
  onSharePress,
  onBookmarkPress,
  onReactionModalPress,
}) => {
  return (
    <View
      style={[ItemHomeStyles.rowContainer, { justifyContent: 'space-between' }]}
    >
      <View style={ItemHomeStyles.rowContainer}>
        <TouchableOpacity
          style={[ItemHomeStyles.iconBlock, { opacity: likeDisabled ? 0.5 : 1 }]}
          onPress={onLikePress}
          disabled={likeDisabled} // ignore taps when loading
        >
          <Image
            style={[{ tintColor: likedColor }, ItemHomeStyles.icon]}
            source={
              isLiked
                ? require('../../../../assets/icon/heart_fill.png')
                : require('../../../../assets/icon/heart.png')
            }
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onReactionModalPress}>
          <Text style={{ color: iconColor, marginLeft: 8, marginRight: 16 }}>
            {formatNumber(numLike)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={ItemHomeStyles.iconBlock}
          onPress={onCommentPress}
        >
          <Image
            style={[{ tintColor: iconColor }, ItemHomeStyles.icon]}
            source={require('../../../../assets/icon/comment.png')}
          />
        </TouchableOpacity>
        <Text style={{ color: iconColor, marginLeft: 8, marginRight: 16 }}>
          {formatNumber(commentCount)}
        </Text>

        <TouchableOpacity
          style={ItemHomeStyles.iconBlock}
          onPress={onSharePress}
        >
          <Image
            style={[{ tintColor: iconColor }, ItemHomeStyles.icon]}
            source={require('../../../../assets/icon/share.png')}
          />
        </TouchableOpacity>
        <Text style={{ color: iconColor, marginLeft: 8, marginRight: 16 }}>
          {formatNumber(share)}
        </Text>
      </View>

      <TouchableOpacity
        style={ItemHomeStyles.iconBlock}
        onPress={onBookmarkPress}
      >
        <Image
          style={[{ tintColor: bookmarkColor }, ItemHomeStyles.icon]}
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
