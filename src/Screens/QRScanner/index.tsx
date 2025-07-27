import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCodeScanner,
  getCameraDevice,
  Code,
} from 'react-native-vision-camera';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {unwrapResult} from '@reduxjs/toolkit';
import {validateUserId} from '@services/userRedux/userSlice';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {ArrowLeft} from 'lucide-react-native';

const {width, height} = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;
const COOLDOWN_TIME = 10000;

export const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [canScan, setCanScan] = useState(true);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);
  const devices = useCameraDevices();
  const device = getCameraDevice(devices, 'back');
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const myUserId = useSelector((s: RootState) => s.user.user?._id);
  const isFocused = useIsFocused();
  const didHandleScanRef = useRef(false);

  // Vùng quét
  const scanArea = {
    x: (width - SCAN_AREA_SIZE) / 2,
    y: (height - SCAN_AREA_SIZE) / 2,
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
  };

  const startCooldown = () => {
    setCanScan(false);
    cooldownTimer.current = setTimeout(() => setCanScan(true), COOLDOWN_TIME);
  };
  const resetCooldown = () => {
    cooldownTimer.current && clearTimeout(cooldownTimer.current);
    setCanScan(true);
  };

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) {
        clearTimeout(cooldownTimer.current);
        cooldownTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isFocused) didHandleScanRef.current = false;
  }, [isFocused]);

  const isInArea = (bounds: Code['frame'] | undefined) => {
    if (!bounds) return false;
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;
    return (
      cx >= scanArea.x &&
      cx <= scanArea.x + scanArea.width &&
      cy >= scanArea.y &&
      cy <= scanArea.y + scanArea.height
    );
  };

  useEffect(() => {
    (async () => {
      let granted = false;

      if (Platform.OS === 'android') {
        const androidRes = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        granted = androidRes === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // iOS: get current status
        const status0 = await Camera.getCameraPermissionStatus();
        let status: any = status0;

        if (status === 'not-determined') {
          status = (await Camera.requestCameraPermission()) as
            | 'not-determined'
            | 'denied'
            | 'authorized';
        }

        granted = status === 'authorized';
      }

      setHasPermission(granted);
    })();
  }, []);

  const onCodeScanned = (codes: Code[]) => {
    if (!canScan || !codes.length || didHandleScanRef.current) return;

    const {value, frame} = codes[0];
    if (!value || !isInArea(frame)) return;

    didHandleScanRef.current = true;
    startCooldown();

    // 1) Nếu là URL, mở link
    if (/^https?:\/\//i.test(value)) {
      Linking.openURL(value).catch(() =>
        GlobalAlertManager.show(
          'Lỗi',
          'Không mở được liên kết.',
          resetCooldown,
        ),
      );
      return;
    }

    // 2) Nếu quét chính mình
    if (value === myUserId) {
      GlobalAlertManager.show(
        'Lỗi',
        'Bạn không thể quét mã QR của chính mình',
        resetCooldown,
      );
      return;
    }

    // 3) Còn lại coi như userId
    dispatch(validateUserId({userId: value}))
      .then(unwrapResult)
      .then(payload => {
        if (payload.success) {
          GlobalAlertManager.show(
            'Tìm thấy người dùng',
            payload.message,
            () => {
              navigation.navigate('ProfileComp', {userID: value});
              resetCooldown();
            },
          );
        } else {
          resetCooldown();
        }
      })
      .catch(err => {
        const msg =
          err.payload?.message || err.message || 'Lỗi xác thực người dùng';
        GlobalAlertManager.show('Lỗi', msg, resetCooldown);
      });
  };

  const codeScanner = useCodeScanner({onCodeScanned, codeTypes: ['qr']});

  if (!device || !hasPermission) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />

      <View style={styles.overlay}>
        <View
          style={[
            styles.scanArea,
            {width: SCAN_AREA_SIZE, height: SCAN_AREA_SIZE},
          ]}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Nút back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {position: 'relative'},
  corner: {position: 'absolute', width: 30, height: 30, borderColor: '#fff'},
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
  },
});
