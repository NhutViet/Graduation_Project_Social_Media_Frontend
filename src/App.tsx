import 'react-native-gesture-handler';
import React from 'react';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './util/ThemeContext';
import {Host} from 'react-native-portalize';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'fast-text-encoding';
import {Provider} from 'react-redux';
import {persistor, store} from '../services/store';
import {PersistGate} from 'redux-persist/integration/react';
import {UploadProvider} from '../services/UploadProgressManager';
import {Buffer} from 'buffer';
import {TabLoadingProvider} from '../services/TabLoadingContext';
import {SocketProvider} from '../services/SocketContext';
import {KeyboardAvoidingView, Platform} from 'react-native';

import {LogBox} from 'react-native';
import AppContent from './AppContent';

LogBox.ignoreLogs(['Warning: componentWillReceiveProps has been renamed']);
global.Buffer = Buffer;

if (__DEV__) {
  import('./config/ReactotronConfig').then(() =>
    console.tron.log('Reactotron Configured ✅'),
  );
}

enableScreens();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SocketProvider>
            <ThemeProvider>
              <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <SafeAreaProvider>
                  <Host>
                    <UploadProvider>
                      <TabLoadingProvider>
                        <AppContent />
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
