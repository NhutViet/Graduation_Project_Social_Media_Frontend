import React, {useRef, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Reel, styles} from '../../StyleSheet/ViewReels';
import ReelItem from './item';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../../(tabs)/Home/components/CommentSection';
import {useNavigation} from '@react-navigation/native';
import BottomSheetReels, {
  BottomSheetReelsRef,
} from '../../(tabs)/Reels/bottomSheet/reelBottomSheet';
import {ArrowLeft} from 'lucide-react-native';
import {RootState} from '@services/store';
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('window');

export const ViewReels: React.FC = () => {
  const reels: Reel[] = useSelector((state: RootState) => state.reels.data);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const navigate = useNavigation();
  const sheetRefComment = useRef<BottomSheetCommentRef>(null);
  const sheetRef: any = useRef<BottomSheetReelsRef>(null);
  const [_selectedPostId, setSelectedPostId] = useState<string>('');

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0]?.index;
      if (typeof visibleIndex === 'number') {
        setActiveIndex(visibleIndex);
      }
    }
  });

  const handleHashtagPress = (tag: string) => {
    console.log('Hashtag pressed:', tag);
  };

  const openComment = (postId: string) => {
    setSelectedPostId(postId);
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
        renderItem={({item, index}) => (
          <ReelItem
            item={item}
            index={index}
            activeIndex={activeIndex}
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
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
      />
      <BottomSheetReels ref={sheetRef} selectedItem={undefined} />
      <BottomSheetComment ref={sheetRefComment} postId={_selectedPostId} />
    </>
  );
};

export default ViewReels;
