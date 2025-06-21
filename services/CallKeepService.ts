import RNCallKeep from 'react-native-callkeep';
import { PermissionsAndroid, Platform } from 'react-native';

export const requestCallPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    ]);

    return Object.values(granted).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

const options = {
  ios: {
    appName: 'ZegoApp',
  },
  android: {
    alertTitle: 'Quyền cuộc gọi',
    alertDescription: 'Ứng dụng cần quyền truy cập cuộc gọi để hoạt động',
    cancelButton: 'Hủy',
    okButton: 'OK',
    additionalPermissions: [],
    foregroundService: {
      channelId: 'com.zego.call',
      channelName: 'Cuộc gọi',
      notificationTitle: 'Cuộc gọi đang diễn ra',
    },
  },
};

export const setupCallKeep = () => {
  try {
    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);
  } catch (err) {
    console.error('CallKeep setup failed', err);
  }
};

export const showIncomingCall = ({
  uuid,
  handle,
  name,
}: {
  uuid: string;
  handle: string;
  name: string;
}) => {
  RNCallKeep.displayIncomingCall(uuid, handle, name);
};
