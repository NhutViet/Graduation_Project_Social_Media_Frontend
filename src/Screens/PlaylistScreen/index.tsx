import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Video from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { bookmarked, BookmarkedItem } from '../../MockData/bookmarked.mock';
import { useBookmarkStyles } from '../../StyleSheet/BookmarkedStyles';
import { useTheme } from '../../util/ThemeContext';
import { Colors } from '../../../assets/color/Colors';

interface RouteParams {
  title: string;
  type: 'post' | 'music';
}

export const PlaylistsScreen = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;

  const styles = useBookmarkStyles();
  const { theme } = useTheme();
  const palette = Colors[theme];

  // state for tab view
  const initialIndex = params.type === 'music' ? 1 : 0;
  const [index, setIndex] = useState<number>(initialIndex);
  const [routes] = useState([
    { key: 'grid',  icon: require('../../../assets/icon/grid.png') },
    { key: 'reels', icon: require('../../../assets/icon/reels.png') },
  ]);

  // full dataset
  const allItems = bookmarked;

  // set default tab based on how we navigated in
  useEffect(() => {
    if (params.type === 'music') {
      setIndex(1); // jump to reels for “Sounds”
    } else {
      setIndex(0); // stay on grid for “All posts”
    }
  }, [params.type]);

  // modal state
  const [selectedItem, setSelectedItem] = useState<BookmarkedItem | null>(null);
  const modalizeRef = useRef<Modalize>(null);
  const videoRef = useRef<any>(null);

  const handleItemPress = (item: BookmarkedItem) => {
    setSelectedItem(item);
    modalizeRef.current?.open();
  };
  const closeModal = () => modalizeRef.current?.close();

  // === tab scenes ===

const GridRoute = () => (
  <View style={styles.postsGridContainer}>
    <FlatList
      data={allItems}
      numColumns={3}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.postItem} onPress={() => handleItemPress(item)}>
          <Image
            source={{ uri: item.isVideo ? item.thumbnail! : item.image }}
            style={styles.postImage}
            resizeMode="cover"
          />
          {item.isVideo && (
            <View style={styles.videoIconContainer}>
              <Image source={require('../../../assets/icon/reels.png')} style={styles.videoIcon} />
            </View>
          )}
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.postsGridContent}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
    />
  </View>
);

const ReelsRoute = () => (
  <View style={styles.postsGridContainer}>
    <FlatList
      data={allItems.filter(item => item.type === 'music')}
      numColumns={3}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.postItem} onPress={() => handleItemPress(item)}>
          <Image
            source={{ uri: item.thumbnail! }}
            style={styles.postImage}
            resizeMode="cover"
          />
          <View style={styles.videoIconContainer}>
            <Image source={require('../../../assets/icon/reels.png')} style={styles.videoIcon} />
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.postsGridContent}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
    />
  </View>
);

  const renderTabBar = (props: any) => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route: any, i: number) => {
        const isFocused = index === i;
        return (
          <TouchableOpacity key={route.key} style={styles.tab} onPress={() => setIndex(i)}>
            <Image
              source={route.icon}
              style={[styles.tabIcon, isFocused && styles.tabIconActive]}
            />
            {isFocused && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderScene = SceneMap({
    grid:  GridRoute,
    reels: ReelsRoute,
  });

  return (
    <SafeAreaView style={styles.playlistsContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.playlistsHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/icon/left.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{params.title}</Text>
        <TouchableOpacity>
          <Image source={require('../../../assets/icon/ellipsis.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />

    <Portal>
        <Modalize
            ref={modalizeRef}
            modalStyle={{ backgroundColor: palette.background }}
            adjustToContentHeight
            withHandle={false}
            onClose={() => setSelectedItem(null)}
        >
            <View style={styles.modalizeContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Image source={require('../../../assets/icon/closer.png')} style={styles.closeIcon} />
            </TouchableOpacity>
            {selectedItem && (  // Add this null check
                selectedItem.isVideo ? (
                <Video
                    ref={videoRef}
                    source={{ uri: selectedItem.image || selectedItem.thumbnail }}  // Add fallback
                    style={styles.fullScreenVideo}
                    controls
                    resizeMode="contain"
                    paused={false}
                />
                ) : (
                <Image
                    source={{ uri: selectedItem.image }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                />
                )
            )}
            </View>
        </Modalize>
    </Portal>
    </SafeAreaView>
  );
};
