import React, {useRef, useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {
  Camera,
  useCameraDevices,
  PhotoFile,
  CameraPermissionStatus,
} from 'react-native-vision-camera';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ArrowLeft, Circle} from 'lucide-react-native';
import {RootStackParamList} from '../../../src/Navigation/AppNavigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

type CameraScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CameraScreen'
>;

export const CameraScreen = () => {
  const camera = useRef<Camera>(null);
  const route = useRoute<RouteProp<RootStackParamList, 'CameraScreen'>>();
  const {roomId} = route.params;
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const permission: CameraPermissionStatus =
        await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    };
    checkPermission();
  }, []);

  const handleCapture = async () => {
    try {
      if (camera.current == null) return;

      const photo: PhotoFile = await camera.current.takePhoto({
        flash: 'off',
      });

      navigation.navigate('CameraPreview', {
        uri: `file://${photo.path}`,
        roomId: roomId,
      });
    } catch (e) {
      console.error('Error capturing photo:', e);
      GlobalAlertManager.show('Lỗi', 'Không thể chụp ảnh');
    }
  };

  if (!device || !hasPermission) {
    return <View style={styles.cameraContainer} />;
  }

  return (
    <View style={styles.cameraContainer}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <Circle size={64} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  topBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
