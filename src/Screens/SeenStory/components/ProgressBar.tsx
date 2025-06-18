import React from 'react';
import {Animated, View} from 'react-native';
import {styles} from './styles';

export const ProgressBar = ({progressAnim}: {progressAnim: Animated.Value}) => {
  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarWrapper}>
        <Animated.View style={[styles.progressBar, {width}]} />
      </View>
    </View>
  );
};
