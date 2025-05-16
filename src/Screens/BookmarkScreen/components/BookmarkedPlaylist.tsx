import React from 'react';
import { View, Text, Image } from 'react-native';
import { useBookmarkStyles } from '../../../StyleSheet/BookmarkedStyles';
import { BookmarkedItem } from '../../../MockData/bookmarked.mock';

interface Props {
  title: string;
  items: BookmarkedItem[];
}

const BookmarkedPlaylist: React.FC<Props> = ({ title, items }) => {
  const styles = useBookmarkStyles();

  return (
    <View style={styles.playlistContainer}>
      <View style={styles.gridContainer}>
        {items.slice(0, 4).map((item, idx) => (
          <Image
            key={item.id}
            source={{ uri: item.isVideo ? item.thumbnail : item.image }}
            style={styles.gridImage}
            resizeMode="cover"
          />
        ))}
        {items.length < 4 &&
          Array.from({ length: 4 - items.length }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.gridImagePlaceholder} />
          ))}
      </View>
      <Text style={styles.playlistTitle}>{title}</Text>
    </View>
  );
};

export default BookmarkedPlaylist;