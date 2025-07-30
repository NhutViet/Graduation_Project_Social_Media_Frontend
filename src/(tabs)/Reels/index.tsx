import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Dimensions, Share} from 'react-native';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {Colors} from '../../../assets/color/Colors';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../services/store';
import {fetchCommentsByPost} from '../../../services/commentRedux/commentSlice';
import {useReels} from './hooks/useReels';
import {Modalize} from 'react-native-modalize';
import {fetchReelsWithMedia} from '@services/postRedux/postSlice';
import ReelsList from './components/ReelsLists';
import ReelsBottomSheets from './components/ReelsBottomSheets';
import {PostWithMedia} from '@services/postRedux/postTypes';
import ReelsHeader from './components/ReelsHeader';
import {ReelsSkeletonList} from '../../../components/SkeletonGrid';

const {height: screenHeight} = Dimensions.get('window');

const Reels = forwardRef((props, ref) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();

  const sheetRef = useRef<Modalize>(null);
  const sheetRefComment = useRef<Modalize>(null);
  const flashListRef = useRef(null);

  const {
    reels,
    loading,
    page,
    hasNextPage,
    currentVisible,
    isInitialLoad,
    handleLoadMore,
    onViewRef,
    setIsInitialLoad,
    setCanLoadMore,
    setSkipReload,
    skipReload,
  } = useReels();

  const openShareModal = async () => {
    try {
      await Share.share({message: 'justina'});
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const [selectedItem, setSelectedItem] = useState<PostWithMedia>();
  const [isCurrentBookmarked, setIsCurrentBookmarked] = useState(false);
  const selectedPostRef = useRef<{postId: string; receiverId: string}>({
    postId: '',
    receiverId: '',
  });

  const openBottomSheet = (item: PostWithMedia) => {
    setSelectedItem(item);
    setIsCurrentBookmarked(item.isBookmarked ?? false);
    sheetRef?.current?.open();
  };

  const openCommentSheet = (item: PostWithMedia) => {
    selectedPostRef.current = {postId: item._id, receiverId: item.user._id};
    dispatch(fetchCommentsByPost(item._id));
    sheetRefComment.current?.open();
  };

  useImperativeHandle(ref, () => ({
    reload: () => {
      setIsInitialLoad(true);
      setSkipReload(false);
      dispatch(fetchReelsWithMedia({page: 1}));
    },
  }));

  useFocusEffect(
    React.useCallback(() => {
      if (skipReload) {
        setSkipReload(false);
        return;
      }

      if (reels.length === 0 || isInitialLoad) {
        setIsInitialLoad(true);
        setCanLoadMore(true);
        dispatch(fetchReelsWithMedia({page: 1}));
      }
    }, [dispatch, skipReload, reels.length, isInitialLoad]),
  );

  if (loading && isInitialLoad) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerOverlay}>
          <ReelsHeader />
        </View>
        <ReelsSkeletonList containerHeight={screenHeight} itemCount={3} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerOverlay}>
        <ReelsHeader />
      </View>
      <ReelsList
        reels={reels}
        currentVisible={currentVisible}
        isFocused={isFocused}
        loading={loading}
        isInitialLoad={isInitialLoad}
        flashListRef={flashListRef}
        onViewRef={onViewRef}
        handleLoadMore={handleLoadMore}
        openBottomSheet={openBottomSheet}
        openCommentSheet={openCommentSheet}
        openShareModal={openShareModal}
        setSkipReload={setSkipReload}
      />
      <ReelsBottomSheets
        sheetRef={sheetRef}
        sheetRefComment={sheetRefComment}
        isBookmarked={isCurrentBookmarked}
        selectedItem={selectedItem}
        selectedPostId={selectedPostRef}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
});

export default Reels;
