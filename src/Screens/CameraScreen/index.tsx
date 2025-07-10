import React, { useRef, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import CameraVision, { CameraVisionHandle } from '../../../components/CameraVision';
import ActionBar from '../../../components/CameraActionBar';
import ModeSelector from '../../../components/CameraModeSelector';
import { useCameraStyles } from '../../../src/StyleSheet/CameraStyles';

const modes = ['Bình thường', 'Chân dung', 'Video', 'Toàn cảnh'];

export const CameraScreen = ({ navigation, onBack }: {navigation: any, onBack: () => void}) => {
  const cameraRef = useRef<CameraVisionHandle>(null);
  const [mode, setMode] = useState<string>('Bình thường');
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const styles = useCameraStyles();

  const handleCapture = async () => {
    try {
      if (mode === 'Video') {
        cameraRef.current?.startRecording({
          onRecordingFinished: video => {
            setPreviewUri(video.path);
          },
          onRecordingError: error => {
            console.error(error);
          },
        });
      } else {
        const photo = await cameraRef.current?.takePhoto();
        if (photo?.path) setPreviewUri(photo.path);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStop = async () => {
    await cameraRef.current?.stopRecording();
  };

  const handleClosePreview = () => {
    setPreviewUri(null);
  };

  return (
    <View style={styles.cameraContainer}>
      {!previewUri ? (
        <>
          <CameraVision ref={cameraRef} style={styles.preview} />
            <View style={styles.topBar}>
            <TouchableOpacity onPress={onBack}>
              <Image
                source={require('../../../assets/icon/left.png')}
                style={styles.topIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {/* TODO: brightness control */}}>
              <Image
                source={require('../../../assets/icon/sun.png')}
                style={styles.topIcon}
              />
            </TouchableOpacity>
          </View>
          <ModeSelector
            modes={modes}
            selected={mode}
            onSelect={setMode}
          />
          <ActionBar
            mode={mode}
            onCapture={handleCapture}
            onStop={handleStop}
            onLeft1={() => {}}
            onLeft2={() => {}}
            onRight1={() => {}}
            onRight2={() => {}}
          />
        </>
      ) : (
        <TouchableOpacity style={styles.preview} onPress={handleClosePreview}>
          <Image source={{ uri: previewUri }} style={styles.preview} resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
}