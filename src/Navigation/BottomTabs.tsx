import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, View} from 'react-native';
import {Colors} from '../../assets/color/Colors';
import {useTheme} from '../util/ThemeContext';
import Home from '../(tabs)/Home';
import { Search } from '../Screens';
import Post from '../(tabs)/Post';
import Notification from '../(tabs)/Notification';
import Profile from '../(tabs)/Profile';
import ProfileNavigation from '../(tabs)/Profile/ProfileNavigation';

const Tab = createBottomTabNavigator();

const TabIcon = ({
  source,
  focused,
  size,
  tintColor,
}: {
  source: any;
  focused: boolean;
  size: number;
  tintColor: string;
}) => (
  <View style={styles.iconWrapper}>
    <Image
      source={source}
      style={[
        styles.icon,
        {
          tintColor: focused ? tintColor : `${tintColor}66`,
          width: size,
          height: size,
        },
      ]}
    />
  </View>
);

const BottomTabs = () => {
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: color.background, // đổi theo theme
          borderTopWidth: 0,
          height: 60,
          shadowColor: 'gray',
          shadowOpacity: 0.3,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              source={require('../../assets/icon/home.png')}
              focused={focused}
              size={20}
              tintColor={color.text} // đổi theo theme
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              source={require('../../assets/icon/search.png')}
              focused={focused}
              size={20}
              tintColor={color.text}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              source={require('../../assets/icon/post.png')}
              focused={focused}
              size={20}
              tintColor={color.text}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              source={require('../../assets/icon/heart.png')}
              focused={focused}
              size={20}
              tintColor={color.text}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              source={require('../../assets/icon/account.png')}
              focused={focused}
              size={20}
              tintColor={color.text}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabs;
