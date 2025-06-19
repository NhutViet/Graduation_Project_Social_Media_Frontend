import React from 'react';
import {Animated, View} from 'react-native';
import {styles} from './styles';

export const ProgressBar = ({progressAnims, storyCount}: any) => {
  return (
    <View style={styles.progressContainer}>
      {Array.from({length: storyCount}, (_, index) => {
        const progressAnim = progressAnims[index];
        if (!progressAnim) return null; // Tránh lỗi nếu index không hợp lệ
        const width = progressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        });
        return (
          <View key={index} style={styles.progressBarWrapper}>
            <Animated.View style={[styles.progressBar, {width}]} />
          </View>
        );
      })}
    </View>
  );
};
