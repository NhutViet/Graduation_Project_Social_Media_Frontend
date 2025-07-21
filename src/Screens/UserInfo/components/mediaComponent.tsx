import React, { memo, useCallback, useState } from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { MediaItem } from '../../../util/msgImgList';
import { FlashList } from '@shopify/flash-list';
import LoadingModal from '../../../../components/Global/LoadingModal';
import { X } from 'lucide-react-native';

interface TabViProps {
  medi: MediaItem[] | undefined;
  isLoading: boolean;
  onEndReached?: () => void;
}

const ITEM_HEIGHT = (width: number) => width / 3;
export const TabVi = memo(({ medi, isLoading, onEndReached }: TabViProps) => {
  const { height, width: screenWidth } = useWindowDimensions();
  const itemSize = ITEM_HEIGHT(screenWidth);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const openPreview = useCallback((imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  }, []);

  const closePreview = useCallback(() => {
    setSelectedImageUrl(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MediaItem }) => {
      const isValidUrl = item.media.url && item.media.url.trim() !== '';

      return (
        <View
          style={{
            width: itemSize - 1,
            height: itemSize,
            backgroundColor: '#f0f0f0',
          }}>
          {isValidUrl ? (
            <TouchableOpacity
              style={{
                width: itemSize - 1,
                height: itemSize,
                padding: 1,
              }}
              activeOpacity={0.8}
              onPress={() => openPreview(item.media.url)}>
              <Image
                source={{ uri: item.media.url }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      );
    },
    [itemSize, openPreview],
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
    <>
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

      {/* Full Screen Image Preview Modal */}
      <Modal
        visible={!!selectedImageUrl}
        transparent={true}
        animationType="fade"
        onRequestClose={closePreview}>
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            onPress={closePreview}
            activeOpacity={0.8}>
          </TouchableOpacity>
          {selectedImageUrl && (
            <TouchableOpacity
              style={styles.imageContainer}
              activeOpacity={1}
              onPress={closePreview}>
              <Image
                source={{ uri: selectedImageUrl }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});
