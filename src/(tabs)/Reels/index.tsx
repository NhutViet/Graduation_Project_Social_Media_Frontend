import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReelsComponent from './components/reelsComponent';
import {useIsFocused} from '@react-navigation/native';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Dimensions} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {fetchReelsWithMedia} from '../../../services/postRedux/postSlice';
import BottomSheetReels, {
  BottomSheetReelsRef,
} from './bottomSheet/reelBottomSheet';
import {fetchCommentsByPost} from '../../../services/commentRedux/commentSlice';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../Home/components/CommentSection';
import {useFocusEffect} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import ModalShare from '../Home/components/ModalShare';
import {Portal} from 'react-native-portalize';
import { trimOldReels } from '@services/postRedux/postReducer';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const MAX_ITEMS_IN_MEMORY = 50; // Keep max 50 items in memory
const ITEMS_TO_REMOVE = 20; // Remove 20 items when limit is reached

const Reels = forwardRef((props, ref) => {
  const isFocused = useIsFocused();

  const sheetRef: any = useRef<BottomSheetReelsRef>(null);
  const sheetRefComment: any = useRef<BottomSheetCommentRef>(null);
  const modalShareRef = useRef<Modalize>(null);
  const flashListRef = useRef<FlashList<any>>(null);

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);
  const [isCurrentBookmarked, setIsCurrentBookmarked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const id = visibleItem?.item?._id;
      const index = visibleItem?.index;
      
      if (id && index !== undefined) {
        setCurrentVisible(id);
        setCurrentVisibleIndex(index);
        
        const totalItems = reels.length;
        const isNearEnd = index >= totalItems - 2; // Load new page when 2 items from end
        
        if (isNearEnd && !loading && !isLoadingMore && hasNextPage && canLoadMore) {
          console.log('Triggering load more at index:', index, 'of', totalItems);
          setIsLoadingMore(true);
          setCanLoadMore(false); // Prevent immediate re-trigger
          dispatch(fetchReelsWithMedia({ page: page + 1 }));
        }
      }
    }
  });

  const handleOpenShareModal = useCallback(() => {
    modalShareRef.current?.open();
  }, []);

  useImperativeHandle(ref, () => ({
    reload: () => {
      setIsInitialLoad(true);
      dispatch(fetchReelsWithMedia({ page: 1 }));
    },
  }));

  // fetch api
  const dispatch = useDispatch<AppDispatch>();
  const { reels, loading, page, hasNextPage } = useSelector(
    (state: RootState) => state.post
  );

  useFocusEffect(
    useCallback(() => {
      setIsInitialLoad(true);
      setCanLoadMore(true);
      dispatch(fetchReelsWithMedia({ page: 1 }));
    }, [dispatch])
  );

  useEffect(() => {
    if (!loading && page >= 1 && isInitialLoad) {
      setIsInitialLoad(false);
    }
    
    // Reset loading more flag when loading completes and re-enable loading after delay
    if (!loading && isLoadingMore) {
      setIsLoadingMore(false);
      // Add a small delay before allowing next load to prevent immediate re-trigger
      setTimeout(() => {
        setCanLoadMore(true);
      }, 1000); 
    }
  }, [loading, page, isInitialLoad, isLoadingMore]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasNextPage && !isLoadingMore && canLoadMore) {
      console.log('Backup load more triggered');
      setIsLoadingMore(true);
      setCanLoadMore(false);
      dispatch(fetchReelsWithMedia({ page: page + 1 }));
    }
  }, [loading, hasNextPage, isLoadingMore, canLoadMore, dispatch, page]);

  // Remove old items when too many are loaded
  useEffect(() => {
    if (reels.length > MAX_ITEMS_IN_MEMORY) {
      dispatch(trimOldReels(ITEMS_TO_REMOVE));
    }
  }, [reels.length]);

  const [selectedPostId, setSelectedPostId] = useState<string>('');

  if (loading && isInitialLoad) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.black,
        }}>
        <ActivityIndicator size="large" color={Colors.white} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.rowContainer}>
          <Text style={styles.textHeader}>Reels</Text>
          <View style={styles.iconDownContainer}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/down.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
      <FlashList
        ref={flashListRef}
        data={reels}
        extraData={[currentVisible, isFocused]}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        // Memory optimization props
        removeClippedSubviews={true}
        getItemType={() => 'reel'}
        ListFooterComponent={
          loading && !isInitialLoad
            ? () => (
                <View style={{ padding: 12 }}>
                  <ActivityIndicator color={Colors.white} />
                </View>
              )
            : null
        }
        renderItem={({item, index}: any) => {
          const shouldPlay = item?._id === currentVisible;
          return (
            <ReelsComponent
              {...item}
              isFocused={isFocused}
              currentVisible={shouldPlay}
              isFollow={item?.isFollow}
              muted={false}
              showBottomSheet={() => {
                setSelectedItem(item);
                setIsCurrentBookmarked(item.isBookmarked);
                sheetRef?.current.open();
              }}
              openComment={() => {
                setSelectedPostId(item._id);
                dispatch(fetchCommentsByPost(item._id));
                sheetRefComment.current?.open();
              }}
              openReactionModal={() => {}}
              openShareModal={handleOpenShareModal}
            />
          );
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 300,
        }}
        estimatedItemSize={height}
        keyExtractor={(item) => item._id}
        maintainVisibleContentPosition={null}
      />
      <BottomSheetReels
        ref={sheetRef}
        isBookmarked={isCurrentBookmarked}
        selectedItem={selectedItem}
      />
      <BottomSheetComment ref={sheetRefComment} postId={selectedPostId} />

      <Portal>
        <ModalShare ref={modalShareRef} />
      </Portal>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    position: 'absolute',
    width: width,
    top: 0,
    zIndex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginRight: 8,
  },
  iconDownContainer: {
    width: 12,
    height: 12,
  },
  iconContainer: {
    width: 20,
    height: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
});

export default Reels;