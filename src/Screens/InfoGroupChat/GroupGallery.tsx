import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Image,
  Text,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {ArrowLeft, X} from 'lucide-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {MediaItem, getAllMediaInRoom} from '../../util/msgImgList';
import LoadingModal from '../../../components/Global/LoadingModal';
import ImagePreviewModal from '../Message/components/ImagePreviewModal';

const width = Dimensions.get('window').width;
// helper func
const calculateItemSize = (
  screenWidth: number,
  numColumns: number,
  spacing: number,
) => {
  const totalSpacing = (numColumns - 1) * spacing;
  const availableWidth = screenWidth - totalSpacing;
  return availableWidth / numColumns;
};

export const GroupGallery = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation();
  const route = useRoute();
  const {width} = useWindowDimensions();
  const roomId = (route.params as {roomId: string})?.roomId;

  // State to manage MessageMedia fetching data
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaPage, setMediaPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const NUM_COLUMNS = 3;
  const ITEM_SPACING = 2;
  const ITEM_SIZE = calculateItemSize(width, NUM_COLUMNS, ITEM_SPACING);

  useEffect(() => {
    const fetchInitialMedia = async () => {
      if (!roomId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      try {
        const res = await getAllMediaInRoom({roomId, page: 1});
        if (res && res.media && res.media.length > 0) {
          setMedia(res.media);
          setMediaPage(2);
          setHasNextPage(true);
        } else {
          setMedia([]);
          setHasNextPage(false);
        }
      } catch (error) {
        setMedia([]);
        setHasNextPage(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMedia();
  }, [roomId]);

  // Handle loading more media
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage || !roomId) {
      return;
    }
    setIsLoadingMore(true);

    try {
      const res = await getAllMediaInRoom({roomId, page: mediaPage});
      if (res && res.media && res.media.length > 0) {
        setMedia(prev => [...prev, ...res.media]);
        setMediaPage(prevPage => prevPage + 1);
      } else {
        setHasNextPage(false);
      }
    } catch (error) {
      setHasNextPage(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasNextPage, roomId, mediaPage]);

  const openPreview = (uri: string) => {
    setPreviewUri(uri);
    setPreviewVisible(true);
  };

  const renderItem = useCallback(
    ({item}: {item: MediaItem}) => (
      <TouchableOpacity
        style={{
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          padding: 1,
        }}
        activeOpacity={0.8}
        onPress={() => openPreview(item.media.url)}>
        <Image source={{uri: item.media.url}} style={styles.image} />
      </TouchableOpacity>
    ),
    [ITEM_SIZE],
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={[styles.header, {height: 56}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={color.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, {color: color.text}]}>Ảnh, video</Text>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <LoadingModal />
        </View>
      ) : (
        <FlashList
          data={media}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          numColumns={NUM_COLUMNS}
          estimatedItemSize={ITEM_SIZE}
          contentContainerStyle={{paddingHorizontal: ITEM_SPACING / 2}}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.loading}>
                <LoadingModal />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.text, {color: color.textSecondary}]}>
                Không có ảnh hoặc file nào trong cuộc trò chuyện này
              </Text>
            </View>
          }
        />
      )}

      <ImagePreviewModal
        visible={previewVisible}
        imageUri={previewUri}
        onClose={() => setPreviewVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
  },
  fullImage: {
    width: width - 32,
    minHeight: width,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
});
