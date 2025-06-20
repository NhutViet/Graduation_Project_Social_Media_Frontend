import { useMemo } from 'react';
import { Colors } from '../../../../assets/color/Colors';
import { ItemHomeProps } from '../types';
import { useTheme } from '../../../util/ThemeContext';

export const useItemHomeUtils = (props: ItemHomeProps, state: any) => {
  const { type, _id } = props;
  const { isLiked, isBookmark, followers, following } = state;
  
  const {theme} = useTheme();
  const color = Colors[theme];
  const isReel = type === 'reel';
  const textColor = isReel ? Colors.dark.text : color.text;
  const borderColor = isReel ? Colors.light.background : color.text;
  const iconTintColor = isReel ? Colors.light.background : color.text;
  const iconColor = color.text;
  const likedColor = isLiked ? color.error : iconColor;
  const bookmarkColor = isBookmark ? '#F2C641' : iconColor;

  const follows = useMemo(() => {
    const allUsers = [...followers, ...following];
    const uniqueUsers = allUsers.filter(
      (user, index, self) => index === self.findIndex(u => u._id === user._id)
    );

    return uniqueUsers.map(user => ({
      _id: user._id,
      name: user.username,
      avatar: user.profilePic,
    }));
  }, [followers, following]);

  return {
    color,
    isReel,
    textColor,
    borderColor,
    iconTintColor,
    iconColor,
    likedColor,
    bookmarkColor,
    follows,
  };
};