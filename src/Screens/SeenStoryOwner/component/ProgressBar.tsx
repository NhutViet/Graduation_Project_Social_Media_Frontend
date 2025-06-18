import React, {useRef} from 'react';
import {View, Animated} from 'react-native';
import {styles} from './style';

interface ProgressBarProps {
  progressAnim: Animated.Value;
}

export const ProgressBar = ({progressAnim}: ProgressBarProps) => {
  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarWrapper}>
        <Animated.View
          style={[styles.progressBar, {width, backgroundColor: '#fff'}]}
        />
      </View>
    </View>
  );
};
