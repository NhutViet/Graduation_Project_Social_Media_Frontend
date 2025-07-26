import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  LayoutChangeEvent,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {likePost, unlikePost} from '@services/reactionRedux/reactionSlice';
import {
  addLikedPost,
  removeLikedPost,
} from '@services/reactionRedux/reactionReducer';
import {fetchCommentsByPost} from '@services/commentRedux/commentSlice';
import {Colors} from '../assets/color/Colors';
import BottomSheetReels, {
  BottomSheetReelsRef,
} from '../src/(tabs)/Reels/bottomSheet/reelBottomSheet';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../src/(tabs)/Home/components/CommentSection';
import ReelsComponent from '../src/(tabs)/Reels/components/reelsComponent';
import {Portal} from 'react-native-portalize';
import ModalShare from '../src/(tabs)/Home/components/ModalShare';
import {useShareModal} from '../src/(tabs)/Reels/hooks/useShareModal';
import {PostWithMedia} from '@services/postRedux/postTypes';
import {ArrowLeft} from 'lucide-react-native';
import LoadingModal from './Global/LoadingModal';
import {Item} from '@services/postUserRedux/postUserType';

type RootStackParamList = {
  AllReels: {
    initialId: string;
  };
};

type ReelsScreenRouteProp = RouteProp<RootStackParamList, 'AllReels'>;

const AllReels = () => {
  const navigation = useNavigation();
  const route = useRoute<ReelsScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();

  const {initialId} = route.params || {};
  const reelState = useSelector((state: RootState) => state.postUser.reels);
  const reels: Item[] = 'items' in reelState ? reelState.items : [];

  const [visibleHeight, setVisibleHeight] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const sheetRef = useRef<BottomSheetReelsRef>(null);
  const sheetRefComment = useRef<BottomSheetCommentRef>(null);
  const {modalShareRef, openShareModal} = useShareModal();

  const [currentVisible, setCurrentVisible] = useState<string | null>(
    initialId,
  );
  const [selectedItem, setSelectedItem] = useState<PostWithMedia | null>(null);
  const selectedPostRef = useRef<{postId: string; receiverId: string}>({
    postId: '',
    receiverId: '',
  });
  const [loading, setLoading] = useState(true);
  const [initialIndex, setInitialIndex] = useState<number>(0);

  const likedPostIds = useSelector(
    (state: RootState) => state.reactions.likePosts,
  );
  const currentUser = useSelector((state: RootState) => state.user.user);
  const refreshToken = useSelector(
    (state: RootState) => state.user.refreshToken,
  );

  useEffect(() => {
    const index = reels.findIndex((item: Item) => item._id === initialId);
    setInitialIndex(index >= 0 ? index : 0);
    setLoading(false);
  }, [initialId, reels]);

  const onLayout = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setVisibleHeight(height);
  };

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    const firstVisible = viewableItems?.[0]?.item?._id;
    if (firstVisible) setCurrentVisible(firstVisible);
  });

  const handleLike = useCallback(
    async (postId: string, isLiked: boolean) => {
      const matchedPost = reels.find((r: Item) => r._id === postId);
      const receiverId = matchedPost?.user?._id ?? '';
      const action = isLiked ? unlikePost : likePost;

      if (isLiked) {
        dispatch(removeLikedPost(postId));
      } else {
        dispatch(addLikedPost(postId));
      }

      try {
        await dispatch(
          action({
            postId,
            refreshToken,
            receiverId,
            handleName: currentUser?.handleName ?? '',
            userId: currentUser?._id,
          }),
        ).unwrap();
      } catch (error) {
        console.log('Like/unlike thất bại, khôi phục UI:', error);
        if (isLiked) {
          dispatch(addLikedPost(postId));
        } else {
          dispatch(removeLikedPost(postId));
        }
      }
    },
    [dispatch, refreshToken, currentUser, reels],
  );

  const openComment = useCallback(
    (item: PostWithMedia) => {
      selectedPostRef.current = {postId: item._id, receiverId: item.user._id};
      dispatch(fetchCommentsByPost(item._id));
      sheetRefComment.current?.open();
    },
    [dispatch],
  );

  const openBottomSheet = useCallback((item: PostWithMedia) => {
    setSelectedItem(item);
    sheetRef.current?.open();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <LoadingModal />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <ArrowLeft size={22} color={Colors.lightGray} />
      </TouchableOpacity>

      <View style={{flex: 1}} onLayout={onLayout}>
        {visibleHeight > 0 && (
          <FlatList
            ref={flatListRef}
            data={reels}
            keyExtractor={item => item._id}
            initialScrollIndex={initialIndex}
            renderItem={({item}) => {
              const isLiked = likedPostIds.includes(item._id);
              const isCurrentUser = currentUser?._id === item.user._id;
              const likeCount =
                (item.likeCount ?? 0) +
                (isLiked === item.isLike ? 0 : isLiked ? 1 : -1);

              return (
                <ReelsComponent
                  {...item}
                  containerHeight={visibleHeight}
                  isFocused={true}
                  currentVisible={item._id === currentVisible}
                  isFollow={item?.isFollow}
                  isLiked={isLiked}
                  isFollowing={item?.isFollow}
                  isCurrentUser={isCurrentUser}
                  likeCount={likeCount}
                  muted={false}
                  onLike={(liked: boolean) => handleLike(item._id, isLiked)}
                  onFollow={() => {}}
                  onMenu={() => openBottomSheet(item)}
                  openComment={() => openComment(item)}
                  onProfilePress={() => {}}
                  onTagPress={() => {}}
                  openReactionModal={() => {}}
                  openShareModal={() => openShareModal()}
                  setSkipReload={() => {}}
                />
              );
            }}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={{itemVisiblePercentThreshold: 70}}
            getItemLayout={(_, index) => ({
              length: visibleHeight,
              offset: visibleHeight * index,
              index,
            })}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        )}
      </View>

      <BottomSheetReels
        ref={sheetRef}
        isBookmarked={selectedItem?.isBookmarked}
        selectedItem={selectedItem}
      />
      <BottomSheetComment
        ref={sheetRefComment}
        selectedPostRef={selectedPostRef}
      />
      <Portal>
        <ModalShare ref={modalShareRef} isDark={true} />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 20,
    padding: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllReels;
