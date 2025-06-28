import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../../components/Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import FollowersTab from './FollowersTab';
import FollowingTab from './FollowingTab';

const initialLayout = {width: Dimensions.get('window').width};

const FollowersScreen = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const route = useRoute();
  const user = useSelector((state: RootState) => state.user.user);

  const routeParams = route.params as {screen?: string};
  const indexFromParams = routeParams?.screen === 'FollowingTab' ? 1 : 0;

  const [index, setIndex] = useState(indexFromParams);
  const [routes] = useState([
    {key: 'followers', title: 'Người theo dõi'},
    {key: 'following', title: 'Đang theo dõi'},
  ]);

  const renderScene = SceneMap({
    followers: FollowersTab,
    following: FollowingTab,
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={{width: '100%', height: 60}}>
        <Header
          title={user?.handleName}
          iconBack={require('../../../../assets/icon/left.png')}
          func={() => navigation.goBack()}
          navigation={navigation}
        />
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
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
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </SafeAreaView>
  );
};

export default FollowersScreen;
