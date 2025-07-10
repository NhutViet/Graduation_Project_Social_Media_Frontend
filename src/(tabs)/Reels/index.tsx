import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../../assets/color/Colors';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../services/store';
import { fetchCommentsByPost } from '../../../services/commentRedux/commentSlice';
import { Portal } from 'react-native-portalize';
import ModalShare from '../Home/components/ModalShare';
import { useReels } from './hooks/useReels';
import { useShareModal } from './hooks/useShareModal';
import { Modalize } from 'react-native-modalize';
import { fetchReelsWithMedia } from '@services/postRedux/postSlice';
import ReelsList from './components/ReelsLists';
import ReelsBottomSheets from './components/ReelsBottomSheets';

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

  const { modalShareRef, openShareModal } = useShareModal();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isCurrentBookmarked, setIsCurrentBookmarked] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState({ postId: '', receiverId: '' });

  const openBottomSheet = (item: any) => {
    setSelectedItem(item);
    setIsCurrentBookmarked(item.isBookmarked);
    sheetRef?.current?.open();
  };

  const openCommentSheet = (item: any) => {
    setSelectedPostId({ postId: item._id, receiverId: item.user._id });
    dispatch(fetchCommentsByPost(item._id));
    sheetRefComment.current?.open();
  };

  useImperativeHandle(ref, () => ({
    reload: () => {
      setIsInitialLoad(true);
      setSkipReload(false);
      dispatch(fetchReelsWithMedia({ page: 1 }));
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
        dispatch(fetchReelsWithMedia({ page: 1 }));
      }
    }, [dispatch, skipReload, reels.length, isInitialLoad])
  );

  if (loading && isInitialLoad) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.white} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        selectedPostId={selectedPostId}
      />
      <Portal>
        <ModalShare ref={modalShareRef} isDark={true} />
      </Portal>
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
});

export default Reels;