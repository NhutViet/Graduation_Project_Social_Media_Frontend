import React, {useMemo, useCallback} from 'react';
import {Text, TextStyle, StyleProp} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSearchPost} from '../services/searchRedux/searchSlice';
import {AppDispatch, RootState} from '../services/store';
import {Colors} from '../assets/color/Colors';
import {fetchUserIdByHandleName} from '@services/userRedux/userSlice';
import {GlobalAlertManager} from './Global/AlertModal';
import {useTheme} from '../src/util/ThemeContext';

export interface HashtagTextProps {
  text: string;
  clickable?: boolean;
  textColor?: string;
  hashtagColor?: string;
  baseStyle?: StyleProp<TextStyle>;
  hashtagStyle?: StyleProp<TextStyle>;
  navigation?: any;
  setSkipReload?: (skip: boolean) => void;
}

const HashtagText: React.FC<HashtagTextProps> = ({
  text,
  clickable = true,
  textColor,
  hashtagColor = Colors.hashtag,
  baseStyle,
  hashtagStyle,
  navigation,
  setSkipReload,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const dispatch = useDispatch<AppDispatch>();
  const {refreshToken} = useSelector((state: RootState) => state.user);
  const userId = useSelector((state: RootState) => state.user?.user?._id);

  const tokens = useMemo(() => {
    const result: Array<{text: string; type: 'plain' | 'hashtag' | 'mention'}> =
      [];
    const regex = /(@\w+|#\w+)|([^@#\s]+|\s+)/g;
    const matches = text.matchAll(regex);

    for (const match of matches) {
      const full = match[0];
      if (!full) continue;

      if (/^#\w+/.test(full)) {
        result.push({text: full, type: 'hashtag'});
      } else if (/^@\w+/.test(full)) {
        result.push({text: full, type: 'mention'});
      } else {
        result.push({text: full, type: 'plain'});
      }
    }

    return result;
  }, [text]);

  const onPressTag = useCallback(
    (tag: string) => {
      if (!clickable) return;

      if (setSkipReload) setSkipReload(true);

      const cleanTag = tag;
      dispatch(fetchSearchPost({refreshToken, keyword: cleanTag}))
        .unwrap()
        .then(resp => {
          const postsItems = resp.posts?.items || [];
          const reelsItems = resp.reels?.items || [];
          const combined = [...postsItems, ...reelsItems];
          navigation.navigate('AllPostOfCollection', {
            posts: combined,
            targetPostId: combined[0]?._id,
            playlistName: cleanTag,
            clickableHashtag: false,
            clearSearchRedux: false,
          });
        })
        .catch(error => {
          if (setSkipReload) setSkipReload(false);
          console.error('Error fetching hashtag posts:', error);
        });
    },
    [dispatch, navigation, clickable, refreshToken, setSkipReload],
  );

  const onPressMention = useCallback(
    async (mention: string) => {
      const handleName = mention.replace('@', '');
      try {
        const result = await dispatch(fetchUserIdByHandleName({handleName}));

        if (fetchUserIdByHandleName.fulfilled.match(result)) {
          const mentionedUserId = result.payload.userId;
          
          // Check if mentioned user is the current user
          if (mentionedUserId === userId) {
            navigation.navigate('Account');
          } else {
            navigation.navigate('ProfileComp', {userID: mentionedUserId});
          }
        } else {
          GlobalAlertManager.show('Lỗi', 'Không tìm thấy người dùng');
        }
      } catch (error) {
        GlobalAlertManager.show('Lỗi', 'Lỗi khi chuyển trang người dùng');
      }
    },
    [dispatch, navigation, userId],
  );

  return (
    <Text style={baseStyle}>
      {tokens.map((tok, i) => {
        if (tok.type === 'hashtag') {
          return (
            <Text
              key={i}
              onPress={clickable ? () => onPressTag(tok.text) : undefined}
              style={[hashtagStyle, {color: hashtagColor}]}>
              {tok.text}
            </Text>
          );
        } else if (tok.type === 'mention') {
          return (
            <Text
              key={i}
              style={{color: color.text, fontWeight: 'bold', fontSize: 14}}
              onPress={() => onPressMention(tok.text)}>
              {tok.text}
            </Text>
          );
        } else {
          return (
            <Text key={i} style={baseStyle}>
              {tok.text}
            </Text>
          );
        }
      })}
    </Text>
  );
};

export default HashtagText;