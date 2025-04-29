import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../../assets/color/Colors';
import {Image, StyleSheet, View} from 'react-native';
import Home from '../Layout/Home';
import Search from '../Layout/Search';
import Post from '../Layout/Post';
import Account from '../Layout/Account';
import Reels from '../Layout/Reels';

const Tab = createBottomTabNavigator();

const TabIcon = ({
  source,
  focused,
  size,
}: {
  source: any;
  focused: boolean;
  size: number;
}) => (
  <View style={styles.iconWrapper}>
    <Image
      source={source}
      style={[
        styles.icon,
        {
          tintColor: focused ? Colors.black : Colors.gray,
          width: size,
          height: size,
        },
      ]}
    />
  </View>
);

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          height: 60,
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
            />
          ),
        }}
      />
      <Tab.Screen
        name="Reels"
        component={Reels}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              source={require('../../assets/icon/reels.png')}
              focused={focused}
              size={20}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              source={require('../../assets/icon/account.png')}
              focused={focused}
              size={20}
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
