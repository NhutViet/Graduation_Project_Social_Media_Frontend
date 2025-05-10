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
  Profile,
  SwitchAccount,
  Register,
  Search,
  EditProfile,
  PendingMessages,
  MessageScreen,
  UserInfo,
  ScreenQRCode,
} from '../Screens';
import BottomTabs from './BottomTabs';
import SearchResult from '../Screens/Search/Components/SearchResult';

export type RootStackParamList = {
  PendingMessages: undefined;
  MessageScreen: {room: string};
};

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="QRCode"
        screenOptions={{headerShown: false}}>
          <Stack.Screen name="SearchResult" component={SearchResult} />
        <Stack.Screen name="Search" component={Search} />
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
        <Stack.Screen name="Profile" component={Profile} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
