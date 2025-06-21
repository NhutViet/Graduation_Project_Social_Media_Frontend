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
import {requestCallPermissions, setupCallKeep} from '@services/CallKeepService';
global.Buffer = Buffer;
if (__DEV__) {
  import('./config/ReactotronConfig').then(() =>
    console.tron.log('Reactotron Configured ✅'),
  );
}
enableScreens();

const App = () => {
  useEffect(() => {
    const initCallKeep = async () => {
      await requestCallPermissions();
      setupCallKeep();
    };

    initCallKeep();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SocketProvider>
            <ThemeProvider>
              <SafeAreaProvider>
                <Host>
                  <UploadProvider>
                    <TabLoadingProvider>
                      <AppNavigator />
                      <Toast />
                    </TabLoadingProvider>
                  </UploadProvider>
                </Host>
              </SafeAreaProvider>
            </ThemeProvider>
          </SocketProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
