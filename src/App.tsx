import React from 'react';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './Navigation/AppNavigation';
import {ThemeProvider} from './util/ThemeContext';

enableScreens();

const App = () => {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
