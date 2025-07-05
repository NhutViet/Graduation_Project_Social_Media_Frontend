import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Colors} from '../../assets/color/Colors';
export const HASHTAG_REGEX = /(^|\s)(#\w+)\b/g;

/**
 * Checks if a given text contains hashtags
 * @param text - The text to check for hashtags
 * @returns boolean - True if text contains hashtags, false otherwise
 */
export const hasHashtags = (text: string): boolean => {
  if (!text || text.trim() === '') return false;
  return HASHTAG_REGEX.test(text);
};

/**
 * Extracts all hashtags from a given text
 * @param text - The text to extract hashtags from
 * @returns string[] - Array of hashtags found in the text
 */
export const extractHashtags = (text: string): string[] => {
  if (!text || text.trim() === '') return [];
  const matches = text.match(HASHTAG_REGEX);
  return matches ? matches.map(match => match.trim()) : [];
};

/**
 * Counts the number of hashtags in a text
 * @param text - The text to count hashtags in
 * @returns number - Number of hashtags found
 */
export const countHashtags = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  const matches = text.match(HASHTAG_REGEX);
  return matches ? matches.length : 0;
};

/**
 * Validates if a string is a valid hashtag
 * @param hashtag - The string to validate
 * @returns boolean - True if valid hashtag, false otherwise
 */
export const isValidHashtag = (hashtag: string): boolean => {
  if (!hashtag || hashtag.trim() === '') return false;
  return /^#\w+$/.test(hashtag.trim());
};

export const renderTextWithPressableHashtags = (
  text: string,
  navigation: any,
  options?: {
    textColor?: string;
    hashtagColor?: string;
    baseStyle?: object;
    hashtagStyle?: object;
    posts?: any[];
    reels?: any[];
  }
): React.ReactElement | null => {
  if (!text || text.trim() === '') return null;

  const {
    textColor = Colors.dark.text,
    hashtagColor = Colors.hashtag,
    baseStyle = {},
    hashtagStyle = {},
    posts = [],
    reels = [],
  } = options || {};

  const handleHashtagPress = (hashtag: string) => {
    console.log("hashtag pressed: ", hashtag)
    const cleanTag = hashtag.replace('#', '').toLowerCase();
    const allItems = [...posts, ...reels];
    const filtered = allItems.filter(item => {
      const caption: string = item.caption || '';
      if (!hasHashtags(caption)) return false;
      const hashtags = extractHashtags(caption);
      return hashtags.some(tag =>
        tag.replace('#', '').toLowerCase() === cleanTag
      );
    });
    if (filtered.length > 0) {
      navigation.navigate('AllPostOfCollection', {
        posts: filtered,
        targetPostId: filtered[0]._id,
        playlistName: hashtag,
      });
    }
  };

  const parts = text.split(HASHTAG_REGEX);
  const elements: React.ReactElement[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.match(/^#\w+$/)) {
      // Hashtag: TouchableOpacity wrapping Text
      elements.push(
        React.createElement(
          TouchableOpacity,
          {
            key: i,
            onPress: () => handleHashtagPress(part),
            activeOpacity: 0.7,
          },
          React.createElement(
            Text,
            { style: [{ color: hashtagColor }, hashtagStyle] },
            part
          )
        )
      );
    } else if (part) {
      // Regular text
      elements.push(
        React.createElement(
          Text,
          { key: i, style: [{ color: textColor }, baseStyle] },
          part
        )
      );
    }
  }

  return React.createElement(Text, { style: baseStyle }, ...elements);
};