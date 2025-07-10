import React, {useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';
import {useNavigation} from '@react-navigation/native';
import { 
  extractHashtags, 
  hasHashtags, 
} from '../../../util/hashtagUtils';
import { Item } from '@services/searchRedux/searchType';

interface TagCount {
  tag: string;
  count: number;
}

const HashTag: React.FC = React.memo(() => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation<any>();

  // Grab loading + result sets from Redux
  const isLoading = useSelector((state: RootState) => state.search.isLoading);
  const posts = useSelector(
    (state: RootState) => (state.search.posts as {items: Item[]})?.items || []
  );
  const reels = useSelector(
    (state: RootState) => (state.search.reels as {items: Item[]})?.items || []
  );

  // Combine posts and reels
  const allItems = useMemo(() => [...posts, ...reels], [posts, reels]);

  // Extract and count hashtags using utility functions
  const tagsData: TagCount[] = useMemo(() => {
    const counts: Record<string, number> = {};
    
    allItems.forEach(item => {
      const caption: string = item.caption || '';
      
      // Use utility function to check if caption has hashtags
      if (hasHashtags(caption)) {
        // Extract hashtags using utility function
        const hashtags = extractHashtags(caption);
        
        hashtags.forEach(hashtag => {
          // Remove the # symbol and convert to lowercase for consistency
          const cleanTag = hashtag.replace('#', '').toLowerCase();
          counts[cleanTag] = (counts[cleanTag] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([tag, count]) => ({tag, count}))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }, [allItems]);

  const handlePressTag = useCallback(
    (tag: string) => {
      // Filter items that contain the specific hashtag
      const filtered = allItems.filter(item => {
        const caption: string = item.caption || '';
        if (!hasHashtags(caption)) return false;        
        const hashtags = extractHashtags(caption);
        return hashtags.some(hashtag => 
          hashtag.replace('#', '').toLowerCase() === tag.toLowerCase()
        );
      });
      
      if (filtered.length > 0) {
        navigation.navigate('AllPostOfCollection', {
          posts: filtered,
          targetPostId: filtered[0]._id,
          playlistName: `#${tag}`,
          clickableHashtag: false,
          clearSearchRedux: false,
        });
      }
    },
    [allItems, navigation]
  );

  const renderItem = useCallback(
    ({item}: {item: TagCount}) => (
      <TouchableOpacity style={styles.row} onPress={() => handlePressTag(item.tag)}>
        <View style={[styles.hashContainer, {borderColor: color.textSecondary}]}>
          <Image source={require('../../../../assets/icon/hash.png')} style={styles.iconHash} />
        </View>
        <View style={{flex: 1}}>
          <Text style={[styles.tagText, {color: color.text}]}
                numberOfLines={1}
                ellipsizeMode='tail'>
            #{item.tag}
          </Text>
          <Text style={[styles.countText, {color: color.textSecondary}]}>  
            {item.count} bài viết
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [color, handlePressTag]
  );

  if (isLoading) {
    return (
      <View style={[styles.center, {backgroundColor: color.background}]}>
        <ActivityIndicator size="large" color={color.primary} />
        <Text style={[styles.loadingText, {color: color.textSecondary}]}>Đang tải…</Text>
      </View>
    );
  }

  if (tagsData.length === 0) {
    return (
      <View style={[styles.center, {backgroundColor: color.background}]}>
        <Text style={[styles.loadingText, {color: color.textSecondary}]}>Không có hashtag nào.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: color.background}]}>
      <FlashList
        data={tagsData}
        renderItem={renderItem}
        keyExtractor={item => item.tag}
        estimatedItemSize={50}
        removeClippedSubviews
      />
    </View>
  );
});

export default HashTag;

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {fontSize: 18, fontWeight: '500', marginTop: 8},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10,
    paddingVertical: 10,
  },
  tagText: {fontSize: 16, fontWeight: 'bold'},
  countText: {fontSize: 14, fontWeight: '400'},
  iconHash: {width: 22, height: 22, resizeMode: 'contain'},
  hashContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 100,
  },
});