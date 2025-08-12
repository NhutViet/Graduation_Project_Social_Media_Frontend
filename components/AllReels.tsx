import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  LayoutChangeEvent,
  Share,
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
import {PostWithMedia} from '@services/postRedux/postTypes';
import {ArrowLeft} from 'lucide-react-native';
import LoadingModal from './Global/LoadingModal';
import {Item} from '@services/postUserRedux/postUserType';
import {updateLikeByPostId} from '@services/postRedux/postReducer';
import {updateLikePostUser} from '@services/postUserRedux/postUserReducer';
import {UserProfile} from '@services/relationRedux/relationTypes';
import ModalOtherReport, {
  ModalOtherReportHandle,
} from '../src/(tabs)/Home/components/ModalOtherReport';
import {reportPost} from '@services/reportPost/reportSlice';
import {hidePost} from '@services/postRedux/postSlice';
import {GlobalAlertManager} from './Global/AlertModal';
import {useHeadAlert} from './Global/HeadAlertProvider';
import {CustomBottomSheetOptionsRef} from '../src/(tabs)/Home/components/BottomSheetOptionsModal';
import BottomSheetIntentionsModal from '../src/(tabs)/Home/components/BottomSheetIntentionsModal';
import {reportChoices} from '../src/config/postOptions';

type RootStackParamList = {
  AllReels: {
    initialId: string;
    data: Item[];
  };
};

type ReelsScreenRouteProp = RouteProp<RootStackParamList, 'AllReels'>;

const AllReels = () => {
  const navigation = useNavigation();
  const route = useRoute<ReelsScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();

  const {initialId, data} = route.params || {};
  const [reels, setReels] = useState<Item[]>(data || []);

  const [visibleHeight, setVisibleHeight] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const sheetRef = useRef<BottomSheetReelsRef>(null);
  const sheetRefComment = useRef<BottomSheetCommentRef>(null);
  const otherReportRef = useRef<ModalOtherReportHandle>(null);
  const intentRef = useRef<CustomBottomSheetOptionsRef>(null);
  const {showAlert} = useHeadAlert();

  const openShareModal = async (_id: string) => {
    try {
      await Share.share({message: `https://cirla.io.vn/share/${_id}`});
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

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

  const currentUser = useSelector((state: RootState) => state.user.user);
  const refreshToken = useSelector(
    (state: RootState) => state.user.refreshToken,
  );
  const likedPostIds = useSelector(
    (state: RootState) => state.reactions.likePosts,
  );

  useEffect(() => {
    // khởi tạo vị trí ban đầu và tắt loading
    const index = reels.findIndex((item: Item) => item._id === initialId);
    setInitialIndex(index >= 0 ? index : 0);
    setLoading(false);
  }, [initialId, reels]);

  useEffect(() => {
    data.forEach(item => {
      if (item.isLike) {
        dispatch(addLikedPost(item._id));
      } else {
        dispatch(removeLikedPost(item._id));
      }
    });
  }, [dispatch, data]);

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
      dispatch(updateLikeByPostId({postId, isLike: !isLiked}));
      dispatch(updateLikePostUser({postId, isLike: !isLiked}));

      try {
        await dispatch(
          action({
            postId,
            refreshToken,
            receiverId,
            handleName: currentUser?.username ?? '',
            userId: currentUser?._id,
          }),
        ).unwrap();
      } catch (error) {
        if (isLiked) {
          dispatch(addLikedPost(postId));
        } else {
          dispatch(removeLikedPost(postId));
        }
        dispatch(updateLikeByPostId({postId, isLike: isLiked}));
        dispatch(updateLikePostUser({postId, isLike: isLiked}));
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

  const handleHidePost = useCallback(() => {
    dispatch(hidePost(selectedItem ? selectedItem._id : ''))
      .unwrap().then(() => {
        if(reels.length === 1 && reels[0]._id === selectedItem?._id) navigation.goBack();
        setReels(prev => prev.filter(i => i._id !== selectedItem?._id));
      })
      .catch(() => GlobalAlertManager.show('Thất bại', 'Ẩn bài viết lỗi'));
  }, [selectedItem, dispatch]);

  const handleIntentionSelect = useCallback(
    (label: string, description?: string) => {
      if (label !== 'other') {
        dispatch(
          reportPost({
            targetId: selectedItem ? selectedItem._id : '',
            reason: label,
          }),
        )
          .unwrap()
          .then(() => {
            showAlert(
              'Thành công',
              'Bài viết này sẽ được báo cáo và kiểm duyệt.',
            );
            handleHidePost();
            intentRef.current?.close();
          })
          .catch(() => {
            showAlert('Thất bại', 'Có lỗi xảy ra khi báo cáo.');
          });
      } else {
        otherReportRef.current?.open();
      }
    },
    [selectedItem],
  );

  const intentionOptions = useMemo(
    () =>
      reportChoices.map(opt => ({
        ...opt,
        onPress: () => handleIntentionSelect(opt.id),
      })),
    [handleIntentionSelect],
  );

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
        {visibleHeight > 0 && initialIndex >= 0 && (
          <FlatList
            ref={flatListRef}
            data={reels}
            keyExtractor={item => item._id}
            initialScrollIndex={initialIndex}
            renderItem={({item}) => {
              const isLiked = likedPostIds.includes(item._id) ?? false;
              const isCurrentUser = currentUser?._id === item.user._id;

              const currentLikeCount =
                (item.likeCount ?? 0) +
                (isLiked === item.isLike ? 0 : isLiked ? 1 : -1);

              return (
                <ReelsComponent
                  {...item}
                  containerHeight={visibleHeight}
                  isFocused={true}
                  currentVisible={item._id === currentVisible}
                  isLiked={isLiked}
                  isFollowing={item?.isFollow}
                  isCurrentUser={isCurrentUser}
                  likeCount={currentLikeCount}
                  muted={false}
                  onLike={() => handleLike(item._id, isLiked)}
                  onFollow={() => {}}
                  onMenu={() => openBottomSheet(item)}
                  openComment={() => openComment(item)}
                  onProfilePress={() => {}}
                  onTagPress={() => {}}
                  openReactionModal={() => {}}
                  openShareModal={() => openShareModal(item._id)}
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
            extraData={[likedPostIds]}
          />
        )}
      </View>

      <BottomSheetReels
        ref={sheetRef}
        isBookmarked={selectedItem?.isBookmarked}
        selectedItem={selectedItem}
        handleReportPost={() => {
          sheetRef.current?.close();
          intentRef.current?.open();
        }}
      />
      <BottomSheetIntentionsModal
        ref={intentRef}
        options={intentionOptions}
        onSelect={handleIntentionSelect}
      />
      <BottomSheetComment
        ref={sheetRefComment}
        selectedPostRef={selectedPostRef}
      />
      <ModalOtherReport
        ref={otherReportRef}
        onSubmit={desc => {
          dispatch(
            reportPost({
              targetId: selectedItem ? selectedItem._id : '',
              reason: 'OTHER',
              description: desc,
            }),
          )
            .unwrap()
            .then(() => {
              showAlert(
                'Thành công',
                'Bài viết sẽ được báo cáo và kiểm duyệt.',
              );
              handleHidePost();
              otherReportRef.current?.close();
            })
            .catch(() => {
              showAlert('Thất bại', 'Có lỗi xảy ra khi báo cáo.');
            });
        }}
      />
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllReels;
