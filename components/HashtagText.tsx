import React, { useMemo, useCallback } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchPost } from '../services/searchRedux/searchSlice';
import {AppDispatch, RootState} from '../services/store';
import { Colors } from '../assets/color/Colors';

export interface HashtagTextProps {
  text: string;
  clickable?: boolean;
  textColor?: string;
  hashtagColor?: string;
  baseStyle?: StyleProp<TextStyle>;
  hashtagStyle?: StyleProp<TextStyle>;
  setSkipReload?: (skip: boolean) => void;
}

const HashtagText: React.FC<HashtagTextProps> = ({
  text,
  clickable = true,
  textColor,
  hashtagColor = Colors.hashtag,
  baseStyle,
  hashtagStyle,
  setSkipReload,
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { refreshToken } = useSelector((state: RootState) => state.user);

  // Split text into tokens: hashtags or plain
  const tokens = useMemo(() => {
    const result: Array<{ text: string; isTag: boolean }> = [];
    
    // Use matchAll with a fresh regex instance each time
    const hashtagRegex = /(^|\s)(#\w+)\b/g;
    const matches = Array.from(text.matchAll(hashtagRegex));
    
    let lastIndex = 0;
    
    for (const match of matches) {
      const matchIndex = match.index!;
      const fullMatch = match[0];
      const prefix = match[1];
      const hashtag = match[2];
      
      // Add text before the match
      if (matchIndex > lastIndex) {
        result.push({ text: text.slice(lastIndex, matchIndex), isTag: false });
      }
      
      // Add the prefix (whitespace, but not if it's start of string)
      if (prefix && prefix !== '') {
        result.push({ text: prefix, isTag: false });
      }
      
      // Add the hashtag itself
      result.push({ text: hashtag, isTag: true });
      
      // Update lastIndex to after the full match
      lastIndex = matchIndex + fullMatch.length;
    }
    
    // Add trailing text
    if (lastIndex < text.length) {
      result.push({ text: text.slice(lastIndex), isTag: false });
    }
    
    return result;
  }, [text]);

  const onPressTag = useCallback((tag: string) => {
    if (!clickable) return;
    
    // Set skip reload flag before navigation
    if (setSkipReload) {
      setSkipReload(true);
    }
    
    const cleanTag = tag;
    dispatch(fetchSearchPost({ refreshToken, keyword: cleanTag }))
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
        // Reset skip reload flag if navigation fails
        if (setSkipReload) {
          setSkipReload(false);
        }
        console.error('Error fetching hashtag posts:', error);
      });
  }, [dispatch, navigation, clickable, refreshToken, setSkipReload]);

  // If no hashtags exist, render plain text block
  if (!/(^|\s)(#\w+)\b/.test(text)) {
    return <Text style={baseStyle}>{text}</Text>;
  }

  return (
    <Text style={baseStyle}>
      {tokens.map((tok, i) =>
        tok.isTag ? (
          <Text
            key={i}
            onPress={clickable ? () => onPressTag(tok.text) : undefined}
            style={[hashtagStyle, {color: Colors.hashtag}]}
          >
            {tok.text}
          </Text>
        ) : (
          <Text key={i} style={baseStyle}>
            {tok.text}
          </Text>
        )
      )}
    </Text>
  );
};

export default HashtagText;