import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import SearchForYou from './SearchForYou';
import HashTag from './HashTag';
import SearchUser from './SearchUser';

const SearchResult = (props: any) => {
  const layout = Dimensions.get('window');
  const {theme} = useTheme();
  const color = Colors[theme];
  const {searchText} = props;

  //tab
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Dành cho bạn'},
    {key: 'second', title: 'Người dùng'},
    {key: 'three', title: 'Thẻ'},
  ]);

  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'first':
        return <SearchForYou searchText={searchText} />;
      case 'second':
        return <SearchUser searchText={searchText} />;
      case 'three':
        return <HashTag searchText={searchText} />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={props => {
        return (
          <TabBar
            {...props}
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
        );
      }}
    />
  );
};

export default SearchResult;

const styles = StyleSheet.create({});
