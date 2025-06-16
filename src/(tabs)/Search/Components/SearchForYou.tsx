import { Dimensions, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';
import { FlashList } from '@shopify/flash-list';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../services/store';

const screenWidth = Dimensions.get('window').width;
const mediasHeight = ((screenWidth - 4) / 3) * 2;
const mediasWidth = (screenWidth - 4) / 3;

function shuffle<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
  const { theme } = useTheme();
  const color = Colors[theme];

  const viewabilityConfig = useMemo(() => ({ viewAreaCoveragePercentThreshold: 50 }), []);

  const { posts, reels, isLoading } = useSelector((state: RootState) => state.search);


  const postItems = (posts as any)?.items || [];
  const reelItems = (reels as any)?.items || [];

  const randomList = useMemo(
    () => shuffle([...postItems, ...reelItems]),
    [postItems, reelItems]
  );

  const extra = useMemo(
    () => ({ currentVisibleIndex, isFocusedPage }),
    [currentVisibleIndex, isFocusedPage]
  );

  const renderMediaItem = useCallback(
    ({ item, index }: any) => {
      const media = item.media?.[0];
      if (!media) return null;

      const isActiveVideo =
        !!media.videoUrl &&
        index === currentVisibleIndex &&
        isPause &&
        isFocusedPage;

      return (
        <TouchableOpacity key={item._id || index} style={styles.itemContainer}>
          {isActiveVideo && media.videoUrl ? (
            <Video
              source={{ uri: media.videoUrl }}
              style={styles.media}
              resizeMode="cover"
              repeat
              muted
              paused={!isActiveVideo}
            />
          ) : media.imageUrl ? (
            <Image source={{ uri: media.imageUrl }} style={styles.media} resizeMode="cover" />
          ) : (
            <Image
              source={require('../../../../assets/icon/black.png')}
              style={styles.media}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      );
    },
    [currentVisibleIndex, isFocusedPage, isPause]
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: color.background }]}> 
        <Text style={[styles.loadingText, { color: color.textSecondary }]}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>  
      {randomList.length > 0 ? (
        <FlashList
          data={randomList}
          numColumns={3}
          renderItem={renderMediaItem}
          estimatedItemSize={mediasHeight + 2}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          extraData={extra}
          removeClippedSubviews
          keyExtractor={(item, idx) => item._id || String(idx)}
        />
      ) : (
        <View style={styles.center}>
          <Text style={[styles.loadingText, { color: color.textSecondary }]}>Không có kết quả phù hợp.</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(SearchForYou);

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { fontSize: 18, fontWeight: '500' },
  itemContainer: { marginBottom: 2 },
  media: { width: mediasWidth, height: mediasHeight, marginRight: 2, backgroundColor: Colors.black, },
});
