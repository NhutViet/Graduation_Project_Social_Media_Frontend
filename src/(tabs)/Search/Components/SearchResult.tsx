import {Dimensions, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {TabBar, TabView} from 'react-native-tab-view';
import SearchForYou from './SearchForYou';
import HashTag from './HashTag';
import SearchUser from './SearchUser';
import {useIsFocused} from '@react-navigation/native';

interface SearchResultProps {
  searchText: string;
  currentVisibleIndex: number | null;
  onViewableItemsChanged: (info: any) => void;
  isPause: boolean;
}

const SearchResult: React.FC<SearchResultProps> = ({
  searchText,
  currentVisibleIndex,
  onViewableItemsChanged,
  isPause,
}) => {
  const layout = Dimensions.get('window');
  const {theme} = useTheme();
  const color = Colors[theme];
  const isFocusedPage = useIsFocused();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Bài viết'},
    {key: 'second', title: 'Người dùng'},
    {key: 'three', title: 'Thẻ'},
  ]);

  const renderScene = ({route}: any) => {
    if (index !== routes.findIndex(r => r.key === route.key)) return null;
    
    const isFirstTab = index === 0 && route.key === 'first';
    const components = {
      first: (
        <SearchForYou
          searchText={searchText}
          isFocusedPage={isFocusedPage}
          currentVisibleIndex={currentVisibleIndex}
          onViewableItemsChanged={onViewableItemsChanged}
          isPause={isPause && isFirstTab}
        />
      ),
      second: <SearchUser />,
      three: <HashTag />,
    };
    
    return components[route.key as keyof typeof components] || null;
  };

  const renderLazyPlaceholder = () => (
    <View style={{flex: 1, backgroundColor: color.background}} />
  );

  const renderTabBar = (props: any) => (
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

  return (
    <TabView
      navigationState={{index, routes}}
      lazy
      renderLazyPlaceholder={renderLazyPlaceholder}
      lazyPreloadDistance={0}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
    />
  );
};

export default SearchResult;