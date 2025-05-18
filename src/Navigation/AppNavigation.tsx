import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {
  AddPost,
  EditStory,
  FollowerRequests,
  Login,
  NotificationsScreen,
  PostSetting,
  PostStory,
  SeenStory,
  SeenStoryOwner,
  Setting,
  SwitchAccount,
  Register,
  EditProfile,
  PendingMessages,
  MessageScreen,
  UserInfo,
  ScreenQRCode,
  MessageBox,
  Streaming,
  CameraScreen,
  Swipe,
  CreateGroupScreen,
  BookmarkScreen,
  PlaylistsScreen,
  BlockUser
} from '../Screens';
import BottomTabs from './BottomTabs';
export type RootStackParamList = {
  PendingMessages: undefined;
  MessageScreen: {room: string};
};

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BottomTabs"
        screenOptions={{headerShown: false}}>
          <Stack.Screen name="BlockUser" component={BlockUser} />
        <Stack.Screen name="Swipe" component={Swipe} />
        <Stack.Screen name="PostSetting" component={PostSetting} />
        <Stack.Screen name="AddPost" component={AddPost} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SwitchAccount" component={SwitchAccount} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="UpStory" component={PostStory} />
        <Stack.Screen name="EditStory" component={EditStory} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="PendingMessages" component={PendingMessages} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen}/>
        <Stack.Screen name="FollowerRequests" component={FollowerRequests} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="SeenStory" component={SeenStory} />
        <Stack.Screen name="SeenStoryOwner" component={SeenStoryOwner} />
        <Stack.Screen name="MessageScreen" component={MessageScreen} />
        <Stack.Screen name="InfoUser" component={UserInfo} />
        <Stack.Screen name="QRCode" component={ScreenQRCode} />
        <Stack.Screen name="MessageBox" component={MessageBox} />
        <Stack.Screen name="Streaming" component={Streaming} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} />
        <Stack.Screen name="BookmarkScreen" component={BookmarkScreen} />
        <Stack.Screen name="PlaylistsScreen" component={PlaylistsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
