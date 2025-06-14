import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import FollowersScreen from './components/FollowersScreen';
import Profile from '.';

const Stack = createStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" component={Profile} />
      <Stack.Screen name="FollowersScreen" component={FollowersScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
