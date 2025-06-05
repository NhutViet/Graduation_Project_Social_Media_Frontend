import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {bookmarked, BookmarkedItem} from '../../MockData/bookmarked.mock';
import BookmarkedPlaylist from './components/BookmarkedPlaylist';
import {useBookmarkStyles} from '../../StyleSheet/BookmarkedStyles';

export const BookmarkScreen = () => {
  const navigation: any = useNavigation();
  const styles = useBookmarkStyles();

  const posts = bookmarked.filter(item => item.type === 'post');
  const musics = bookmarked.filter(item => item.type === 'music');

  interface Playlist {
    id: string;
    title: string;
    type: 'post' | 'music';
    items: BookmarkedItem[];
  }

  const playlists: Playlist[] = [
    {id: '1', title: 'Tất cả bài đăng', type: 'post', items: posts},
    {id: '2', title: 'Âm thanh', type: 'music', items: musics},
  ];

  const handlePlaylistPress = (title: string, type: 'post' | 'music') => {
    navigation.navigate('PlaylistsScreen', {title, type});
  };

  const renderPlaylistItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      style={styles.columnItem}
      onPress={() => {
        if(item.title == 'Âm thanh'){
          navigation.navigate('MusicSaved');
        }else{
          handlePlaylistPress(item.title, item.type)
        }
      }}>
      <BookmarkedPlaylist title={item.title} items={item.items} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đã lưu</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddCollection');
          }}>
          <Image
            source={require('../../../assets/icon/Plus.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.playlistRow}
          scrollEnabled={false} // disable FlatList scrolling as we're using ScrollView
        />
      </ScrollView>
    </View>
  );
};
