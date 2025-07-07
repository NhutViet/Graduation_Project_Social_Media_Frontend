import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {fetchHighlightStory} from '@services/StoryRedux/StorySlice';
import {clearHighlightStories} from '@services/StoryRedux/StoryReducer';
import {Plus} from 'lucide-react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {handleHighlightPress} from '../../Home/util/index';
import {useHighlightStoryPrefetch} from '../hooks/useHighlightStoryPrefetch';

const {width} = Dimensions.get('window');
const ITEM_SIZE = 70;

interface HighlightStoriesComponentProps {
  userId: string;
  isOwnProfile?: boolean; // Thêm prop để phân biệt profile của mình hay người khác
}

const HighlightStoriesComponent: React.FC<HighlightStoriesComponentProps> = ({
  userId,
  isOwnProfile = false, // Default là false (profile người khác)
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const {highlightStories, loading} = useSelector(
    (state: RootState) => state.stories,
  );
  const currentUser = useSelector((state: RootState) => state.user.user);

  // Lấy user data của profile owner
  const profileOwner = useSelector(
    (state: RootState) => state.user.publicProfile,
  );
  const user = isOwnProfile ? currentUser : profileOwner;

  // Sử dụng hook để pre-load highlight stories
  const {
    prefetchHighlightStoryData,
    getCachedHighlightStoryData,
    preloadInitialHighlights,
    clearExpiredCache,
  } = useHighlightStoryPrefetch();

  // ✅ Reset state khi userId thay đổi
  useEffect(() => {
    if (userId !== currentUserId) {
      setCurrentUserId(userId);
      setIsInitialLoad(true);

      // Clear highlight stories khi userId thay đổi
      dispatch(clearHighlightStories());
    }
  }, [userId, currentUserId, dispatch]);

  // ✅ Fetch highlight stories khi userId thay đổi hoặc component focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(fetchHighlightStory({userId}));
        // Force re-render khi focus
        setRefreshKey(prev => prev + 1);
      }
    }, [dispatch, userId, isOwnProfile]),
  );

  // ✅ Clear highlight stories chỉ khi component unmount
  useEffect(() => {
    return () => {
      dispatch(clearHighlightStories());
    };
  }, []); // Empty dependency array để chỉ chạy khi unmount

  // Pre-load initial highlights khi data được load
  useEffect(() => {
    if (!loading && highlightStories && highlightStories.length > 0) {
      // Pre-load 5 highlights đầu tiên
      preloadInitialHighlights(highlightStories);
    }
  }, [loading, highlightStories, preloadInitialHighlights]);

  // Hide skeleton after data is loaded
  useEffect(() => {
    if (!loading && highlightStories !== undefined) {
      setIsInitialLoad(false);
    }
  }, [loading, highlightStories, isOwnProfile, userId]);

  const handleAddHighlight = () => {
    navigation.navigate('Archive');
  };

  const handleHighlightItemPress = useCallback(
    async (highlight: any) => {
      if (!user) return;

      // Hiển thị modal loading
      setIsLoadingModalVisible(true);

      try {
        // Kiểm tra xem highlight đã được pre-load chưa
        const cachedData = getCachedHighlightStoryData(highlight._id);
        const isPreloaded = cachedData && cachedData.length > 0;

        // Sử dụng hàm handleHighlightPress có sẵn
        await handleHighlightPress(
          {
            ...highlight,
            storyIds: highlight.storyId || [],
          },
          dispatch,
          navigation,
          user,
          isOwnProfile, // isOwner = true nếu là profile của mình, false nếu là profile người khác
          highlightStories, // Truyền highlightStories để có thể chuyển qua highlight kế tiếp
        );

        // Tắt modal loading sau khi navigation hoàn tất
        setTimeout(() => {
          setIsLoadingModalVisible(false);
        }, 1000); // Delay 1s để đảm bảo UI story đã hiển thị và user có thể thấy loading
      } catch (error) {
        console.error('Error handling highlight press:', error);
        setIsLoadingModalVisible(false);
      }
    },
    [user, getCachedHighlightStoryData, dispatch, navigation, highlightStories],
  );

  const renderAddHighlightItem = () => (
    <TouchableOpacity style={styles.highlightItem} onPress={handleAddHighlight}>
      <View style={[styles.addHighlightCircle]}>
        <Plus size={24} color={color.text} />
      </View>
      <Text style={[styles.highlightTitle, {color: color.text}]}>Mới</Text>
    </TouchableOpacity>
  );

  const renderHighlightItem = useCallback(
    ({item}: {item: any}) => {
      // Kiểm tra xem highlight đã được pre-load chưa
      const cachedData = getCachedHighlightStoryData(item._id);
      const isPreloaded = cachedData && cachedData.length > 0;

      return (
        <TouchableOpacity
          style={styles.highlightItem}
          onPress={() => handleHighlightItemPress(item)}>
          <View style={styles.highlightCircle}>
            <Image
              source={{uri: item.thumbnail || item.mediaUrl}}
              style={styles.highlightImage}
            />
            {/* Hiển thị indicator nếu chưa pre-load xong */}
            {!isPreloaded && item.storyId?.length > 0 && (
              <View style={styles.preloadDot}>
                <View style={[styles.dot, {backgroundColor: color.blue}]} />
              </View>
            )}
          </View>
          <Text style={[styles.highlightTitle, {color: color.text}]}>
            {item.collectionName || 'Highlight'}
          </Text>
        </TouchableOpacity>
      );
    },
    [getCachedHighlightStoryData, handleHighlightItemPress, color],
  );

  const renderSkeletonItem = () => (
    <View style={styles.highlightItem}>
      <View style={[styles.highlightCircle, styles.skeletonCircle]}>
        <View style={styles.skeletonImage} />
      </View>
      <View style={styles.skeletonTitle} />
    </View>
  );

  // Generate skeleton data for 5 items
  const generateSkeletonData = () => {
    return Array.from({length: 5}, (_, index) => ({
      id: `skeleton-${index}`,
      type: 'skeleton',
    }));
  };

  const getDisplayData = () => {
    if (isInitialLoad) {
      // Show skeleton + add button during initial load (chỉ nếu là profile của mình)
      return isOwnProfile
        ? [{id: 'add', type: 'add'}, ...generateSkeletonData()]
        : generateSkeletonData();
    }

    // Show real data when loaded
    const highlights = (highlightStories ? [...highlightStories] : [])
      .filter(
        highlight =>
          // ✅ Chỉ hiển thị highlights có story
          highlight.storyId && highlight.storyId.length > 0,
      )
      .sort((a, b) => {
        // Sắp xếp theo createdAt, mới nhất lên đầu
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      })
      .map((item, index) => ({
        ...item,
        id: item._id || `highlight-${index}`,
      }));

    // Chỉ thêm nút "Mới" nếu là profile của mình
    return isOwnProfile
      ? [{id: 'add', type: 'add'}, ...highlights]
      : highlights;
  };

  const renderItem = ({item}: {item: any}) => {
    if (item.type === 'add') {
      return renderAddHighlightItem();
    }
    if (item.type === 'skeleton') {
      return renderSkeletonItem();
    }
    return renderHighlightItem({item});
  };

  const data = getDisplayData();

  return (
    <View style={styles.container}>
      <FlatList
        key={refreshKey}
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Loading Modal */}
      <Modal
        transparent
        visible={isLoadingModalVisible}
        animationType="fade"
        onRequestClose={() => setIsLoadingModalVisible(false)}>
        <View style={styles.loadingModalOverlay}>
          <View style={styles.loadingModalContent}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.modalLoadingText}>Đang tải story...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,

    flexShrink: 0,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 16,
    width: ITEM_SIZE,
  },
  addHighlightCircle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#E0E0E0',
  },
  highlightCircle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  highlightImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  highlightTitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '400',
  },
  skeletonCircle: {
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
  },
  skeletonImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  skeletonTitle: {
    width: 40,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    paddingVertical: 20,
  },
  preloadDot: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 120,
  },
  modalLoadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
});

export default HighlightStoriesComponent;
