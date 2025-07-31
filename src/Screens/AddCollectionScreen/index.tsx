import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { ChevronLeft, Check, CircleX } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../util/ThemeContext';
import { Colors } from '../../../assets/color/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../services/store';
import {
  createPlaylist,
  getItemsOfPlaylist,
  switchBookmark,
} from '../../../services/bookmarkRedux/bookmarkSlice';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';
import { checkProfanityAndAlert } from '../../util/profanityFilter';
import {
  Media,
  MediaR,
  PlaylistItem,
} from '@services/bookmarkRedux/bookmarkTypes';
import { PlayCircle, ImageIcon } from 'lucide-react-native';
import { createThumbnail } from 'react-native-create-thumbnail';


// Cache for generated thumbnails to avoid regenerating
const thumbnailCache = new Map<string, string | null>();

// Generate thumbnail for video with caching
async function generateVideoThumbnail(videoUrl: string) {
  // Check cache first
  if (thumbnailCache.has(videoUrl)) {
    return thumbnailCache.get(videoUrl);
  }

  try {
    const result = await createThumbnail({
      url: videoUrl,
      timeStamp: 1000,
    });

    if (!result.path) {
      thumbnailCache.set(videoUrl, null);
      return null;
    }

    // Android needs file:// prefix
    const finalPath = Platform.OS === 'android' && !result.path.startsWith('file://')
      ? `file://${result.path}`
      : result.path;

    // Cache the result
    thumbnailCache.set(videoUrl, finalPath);
    return finalPath;
  } catch (error) {
    thumbnailCache.set(videoUrl, null);
    return null;
  }
};

export const AddCollectionScreen = () => {
  const { theme } = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const { itemsByPlaylist, playlists } = useSelector(
    (state: RootState) => state.bookmark,
  );

  useEffect(() => {
    if (playlists && playlists.length > 0) {
      playlists.forEach(playlist => {
        dispatch(getItemsOfPlaylist({ playlistId: playlist._id, refreshToken }));
      });
    }
  }, [playlists]);

  const allItems = useMemo(() => {
    return Object.values(itemsByPlaylist)
      .flat()
      .filter(item => {
        if (!item?.media || item.media.length === 0) return false;

        // Use consistent property access
        const isVideo = (item as any).type === 'reel';
        const mediaItem = item.media[0];

        if (isVideo) {
          if ('videoUrl' in mediaItem) {
            const videoUrl = (mediaItem as any).videoUrl;
            return videoUrl && videoUrl.trim().length > 0;
          }
          return false;
        } else {
          if ('imageUrl' in mediaItem) {
            const imageUrl = (mediaItem as any).imageUrl;
            return imageUrl && imageUrl.trim().length > 0;
          }
          return false;
        }
      });
  }, [itemsByPlaylist]);

  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedPostIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  ///////////////redux
  const dispatch = useDispatch<AppDispatch>();
  const { refreshToken } = useSelector((state: RootState) => state.user);
  const { isloading } = useSelector((state: RootState) => state.bookmark);

  const handleSave = async () => {
    if (!name.trim()) {
      GlobalAlertManager.show('Lỗi', 'Vui lòng nhập tên bộ sưu tập');
      return;
    }

    if (checkProfanityAndAlert(name)) {
      return;
    }

    if (selectedPostIds.length === 0) {
      GlobalAlertManager.show('Lỗi', 'Vui lòng chọn ít nhất 1 bài viết');
      return;
    }

    if (isloading) return;

    try {
      // 1. Tạo playlist mới
      const newPlaylist = await dispatch(
        createPlaylist({ playlistName: name.trim(), refreshToken }),
      ).unwrap();

      const newPlaylistId = newPlaylist._id;

      // 2. Gọi API chuyển nhiều bài
      await dispatch(
        switchBookmark({
          playlistId: newPlaylistId,
          postIds: selectedPostIds,
          refreshToken,
        }),
      ).unwrap();

      GlobalAlertManager.show('Thông báo', 'Tạo danh sách mới thành công.');

      navigation.goBack();
    } catch (err) {
      GlobalAlertManager.show('Lỗi', 'Không thể tạo bộ sưu tập');
    }
  };

  const PostItem = React.memo<{ item: PlaylistItem; isSelected: boolean; onToggle: (id: string) => void }>(
    ({ item, isSelected, onToggle }) => {
      const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(true);

      const isVideo = (item as any).type === 'reel';
      const mediaItem = item.media?.[0];

      const videoUrl = useMemo(() =>
        isVideo && mediaItem && 'videoUrl' in mediaItem ? (mediaItem as any).videoUrl : null,
        [isVideo, mediaItem]
      );

      const imageUrl = useMemo(() =>
        !isVideo && mediaItem && 'imageUrl' in mediaItem ? (mediaItem as any).imageUrl : null,
        [isVideo, mediaItem]
      );

      useEffect(() => {
        let isMounted = true;

        const loadThumbnail = async () => {
          if (!mediaItem) {
            if (isMounted) {
              setIsLoading(false);
              setThumbnailUri(null);
            }
            return;
          }

          const isValidUrl = (url: string | null | undefined): boolean => {
            if (!url || typeof url !== 'string') return false;
            const trimmed = url.trim();
            return trimmed.length > 0 && (trimmed.startsWith('http') || trimmed.startsWith('file://'));
          };

          if (isVideo && videoUrl) {
            if (!isValidUrl(videoUrl)) {
              if (isMounted) {
                setIsLoading(false);
                setThumbnailUri(null);
              }
              return;
            }

            try {
              // Generate thumbnail for video and use it in Image component
              const thumbnail = await generateVideoThumbnail(videoUrl);
              if (isMounted) {
                setThumbnailUri(thumbnail || videoUrl); // Fallback to video URL if thumbnail fails
                setIsLoading(false);
              }
            } catch (error) {
              // Fallback to video URL for Image component
              if (isMounted) {
                setThumbnailUri(videoUrl);
                setIsLoading(false);
              }
            }
          } else if (!isVideo && imageUrl) {
            if (!isValidUrl(imageUrl)) {
              if (isMounted) {
                setIsLoading(false);
                setThumbnailUri(null);
              }
              return;
            }

            if (isMounted) {
              setThumbnailUri(imageUrl);
              setIsLoading(false);
            }
          } else {
            if (isMounted) {
              setIsLoading(false);
              setThumbnailUri(null);
            }
          }
        };

        loadThumbnail();

        return () => {
          isMounted = false;
        };
      }, [item._id, isVideo, videoUrl, imageUrl]);

      if (isLoading) {
        return (
          <View style={styles.postItem}>
            <View style={[styles.postImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#999', fontSize: 10 }}>...</Text>
            </View>
          </View>
        );
      }

      if (!thumbnailUri) return null;

      return (
        <TouchableOpacity
          onPress={() => onToggle(item._id!)}
          style={styles.postItem}>
          <Image
            source={{ uri: thumbnailUri }}
            style={styles.postImage}
            resizeMode="cover"
          />
          <View style={styles.iconOverlay}>
            {isVideo ? (
              <PlayCircle size={14} color="#fff" />
            ) : (
              <ImageIcon size={14} color="#fff" />
            )}
          </View>
          {isSelected && (
            <View style={styles.overlayCheck}>
              <Check size={18} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      );
    },
    (prevProps, nextProps) => {
      return prevProps.isSelected === nextProps.isSelected &&
        prevProps.item._id === nextProps.item._id;
    }
  );

  const renderPostItem = useCallback(
    ({ item }: { item: PlaylistItem }) => {
      const isSelected = selectedPostIds.includes(item._id!);
      return (
        <PostItem
          item={item}
          isSelected={isSelected}
          onToggle={toggleSelect}
        />
      );
    },
    [selectedPostIds, toggleSelect],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={color.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: color.text }]}>
            Bộ sưu tập mới
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.nameInput}>
          <TextInput
            placeholder="Tên bộ sưu tập"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: color.text }]}
          />
          {name.length > 0 && (
            <TouchableOpacity onPress={() => setName('')}>
              <CircleX size={20} color={color.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {allItems.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 32, color: color.text }}>
          Không có bài viết nào đã lưu.
        </Text>
      ) : (
        <FlatList
          data={allItems}
          keyExtractor={item => item._id!}
          numColumns={3}
          renderItem={renderPostItem}
          contentContainerStyle={styles.gridContainer}
          removeClippedSubviews={true}
          maxToRenderPerBatch={15}
          windowSize={10}
          initialNumToRender={12}
          updateCellsBatchingPeriod={50}
          getItemLayout={(data, index) => ({
            length: 120, // Approximate item height
            offset: 120 * Math.floor(index / 3),
            index,
          })}
        />
      )}

      {selectedPostIds.length > 0 && (
        <TouchableOpacity
          style={[styles.saveButton, isloading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={isloading}>
          <Text style={styles.saveButtonText}>
            {isloading ? 'Đang lưu...' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  nameInput: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: 6,
    paddingBottom: 100,
  },
  postItem: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  overlayCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  iconOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
