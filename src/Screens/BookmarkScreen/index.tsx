import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useBookmarkStyles} from '../../StyleSheet/BookmarkedStyles';
import BookmarkedPlaylist from './components/BookmarkedPlaylist';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {getAllPlaylists} from '../../../services/bookmarkRedux/bookmarkSlice';
import {
  Playlist,
  Playlist as PlaylistType,
} from '../../../services/bookmarkRedux/bookmarkTypes';

export const BookmarkScreen = () => {
  const navigation = useNavigation<any>();
  const styles = useBookmarkStyles();
  const dispatch = useDispatch<AppDispatch>();

  const {refreshToken} = useSelector((state: RootState) => state.user);
  const {playlists, isloading} = useSelector(
    (state: RootState) => state.bookmark,
  );

  // Lấy danh sách playlist lần đầu
  useFocusEffect(
    useCallback(() => {
      if (refreshToken) {
        dispatch(getAllPlaylists({refreshToken}));
      }
    }, [dispatch, refreshToken]),
  );

  const handlePlaylistPress = (playlistId: string, title: string) => {
    if (title === 'Music') {
      navigation.navigate('MusicSaved', {playlistId, title});
    } else {
      navigation.navigate('PlaylistsScreen', {playlistId, title});
    }
  };

  const renderPlaylistItem = ({item}: {item: Playlist}) => {
    return (
      <TouchableOpacity
        style={styles.columnItem}
        onPress={() => handlePlaylistPress(item._id, item.playlistName)}>
        <BookmarkedPlaylist
          title={item.playlistName}
          thumbnails={item.thumbnails || []}
          coverImg={item.coverImg}
        />
      </TouchableOpacity>
    );
  };

  if (isloading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={'#0095F6'} />
      </SafeAreaView>
    );
  }else{

  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../../assets/icon/left.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đã lưu</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddCollection' as never)}>
            <Image
              source={require('../../../assets/icon/Plus.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Danh sách playlist */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <FlatList
            data={playlists}
            renderItem={renderPlaylistItem}
            keyExtractor={item => item._id}
            numColumns={2}
            columnWrapperStyle={styles.playlistRow}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
