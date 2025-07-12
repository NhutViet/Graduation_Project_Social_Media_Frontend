import React, {memo, useCallback} from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {MediaItem} from '../../../util/msgImgList';
import {FlashList} from '@shopify/flash-list';
import LoadingModal from '../../../../components/Global/LoadingModal';

interface TabViProps {
  medi: MediaItem[] | undefined;
  isLoading: boolean;
  onEndReached?: () => void;
}

const ITEM_HEIGHT = (width: number) => width / 3;
export const TabVi = memo(({medi, isLoading, onEndReached}: TabViProps) => {
  const {width: screenWidth} = useWindowDimensions();
  const itemSize = ITEM_HEIGHT(screenWidth);

  const renderItem = useCallback(
    ({item}: {item: MediaItem}) => (
      <TouchableOpacity
        style={{
          width: itemSize - 1,
          height: itemSize,
        }}>
        <Image
          source={{uri: item.media.url}}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
    ),
    [itemSize],
  );

  const keyExtractor = useCallback((item: MediaItem) => item._id, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingModal />
      </View>
    );
  }

  if (!medi || medi.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Chưa có ảnh</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={medi}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={3}
      estimatedItemSize={itemSize}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      estimatedListSize={{
        height: screenWidth,
        width: screenWidth,
      }}
    />
  );
});

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 0.5,
  },
});
