import 'react-native-gesture-handler';
import React from 'react';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './Navigation/AppNavigation';
import {ThemeProvider} from './util/ThemeContext';
import {Host} from 'react-native-portalize';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'fast-text-encoding';
import {Provider} from 'react-redux';
import {persistor, store} from '../services/store';
import { PersistGate } from 'redux-persist/integration/react';

enableScreens();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <SafeAreaProvider>
              <Host>
                <AppNavigator />
              </Host>
            </SafeAreaProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
