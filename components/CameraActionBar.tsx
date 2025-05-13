import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useCameraStyles } from '../src/StyleSheet/CameraStyles';

export type ActionBarProps = {
  mode: string;
  onCapture: () => void;
  onStop: () => void;
  onLeft1?: () => void;
  onLeft2?: () => void;
  onRight1?: () => void;
  onRight2?: () => void;
};

const ActionBar: React.FC<ActionBarProps> = ({
  mode,
  onCapture,
  onStop,
  onLeft1,
  onLeft2,
  onRight1,
  onRight2,
}) => {
  const isRecording = mode === 'Video';
  const styles = useCameraStyles();

  return (
    <View style={styles.actionBarContainer}>
      <TouchableOpacity style={styles.sideButton} onPress={onLeft1}>
        <Image source={require('../assets/icon/square.png')} style={styles.sideButton}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sideButton} onPress={onLeft2}>
        <Image source={require('../assets/icon/lightning.png')} style={styles.sideButton}/>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.captureButton, isRecording && styles.captureButtonRecording]}
        onPress={isRecording ? onStop : onCapture}
      >
        <View style={[styles.captureInner, isRecording && styles.captureInnerRecording]} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.sideButton} onPress={onRight1}>
        <Image source={require('../assets/icon/remix.png')} style={styles.sideButton}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sideButton} onPress={onRight2}>
        <Image source={require('../assets/icon/smiley.png')} style={styles.sideButton}/>
      </TouchableOpacity>
    </View>
  );
};

export default ActionBar;