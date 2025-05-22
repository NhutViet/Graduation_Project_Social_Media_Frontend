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
  BlockedAccounts,
  BookmarkScreen,
  PlaylistsScreen,
  BlockUser,
  Privacy,
  PeopleGroupChat,
  AddPeopleToGroupChat,
  QRScanner,
  InforGroupChat,
  HorizontalScreen,
  ShowActivity,
  SaveMusic,
  LikedScreen,
  MusicSavedScreen,
  AddCollectionScreen,
  Archive,
} from '../Screens';
import BottomTabs from './BottomTabs';
import ProfileComp from '../Screens/Profile';
import EditHighlightScreen from '../(tabs)/Profile/components/EditHighlightScreen';
export type RootStackParamList = {
  PendingMessages: undefined;
  MessageScreen: {room: string};
};

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BookmarkScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="BlockedAccounts" component={BlockedAccounts} />
        <Stack.Screen name="ShowActivity" component={ShowActivity} />
        <Stack.Screen name="LikedScreen" component={LikedScreen} />
        <Stack.Screen
          name="AddPeopleToGroupChat"
          component={AddPeopleToGroupChat}
        />
        <Stack.Screen name="MusicSaved" component={MusicSavedScreen} />
        <Stack.Screen name="HorizontalScreen" component={HorizontalScreen} />
        <Stack.Screen name="ProfileComp" component={ProfileComp} />
        <Stack.Screen name="SaveMusic" component={SaveMusic} />
        <Stack.Screen name="PeopleGroupChat" component={PeopleGroupChat} />
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
        <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
        />
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
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="QRScanner" component={QRScanner} />
        <Stack.Screen
          name="EditHighlightStory"
          component={EditHighlightScreen}
        />
        <Stack.Screen name="Archive" component={Archive}/>
        <Stack.Screen name="InforGroupChat" component={InforGroupChat} />
        <Stack.Screen name="AddCollection" component={AddCollectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
