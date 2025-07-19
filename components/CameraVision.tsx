import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {
  Camera,
  useCameraDevices,
  PhotoFile,
  VideoFile,
} from 'react-native-vision-camera';
import {PermissionsAndroid} from 'react-native';
import {useCameraStyles} from '../src/StyleSheet/CameraStyles';
import LoadingModal from './Global/LoadingModal';

type CameraVisionHandle = {
  takePhoto: () => Promise<PhotoFile>;
  startRecording: (options?: {
    onRecordingError: (error: Error) => void;
    onRecordingFinished: (video: VideoFile) => void;
    [key: string]: any;
  }) => void;
  stopRecording: () => Promise<void>;
};

type CameraVisionProps = {
  style?: object;
  isActive?: boolean;
  frameProcessor?: any;
};

const CameraVision = forwardRef<CameraVisionHandle, CameraVisionProps>(
  ({style, isActive = true, frameProcessor}, ref) => {
    const cameraRef = useRef<Camera | null>(null);
    const devices = useCameraDevices();
    const styles = useCameraStyles();
    const device = devices.find(device => device.position === 'back');
    const [hasPermission, setHasPermission] = useState(false);

    useImperativeHandle(ref, () => ({
      takePhoto: async () => {
        if (!cameraRef.current) throw new Error('Camera ref not available');
        return cameraRef.current.takePhoto({flash: 'off'});
      },
      startRecording: (
        options = {
          onRecordingError: function (error: Error): void {
            throw new Error('Function not implemented.');
          },
          onRecordingFinished: function (video: VideoFile): void {
            throw new Error('Function not implemented.');
          },
        },
      ) => {
        cameraRef.current?.startRecording(options);
      },
      stopRecording: () => {
        return new Promise((resolve, reject) => {
          if (!cameraRef.current) reject(new Error('Camera ref not available'));
          cameraRef.current?.stopRecording();
          resolve();
          // the video file will be provided in the onRecordingFinished callback that was set up in startRecording
        });
      },
    }));

    // Permission handling
    async function requestCameraPermission() {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Access Required',
            message: 'This app needs to access your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // default for iOS, hopefully works since i don't use ioshit
    }

    useEffect(() => {
      (async () => {
        try {
          // use the native permission API for Android
          const androidPermission = await requestCameraPermission();

          // use the Camera API's methods without directly comparing status values
          let iosCameraPermission = true;

          if (Platform.OS === 'ios') {
            // for iOS, request permission without comparing enum values
            await Camera.requestCameraPermission();
            // assume success if no error is thrown, thus avoids the type comparison issue
          }

          setHasPermission(androidPermission && iosCameraPermission);
        } catch (error) {
          console.error('Error requesting camera permission:', error);
          setHasPermission(false);
        }
      })();
    }, []);

    if (!device || !hasPermission) {
      return (
        <View style={[styles.loaderContainer, style]}>
          <LoadingModal />
        </View>
      );
    }

    return (
      <View style={[styles.cameraPreviewContainer, style]}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          photo={true}
          video={true}
          audio={true}
          frameProcessor={frameProcessor}
        />
      </View>
    );
  },
);

export type {CameraVisionHandle};
export default CameraVision;
