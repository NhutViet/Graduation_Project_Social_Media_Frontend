import React, {memo, useCallback} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {MediaItem} from '../../../util/msgImgList';
import {FlashList} from '@shopify/flash-list';
import LoadingModal from '../../../../components/Global/LoadingModal';

interface TabViProps {
  medi: MediaItem[] | undefined;
  isLoading: boolean;
  onEndReached?: () => void;
  onImagePress?: (uri: string) => void;
}

const ITEM_HEIGHT = (width: number) => width / 3;

export const TabVi = memo(({medi, isLoading, onEndReached, onImagePress}: TabViProps) => {
  const {height, width: screenWidth} = useWindowDimensions();
  const itemSize = ITEM_HEIGHT(screenWidth);

  const renderItem = useCallback(
    ({item}: {item: MediaItem}) => {
      const isValidUrl = item.media.url && item.media.url.trim() !== '';
      
      const imageContent = isValidUrl ? (
        <Image
          source={{uri: item.media.url}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder} />
      );

      if (onImagePress && isValidUrl) {
        return (
          <TouchableOpacity
            style={{
              width: itemSize - 1,
              height: itemSize,
              backgroundColor: '#f0f0f0',
            }}
            activeOpacity={0.8}
            onPress={() => onImagePress(item.media.url)}>
            {imageContent}
          </TouchableOpacity>
        );
      }

      return (
        <View
          style={{
            width: itemSize - 1,
            height: itemSize,
            backgroundColor: '#f0f0f0',
          }}>
          {imageContent}
        </View>
      );
    },
    [itemSize, onImagePress],
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
        height: height,
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
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
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