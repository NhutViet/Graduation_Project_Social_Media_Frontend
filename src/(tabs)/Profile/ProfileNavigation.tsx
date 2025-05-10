import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import index from './index'
import FollowersScreen from './FollowersScreen'
import FollowerTab from './FollowersTab'

const Stack = createStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen name='index' component={index}/>
      <Stack.Screen name='FollowersScreen' component={FollowersScreen}/>
    </Stack.Navigator>
  )
}

export default ProfileNavigation

const styles = StyleSheet.create({})