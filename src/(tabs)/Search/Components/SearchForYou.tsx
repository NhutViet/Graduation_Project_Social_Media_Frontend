import React, {useCallback, useMemo, useEffect, useRef} from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';
import {useNavigation} from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;
const mediasHeight = ((screenWidth - 4) / 3) * 2;
const mediasWidth = (screenWidth - 4) / 3;

// Hàm chuyển video m3u8 Cloudflare thành ảnh thumbnail
const convertToImage = (uri: string): string => {
  if (
    uri.includes('videodelivery.net') &&
    uri.includes('/manifest/') &&
    !uri.endsWith('.jpg')
  ) {
    const parts = uri.split('/');
    const videoId = parts[3];
    return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=2s`;
  }
  return uri;
};

// Hàm xáo trộn danh sách
const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

interface SearchForYouProps {
  searchText: string;
  isFocusedPage: boolean;
  currentVisibleIndex: number | null;
  onViewableItemsChanged: (info: any) => void;
  isPause: boolean;
}

const SearchForYou: React.FC<SearchForYouProps> = ({
  searchText,
  isFocusedPage,
  currentVisibleIndex,
  onViewableItemsChanged,
  isPause,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const navigation = useNavigation<any>();

  const shuffleCache = useRef<{data: any[]; shuffled: any[]}>({
    data: [],
    shuffled: [],
  });

  const viewabilityConfig = useMemo(
    () => ({viewAreaCoveragePercentThreshold: 50}),
    [],
  );

  const {posts, reels, isSuccess, isLoading} = useSelector(
    (state: RootState) => state.search,
  );

  const postItems = (posts as any)?.items || [];
  const reelItems = (reels as any)?.items || [];

  // Optimize shuffling with caching
  const randomList = useMemo(() => {
    const combined = [...postItems, ...reelItems];

    // Only reshuffle if data actually changed
    if (
      JSON.stringify(combined) !== JSON.stringify(shuffleCache.current.data)
    ) {
      shuffleCache.current.data = combined;
      shuffleCache.current.shuffled = shuffleArray(combined);
    }

    return shuffleCache.current.shuffled;
  }, [postItems.length, reelItems.length]); // Depend on lengths, not arrays

  const extra = useMemo(
    () => ({currentVisibleIndex, isFocusedPage, isPause}),
    [currentVisibleIndex, isFocusedPage, isPause],
  );

  const handlePressItem = useCallback(
    (item: any) => {
      navigation.navigate('AllPostOfCollection', {
        posts: randomList,
        targetPostId: item._id,
        playlistName: searchText || 'Kết quả tìm kiếm',
        clickableHashtag: true,
        clearSearchRedux: false,
      });
    },
    [navigation, randomList, searchText],
  );

  const renderMediaItem = useCallback(
    ({item, index}: any) => {
      const media = item.media?.[0];
      if (!media) return null;
      // Ưu tiên render image nếu là Cloudflare video
      const shouldUseImageOnly = !!media.videoUrl;

      return (
        <TouchableOpacity
          key={item._id || index}
          style={styles.itemContainer}
          onPress={() => handlePressItem(item)}>
          {shouldUseImageOnly ? (
            <Image
              source={{uri: convertToImage(media.videoUrl)}}
              style={styles.media}
              resizeMode="cover"
            />
          ) : (
            media.imageUrl && (
              <Image
                source={{uri: media.imageUrl}}
                style={styles.media}
                resizeMode="cover"
              />
            )
          )}
        </TouchableOpacity>
      );
    },
    [handlePressItem],
  );

  return (
  <View style={[styles.container, {backgroundColor: color.background}]}>
    {!isSuccess && isLoading ? (
      // Hiển thị vòng tròn quay khi chưa có dữ liệu thành công
      <View style={styles.center}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    ) : randomList.length > 0 && isSuccess ? (
      // Hiển thị danh sách nếu có dữ liệu
      <FlashList
        data={randomList}
        numColumns={3}
        renderItem={renderMediaItem}
        estimatedItemSize={mediasHeight + 2}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        extraData={extra}
        removeClippedSubviews
        keyExtractor={(item, idx) => item._id || `search-${idx}`}
        getItemType={() => 'media-item'}
      />
    ) : isSuccess && randomList.length === 0 &&(
      // Hiển thị khi có kết quả nhưng mảng rỗng
      <View style={styles.center}>
        <Text style={[styles.loadingText, {color: color.textSecondary}]}>
          Không có kết quả phù hợp.
        </Text>
      </View>
    )}
  </View>
);
};

export default React.memo(SearchForYou);

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  itemContainer: {
    marginBottom: 2,
  },
  media: {
    width: mediasWidth,
    height: mediasHeight,
    marginRight: 2,
    backgroundColor: Colors.black,
  },
});
