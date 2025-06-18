import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Reel, styles} from '../../StyleSheet/ViewReels';
import ReelItem from './item';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../../(tabs)/Home/components/CommentSection';
import {useNavigation} from '@react-navigation/native';
// import {useReelLike} from './hook';
const {width, height} = Dimensions.get('window');

import BottomSheetReels, {
  BottomSheetReelsRef,
} from '../../(tabs)/Reels/bottomSheet/reelBottomSheet';
import {ArrowLeft} from 'lucide-react-native';
import {fetchReels} from '@services/reelRedux/reelSlice';
import {AppDispatch, RootState} from '@services/store';
import {useDispatch, useSelector} from 'react-redux';

export const ViewReels: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.user?._id);
  const [reels, setReels] = useState<Reel[]>([]);
  const navigate = useNavigation();
  const sheetRefComment = useRef<BottomSheetCommentRef>(null);
  const sheetRef: any = useRef<BottomSheetReelsRef>(null);
  const [_selectedPostId, setSelectedPostId] = useState<string>('');
  // const {handleLike} = useReelLike(reels);

  useEffect(() => {
    if (userId) {
      dispatch(fetchReels(userId)).then((action: any) => {
        if (action.payload) {
          setReels(action.payload);
        }
      });
    }
  }, [userId, dispatch]);

  const handleHashtagPress = (tag: string) => {
    console.log('Hashtag pressed:', tag);
  };

  const openComment = (postId: string) => {
    setSelectedPostId(postId);
    // dispatch(fetchCommentsByPost(postId));
    sheetRefComment.current?.open();
  };

  const closeComment = () => {
    setSelectedPostId('');
    sheetRefComment.current?.close();
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <ArrowLeft color="#fff" size={28} />
        </TouchableOpacity>
      </View>
      <FlashList
        data={reels}
        renderItem={({item}) => (
          <ReelItem
            item={item}
            handleLike={() => console.log('Liked')}
            handleHashtagPress={handleHashtagPress}
            openComment={openComment}
            showBottomSheet={closeComment}
            navigation={navigate}
          />
        )}
        keyExtractor={item => item._id}
        estimatedItemSize={height}
        estimatedListSize={{height, width}}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        horizontal={false}
        snapToInterval={height}
        decelerationRate="fast"
        removeClippedSubviews
      />
      <BottomSheetReels ref={sheetRef} />
      <BottomSheetComment ref={sheetRefComment} postId={_selectedPostId} />
    </>
  );
};

export default ViewReels;
