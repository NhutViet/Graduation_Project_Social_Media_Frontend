import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@services/store';
import {fetchCommentsByPost} from '@services/commentRedux/commentSlice';
import {Colors} from '../assets/color/Colors';
import BottomSheetReels, {
  BottomSheetReelsRef,
} from '../src/(tabs)/Reels/bottomSheet/reelBottomSheet';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../src/(tabs)/Home/components/CommentSection';
import ReelsComponent from '../src/(tabs)/Reels/components/reelsComponent';

const {height} = Dimensions.get('window');

const AllReels = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const dispatch = useDispatch<AppDispatch>();
  const {reels = [], initialId} = route.params || {};

  const flatListRef = useRef<FlatList<any>>(null);
  const sheetRef = useRef<BottomSheetReelsRef>(null);
  const sheetRefComment = useRef<BottomSheetCommentRef>(null);

  const [currentVisible, setCurrentVisible] = useState<string | null>(
    initialId,
  );
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedPostId, setSelectedPostId] = useState({
    postId: '',
    receiverId: '',
  });
  const [loading, setLoading] = useState(true);
  const [initialIndex, setInitialIndex] = useState<number>(0);

  useEffect(() => {
    const index = reels.findIndex((item: any) => item._id === initialId);
    setInitialIndex(index >= 0 ? index : 0);
    setLoading(false);
  }, [initialId, reels]);

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    const firstVisible = viewableItems?.[0]?.item?._id;
    if (firstVisible) setCurrentVisible(firstVisible);
  });

  const openComment = useCallback(
    (item: any) => {
      setSelectedPostId({postId: item._id, receiverId: item.user._id});
      dispatch(fetchCommentsByPost(item._id));
      sheetRefComment.current?.open();
    },
    [dispatch],
  );

  const openBottomSheet = useCallback((item: any) => {
    setSelectedItem(item);
    sheetRef.current?.open();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <TouchableOpacity
        style={[styles.backButton]}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/icon/left.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={reels}
        keyExtractor={item => item._id}
        initialScrollIndex={initialIndex}
        renderItem={({item}) => (
          <ReelsComponent
            containerHeight={height}
            {...item}
            isFocused={true}
            currentVisible={item._id === currentVisible}
            isFollow={item?.isFollow}
            muted={false}
            showBottomSheet={() => openBottomSheet(item)}
            openComment={() => openComment(item)}
            openReactionModal={() => {}}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{itemVisiblePercentThreshold: 70}}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
      />

      <BottomSheetReels
        ref={sheetRef}
        isBookmarked={selectedItem?.isBookmarked}
        selectedItem={selectedItem}
      />
      <BottomSheetComment
        ref={sheetRefComment}
        postId={selectedPostId.postId}
        receiverId={selectedPostId.receiverId}
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
