import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useCameraStyles} from '../src/StyleSheet/CameraStyles';
import {Square, Zap, Repeat, Smile} from 'lucide-react-native';

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
        <Square size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sideButton} onPress={onLeft2}>
        <Zap size={22} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.captureButton,
          isRecording && styles.captureButtonRecording,
        ]}
        onPress={isRecording ? onStop : onCapture}>
        <View
          style={[
            styles.captureInner,
            isRecording && styles.captureInnerRecording,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.sideButton} onPress={onRight1}>
        <Repeat size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sideButton} onPress={onRight2}>
        <Smile size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ActionBar;
