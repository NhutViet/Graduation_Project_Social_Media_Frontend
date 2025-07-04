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

interface TagCount {
  tag: string;
  count: number;
}

/**
 * Regex to capture hashtags: '#' followed by one or more word characters,
 * ensuring it's preceded by start or whitespace and followed by a word boundary.
 */
const HASHTAG_REGEX = /(^|\s)(#\w+)\b/g;

const HashTag: React.FC = React.memo(() => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation<any>();

  // Grab loading + result sets from Redux
  const isLoading = useSelector((state: RootState) => state.search.isLoading);
  const posts = useSelector(
    (state: RootState) => (state.search.posts as {items: any[]})?.items || []
  );
  const reels = useSelector(
    (state: RootState) => (state.search.reels as {items: any[]})?.items || []
  );

  // Combine posts and reels
  const allItems = useMemo(() => [...posts, ...reels], [posts, reels]);

  // Extract and count hashtags
  const tagsData: TagCount[] = useMemo(() => {
    const counts: Record<string, number> = {};
    allItems.forEach(item => {
      const caption: string = item.caption || '';
      let match: RegExpExecArray | null;
      while ((match = HASHTAG_REGEX.exec(caption))) {
        const tag = match[2].toLowerCase();
        counts[tag] = (counts[tag] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([tag, count]) => ({tag, count}))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }, [allItems]);

  // Navigate to AllPostOfCollection with filtered posts on tag click
  const handlePressTag = useCallback(
    (tag: string) => {
      const filterRegex = new RegExp(`(^|\\s)${tag}\\b`, 'i');
      const filtered = allItems.filter(item => {
        const caption: string = item.caption || '';
        return filterRegex.test(caption);
      });
      if (filtered.length > 0) {
        navigation.navigate('AllPostOfCollection', {
          posts: filtered,
          targetPostId: filtered[0]._id,
          playlistName: tag,
        });
      }
    },
    [allItems, navigation]
  );

  const renderItem = useCallback(
    ({item}: {item: TagCount}) => (
      <TouchableOpacity style={styles.row} onPress={() => handlePressTag(item.tag)}>
        <View style={[styles.hashContainer, {borderColor: color.textSecondary}] }>
          <Image source={require('../../../../assets/icon/hash.png')} style={styles.iconHash} />
        </View>
        <View style={{flex: 1}}>
          <Text style={[styles.tagText, {color: color.text}]}
                numberOfLines={1}
                ellipsizeMode='tail'>
            {item.tag}
          </Text>
          <Text style={[styles.countText, {color: color.textSecondary}]}>  
            {item.count} post{item.count > 1 ? 's' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [color, handlePressTag]
  );

  if (isLoading) {
    return (
      <View style={[styles.center, {backgroundColor: color.background}] }>
        <ActivityIndicator size="large" color={color.primary} />
        <Text style={[styles.loadingText, {color: color.textSecondary}]}>Đang tải…</Text>
      </View>
    );
  }

  if (tagsData.length === 0) {
    return (
      <View style={[styles.center, {backgroundColor: color.background}] }>
        <Text style={[styles.loadingText, {color: color.textSecondary}]}>Không có hashtag nào.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: color.background}] }>
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
