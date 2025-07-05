import React, {useCallback, useMemo, useRef} from 'react';
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
import {ActivityIndicator} from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;
const mediasHeight = ((screenWidth - 4) / 3) * 2;
const mediasWidth = (screenWidth - 4) / 3;

// Convert Cloudflare video m3u8 to thumbnail image
const convertToImage = (uri: string): string => {
  if (uri.includes('videodelivery.net') && uri.includes('/manifest/') && !uri.endsWith('.jpg')) {
    const videoId = uri.split('/')[3];
    return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=2s`;
  }
  return uri;
};

// Shuffle array utility
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

  const shuffleCache = useRef<{data: any[]; shuffled: any[]}>({data: [], shuffled: []});

  const {posts, reels, isSuccess, isLoading} = useSelector((state: RootState) => state.search);

  const postItems = (posts as any)?.items || [];
  const reelItems = (reels as any)?.items || [];

  // Cached shuffled list
  const randomList = useMemo(() => {
    const combined = [...postItems, ...reelItems];
    if (JSON.stringify(combined) !== JSON.stringify(shuffleCache.current.data)) {
      shuffleCache.current.data = combined;
      shuffleCache.current.shuffled = shuffleArray(combined);
    }
    return shuffleCache.current.shuffled;
  }, [postItems.length, reelItems.length]);

  const extra = useMemo(
    () => ({currentVisibleIndex, isFocusedPage, isPause}),
    [currentVisibleIndex, isFocusedPage, isPause],
  );

  const viewabilityConfig = useMemo(() => ({viewAreaCoveragePercentThreshold: 50}), []);

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

  const renderContent = () => {
    if (!isSuccess && isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      );
    }

    if (randomList.length > 0 && isSuccess) {
      return (
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
      );
    }

    if (isSuccess && randomList.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={[styles.loadingText, {color: color.textSecondary}]}>
            Không có kết quả phù hợp.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, {backgroundColor: color.background}]}>
      {renderContent()}
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