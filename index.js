/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showIncomingCall, setupCallKeep } from './services/CallKeepService';
import { v4 as uuidv4 } from 'uuid';

AppRegistry.registerComponent(appName, () => App);

// Background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    const data = remoteMessage?.data || {};
    console.log('[BG MSG HANDLER] Received data:', data);
    
    if (data.type === 'incoming_call') {
      const callUuid = data.callUuid || uuidv4();

      // Store call details so foreground can read them after user answers
      await AsyncStorage.setItem(`incoming_call:${callUuid}`, JSON.stringify(data));
      
      try {
        await setupCallKeep();
        console.log('[BG] CallKeep setup successful');
      } catch (err) {
        console.warn('[BG] setupCallKeep failed', err);
      }

      // Show CallKeep incoming screen
      showIncomingCall({
        uuid: callUuid,
        handle: data.userId || data.senderId || 'unknown',
        name: data.userName || 'Unknown Caller',
      });

      console.log(`[BG] Showed incoming call for UUID: ${callUuid}`);
    }
  } catch (err) {
    console.error('[BG MSG HANDLER] error', err);
  }
});