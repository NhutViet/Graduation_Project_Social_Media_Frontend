import React, {useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Header from '../../../../components/Header';
import UserFollowersTab from './UserFollowersTab';
import UserFollowingTab from './UserFollowingTab';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {RootState} from '../../../../services/store';

interface UserFollowScreenParams {
  profileName?: string;
  userID?: string;
  screen: string;
}

type UserFollowScreenRouteProp = RouteProp<
  {params: UserFollowScreenParams},
  'params'
>;

export const UserFollowScreen = () => {
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const route = useRoute<UserFollowScreenRouteProp>();
  const routes = [
    {key: 'followers', title: 'Người theo dõi'},
    {key: 'following', title: 'Đang theo dõi'},
  ];

  const initialIndex = route.params?.screen === 'UserFollowingTab' ? 1 : 0;

  const [index, setIndex] = useState(initialIndex);

  const renderScene = SceneMap({
    followers: () => (
      <UserFollowersTab route={{params: {userID: route.params?.userID}}} />
    ),
    following: () => <UserFollowingTab userID={route.params?.userID ?? ''} />,
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={{height: 60}}>
        <Header
          title={route.params.profileName || ''}
          iconBack={true}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={tabBarProps => (
          <TabBar
            {...tabBarProps}
            indicatorStyle={{backgroundColor: color.primary}}
            activeColor={color.primary}
            inactiveColor={color.text}
            style={{
              backgroundColor: color.background,
              shadowColor: 'transparent',
              borderBottomWidth: 0.5,
              borderBottomColor: color.gray,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};
