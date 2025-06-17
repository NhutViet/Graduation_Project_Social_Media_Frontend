import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import UserFollowScreen from './components/UserFollowScreen';
import Profile from '.';

const Stack = createStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" component={Profile} />
      <Stack.Screen name="UserFollowScreen" component={UserFollowScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
