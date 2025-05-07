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
  EditProfile,
  PendingMessages,
} from '../Screens';
import BottomTabs from './BottomTabs';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PendingMessages"
        screenOptions={{headerShown: false}}>
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
        <Stack.Screen name="SeenStory" component={SeenStory} />
        <Stack.Screen name="SeenStoryOwner" component={SeenStoryOwner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
