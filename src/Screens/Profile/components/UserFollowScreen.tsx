import {StyleSheet, Text, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import Header from '../../../../components/Header';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserFollowersTab from './UserFollowersTab'
import UserFollowingTab from './UserFollowingTab'
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useSelector} from 'react-redux';
import { RootState } from '../../../../services/store';

const TopTab = createMaterialTopTabNavigator();

interface UserFollowScreenParams {
  userID?: string;
  screen: string;
}

type UserFollowScreenRouteProp = RouteProp<{ params: UserFollowScreenParams }, 'params'>;

export const UserFollowScreen = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const user = useSelector((state: RootState) => state.user.user);
  const route = useRoute<UserFollowScreenRouteProp>();
  const initialRouteName = (route.params as {screen?: string})?.screen || 'UserFollowersTab';
  console.log('Navigate to initial tab:', initialRouteName);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={{height: 60}}>
        <Header
          title= {user?.username}
          iconBack={require('../../../../assets/icon/left.png')}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
      </View>
      <View style={{flex: 1}}>
        <TopTab.Navigator
          initialRouteName={initialRouteName} 
          backBehavior='none' 
          screenOptions={{
            tabBarLabelStyle: {
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'lowercase',
            },
            tabBarStyle: {
              backgroundColor: color.background,
            },
            tabBarIndicatorStyle: {
              backgroundColor: color.text,
              height: 3,
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: 'gray',
          }}>
          <TopTab.Screen
            name="UserFollowersTab"
            component={UserFollowersTab}
            options={{title: 'Người theo dõi'}}
            initialParams={{userID: route.params?.userID}}
          />
          <TopTab.Screen
            name="UserFollowingTab"
            component={UserFollowingTab}
            options={{title: 'Đang theo dõi'}}
            initialParams={{userID: route.params?.userID}}
          />
        </TopTab.Navigator>
      </View>
    </SafeAreaView>
  );
};
