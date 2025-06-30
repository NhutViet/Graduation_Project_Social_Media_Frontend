import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import Header from '../../../../components/Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import FollowersTab from './FollowersTab';
import FollowingTab from './FollowingTab';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useSelector} from 'react-redux';
import { RootState } from '../../../../services/store';

const TopTab = createMaterialTopTabNavigator();

const FollowersScreen = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const route = useRoute();
  const user = useSelector((state: RootState) => state.user.user);
  const initialRouteName = (route.params as {screen?: string})?.screen || 'FollowersTab';

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={{width: '100%', height: 60}}>
        <Header
          title= {user?.username}
          iconBack={require('../../../../assets/icon/left.png')}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
      </View>
      <View style={{width: '100%', height: '100%'}}>
        <TopTab.Navigator
          initialRouteName={initialRouteName}
          backBehavior="none"
          screenOptions={{
            tabBarLabelStyle: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'capitalize',
              padding: 4,
              color: '#000000',
            },
            tabBarStyle: {
              backgroundColor: color.background,
            },
            tabBarIndicatorStyle: {
              backgroundColor: color.text,
              height: 3,
            },
            tabBarActiveTintColor: color.text,
            tabBarInactiveTintColor: color.textSecondary,
          }}>
          <TopTab.Screen
            name="FollowersTab"
            component={FollowersTab}
            options={{title: 'Người theo dõi'}}
          />
          <TopTab.Screen
            name="FollowingTab"
            component={FollowingTab}
            options={{title: 'Đang theo dõi' }}
          />
        </TopTab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default FollowersScreen;
