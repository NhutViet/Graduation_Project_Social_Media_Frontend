import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface MentionData {
  handleName: string;
  _id: string;
}

export const parseMentionsInText = (
  text: string, 
  mentionData: MentionData[],
  onMentionPress: (userId: string) => void,
  textStyle?: any,
  mentionStyle?: any
) => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const regex = /@([a-zA-Z0-9._]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        React.createElement(Text, { key: key++, style: textStyle },
          text.substring(lastIndex, match.index)
        )
      );
    }

    const mention = match[0];
    const handleName = match[1];

    const userData = mentionData.find(user => 
      user.handleName.toLowerCase() === handleName.toLowerCase()
    );

    if (userData) {
      parts.push(
        React.createElement(TouchableOpacity, 
          { 
            key: key++, 
            onPress: () => onMentionPress(userData._id),
            activeOpacity: 0.7 
          },
          React.createElement(Text, 
            { style: [textStyle, mentionStyle, { color: '#4A90E2' }] },
            mention
          )
        )
      );
    } else {
      parts.push(
        React.createElement(Text, 
          { key: key++, style: [textStyle, { color: '#888' }] },
          mention
        )
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      React.createElement(Text, { key: key++, style: textStyle },
        text.substring(lastIndex)
      )
    );
  }

  return parts;
};

export const extractMentionsFromText = (text: string): string[] => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const regex = /@([a-zA-Z0-9._]+)/g;
  const mentions: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
}; 