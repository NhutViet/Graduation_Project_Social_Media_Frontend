import 'react-native-gesture-handler';
import React from 'react';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './Navigation/AppNavigation';
import {ThemeProvider} from './util/ThemeContext';
import {Host} from 'react-native-portalize';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'fast-text-encoding';
import { Provider } from 'react-redux';
import { store } from '../services/store';

enableScreens();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <ThemeProvider>
          <SafeAreaProvider>
            <Host>
              <AppNavigator />
            </Host>
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
