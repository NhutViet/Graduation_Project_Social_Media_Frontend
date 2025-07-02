import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoryArchive from './components/StoriesArchive';

const Stack = createStackNavigator();

export const Archive = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen name="index" component={StoryArchive}/>
    </Stack.Navigator>
  );
};
