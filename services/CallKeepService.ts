import RNCallKeep from 'react-native-callkeep';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { GlobalAlertManager } from 'components/Global/AlertModal';

export const requestCallPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ];

      const checkResults = await Promise.all(
        permissions.map(permission => 
          PermissionsAndroid.check(permission)
        )
      );

      const hasAllPermissions = checkResults.every(result => result === true);
      
      if (hasAllPermissions) {
        console.log('[CallKeep] All permissions already granted');
        return true;
      }

      // Request missing permissions
      console.log('[CallKeep] Requesting permissions...');
      const requestResults = await PermissionsAndroid.requestMultiple(permissions);
      
      const granted = Object.values(requestResults).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!granted) {
        console.warn('[CallKeep] Some permissions were denied:', requestResults);
        // Show alert to user about missing permissions
        GlobalAlertManager.show(
          'Quyền bị từ chối',
          'Ứng dụng cần các quyền cuộc gọi để hoạt động đúng cách. Vui lòng cấp quyền trong Cài đặt.',
        );
      }

      return granted;
    } catch (err) {
      console.error('[CallKeep] Error requesting permissions:', err);
      return false;
    }
  }
  return true;
};

const options = {
  ios: {
    appName: 'Cirla', 
    supportsVideo: true,
    maximumCallGroups: '10',
    maximumCallsPerCallGroup: '10',
  },
  android: {
    alertTitle: 'Quyền cuộc gọi',
    alertDescription: 'Ứng dụng cần quyền truy cập cuộc gọi để hoạt động',
    cancelButton: 'Hủy',
    okButton: 'OK',
    additionalPermissions: [],
    selfManaged: true,
    foregroundService: {
      channelId: 'com.cirla.call',
      channelName: 'Cuộc gọi Cirla',
      notificationTitle: 'Cuộc gọi đang diễn ra',
      notificationIcon: 'logo_loading', 
    },
  },
};

let isSetupComplete = false;

export const setupCallKeep = async () => {
  if (isSetupComplete) {
    console.log('[CallKeep] Already setup, skipping');
    return true;
  }

  try {
    console.log('[CallKeep] Starting setup...');
    
    // Request permissions first
    const hasPermissions = await requestCallPermissions();
    if (!hasPermissions) {
      console.warn('[CallKeep] Setup aborted - missing permissions');
      return false;
    }

    // Setup CallKeep
    await RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);
    
    isSetupComplete = true;
    console.log('[CallKeep] Setup completed successfully');
    return true;
  } catch (err) {
    console.error('[CallKeep] Setup failed:', err);
    isSetupComplete = false; // Reset flag on failure
    return false;
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
  try {
    console.log(`[CallKeep] Displaying incoming call: ${name} (${handle}) UUID: ${uuid}`);
    RNCallKeep.displayIncomingCall(uuid, handle, name, 'generic', true);
  } catch (err) {
    console.error('[CallKeep] Failed to display incoming call:', err);
  }
};

export const endCall = (uuid: string) => {
  try {
    console.log(`[CallKeep] Ending call: ${uuid}`);
    RNCallKeep.endCall(uuid);
  } catch (err) {
    console.error('[CallKeep] Failed to end call:', err);
  }
};

export const startCall = (uuid: string, handle: string, name: string) => {
  try {
    console.log(`[CallKeep] Starting call: ${name} (${handle}) UUID: ${uuid}`);
    RNCallKeep.startCall(uuid, handle, name);
  } catch (err) {
    console.error('[CallKeep] Failed to start call:', err);
  }
};