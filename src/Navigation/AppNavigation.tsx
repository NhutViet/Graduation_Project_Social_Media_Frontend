import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../Screens/Splash';
import BottomTabs from './BottomTabs';
import Setting from '../Screens/Setting';
import Login from '../Screens/Login';
import SwitchAccount from '../Screens/SwitchAccount';
import PostStory from '../Screens/PostStory';
import EditStoryScreen from '../Screens/EditStory';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="UpStory"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SwitchAccount" component={SwitchAccount} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="UpStory" component={PostStory} />
        <Stack.Screen name="EditStory" component={EditStoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
