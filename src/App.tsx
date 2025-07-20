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
import {LogBox} from 'react-native';
import AppContent from './AppContent';
import {HeadAlertProvider} from '../components/Global/HeadAlertProvider';

LogBox.ignoreLogs(['Warning: componentWillReceiveProps has been renamed']);
LogBox.ignoreLogs([
  'This method is deprecated (as well as all React Native Firebase namespaced API)',
]);
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
              <SafeAreaProvider>
                <Host>
                  <UploadProvider>
                    <HeadAlertProvider>
                      <TabLoadingProvider>
                        <AppContent />
                      </TabLoadingProvider>
                    </HeadAlertProvider>
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
