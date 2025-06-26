import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './Navigation/AppNavigation';
import {ThemeProvider} from './util/ThemeContext';
import {Host} from 'react-native-portalize';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'fast-text-encoding';
import {Provider} from 'react-redux';
import {persistor, store} from '../services/store';
import {PersistGate} from 'redux-persist/integration/react';
import {UploadProvider} from '../services/UploadProgressManager';
import Toast from 'react-native-toast-message';
import {Buffer} from 'buffer';
import {TabLoadingProvider} from '../services/TabLoadingContext';
import {SocketProvider} from '../services/SocketContext';
import {KeyboardAvoidingView, PermissionsAndroid, Platform} from 'react-native';
import {
  GlobalAlert,
  GlobalAlertManager,
  GlobalAlertRef,
} from '../components/Global/AlertModal';
import NotificationManager from '@services/NotificationManager';
global.Buffer = Buffer;
if (__DEV__) {
  import('./config/ReactotronConfig').then(() =>
    console.tron.log('Reactotron Configured ✅'),
  );
}
enableScreens();

const App = () => {
  const handleAlertRef = (ref: GlobalAlertRef | null) => {
    if (ref) {
      GlobalAlertManager.setAlertRef(ref);
    }
  };

  useEffect(() => {
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('🔕 Người dùng từ chối quyền thông báo');
      } else {
        console.log('✅ Đã được cấp quyền thông báo');
      }
    }
  };

  requestNotificationPermission();
}, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SocketProvider>
            <NotificationManager />
            <ThemeProvider>
              <KeyboardAvoidingView style={{flex: 1}}>
                <SafeAreaProvider>
                  <Host>
                    <UploadProvider>
                      <TabLoadingProvider>
                        <AppNavigator />
                        <Toast />
                        <GlobalAlert ref={handleAlertRef} />
                      </TabLoadingProvider>
                    </UploadProvider>
                  </Host>
                </SafeAreaProvider>
              </KeyboardAvoidingView>
            </ThemeProvider>
          </SocketProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
