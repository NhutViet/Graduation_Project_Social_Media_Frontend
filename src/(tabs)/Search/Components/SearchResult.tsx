import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import SearchForYou from './SearchForYou';
import HashTag from './HashTag';
import SearchUser from './SearchUser';
import { useIsFocused } from '@react-navigation/native';

const SearchResult = (props: any) => {
  const layout = Dimensions.get('window');
  const {theme} = useTheme();
  const color = Colors[theme];
  const {searchText, currentVisibleIndex, onViewableItemsChanged, isPause} = props;
  const isFocusedPage = useIsFocused();

  //tab
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Bài viết'},
    {key: 'second', title: 'Người dùng'},
    {key: 'three', title: 'Thẻ'},
  ]);

  const renderScene = ({route}: any) => {
    const isFirstTab = index === 0 && route.key === 'first';
    switch (route.key) {
      case 'first':
        return <SearchForYou searchText={searchText}  isFocusedPage={isFocusedPage} currentVisibleIndex={currentVisibleIndex} onViewableItemsChanged={onViewableItemsChanged} isPause={isPause && isFirstTab}/>;
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
