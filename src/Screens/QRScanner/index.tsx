import React, { useState, useEffect, useRef } from 'react';
import { Alert, StyleSheet, View, Platform, PermissionsAndroid, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Camera, useCameraDevices, useCodeScanner, getCameraDevice, Code } from 'react-native-vision-camera';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;
const COOLDOWN_TIME = 10000;

interface ScanAreaType {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CodeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState<Boolean>(false);
  const [canScan, setCanScan] = useState<boolean>(true);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);
  const devices = useCameraDevices();
  const device = getCameraDevice(devices, "back");
  const navigation: any = useNavigation();

  const scanArea: ScanAreaType = {
    x: (width - SCAN_AREA_SIZE) / 2,
    y: (height - SCAN_AREA_SIZE) / 2,
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
  };

  const resetCooldown = () => {
    if (cooldownTimer.current) {
      clearTimeout(cooldownTimer.current);
      cooldownTimer.current = null;
    }
    setCanScan(true);
  };

  const startCooldown = () => {
    setCanScan(false);
    cooldownTimer.current = setTimeout(() => {
      setCanScan(true);
    }, COOLDOWN_TIME);
  };

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) {
        clearTimeout(cooldownTimer.current);
      }
    };
  }, []);

  const isCodeInScanArea = (bounds: CodeBounds | undefined): boolean => {
    if (!bounds) return false;
    
    const codeCenter = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };
    
    return (
      codeCenter.x >= scanArea.x &&
      codeCenter.x <= scanArea.x + scanArea.width &&
      codeCenter.y >= scanArea.y &&
      codeCenter.y <= scanArea.y + scanArea.height
    );
  };

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
    return true;
  }
  
      useEffect(() => {
        (async () => {
          try {
            const androidPermission = await requestCameraPermission();
            
            let iosCameraPermission = true;
            
            if (Platform.OS === 'ios') {
              await Camera.requestCameraPermission();
            }
            
            setHasPermission(androidPermission && iosCameraPermission);
          } catch (error) {
            console.error('Error requesting camera permission:', error);
            setHasPermission(false);
          }
        })();
      }, []);

  const codeScanner = useCodeScanner({
    onCodeScanned: (codes: Code[]) => {
      if (!canScan  || codes.length === 0) return;
      
      const qrCode = codes[0];
      const codeValue = qrCode.value;
      const codeBounds = qrCode.frame;
      
      if (codeValue && isCodeInScanArea(codeBounds)) {

        startCooldown();
        
        // thực hiện chức năng sau khi quét QR code ở đây, sau khi xong thêm dòng resetCooldown(); như mẫu alert dưới

        Alert.alert('QR Code Detected', codeValue, [
          { 
            text: 'OK', 
            onPress: () => {
              resetCooldown();
            }
          }
        ]);
        

        console.log('QR Code scanned:', codeValue);
      }
    },
    codeTypes: ['qr'],
  });

  if (!device || !hasPermission) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      <LinearGradient
        colors={[
          'rgba(14,129,255,0.6)',   
          'rgba(203,218,255, 0.6)', 
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => {
          navigation.goBack();
      }}>
        <Image source={require('../../../assets/icon/left.png')} style={styles.buttonImage}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.libraryButton}>
        
      </TouchableOpacity>
      <View style={styles.overlay}>
        <View style={[styles.scanArea, { width: SCAN_AREA_SIZE, height: SCAN_AREA_SIZE }]}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
  },
  topLeft: {
    top: -2, 
    left: -2, 
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10
  },
  backButton: {
    position: 'absolute',
    top: 50, 
    left: 20, 
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  libraryButton: {
    position: 'absolute',
    top: 50, 
    right: 20, 
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
  },
  buttonImage: {
    tintColor: '#fff',
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
})