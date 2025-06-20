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
import {useIsFocused} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

export const ViewReels: React.FC = () => {
  const reels: Reel[] = useSelector((state: RootState) => state.reels.data);
  const navigate = useNavigation();
  const sheetRefComment = useRef<BottomSheetCommentRef>(null);
  const sheetRef: any = useRef<BottomSheetReelsRef>(null);
  const [_selectedPostId, setSelectedPostId] = useState<string>('');
   /**
   * The isFocus below will tracking-focus to know whenever user focus to this screen
   **/
  const isFocused = useIsFocused();

  const handleHashtagPress = (tag: string) => {
    console.log('Hashtag pressed:', tag);
  };

  const openComment = (postId: string) => {
    setSelectedPostId(postId);
    sheetRefComment.current?.open();
  };

  const showBottomSheetOptions = (postId: string) => {
    setSelectedPostId(postId);
    sheetRef.current?.open();
  };

  const [currentVisibleId, setCurrentVisibleId] = useState<string | null>(null);
  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const id = visibleItem?.item?._id;
      if (id) {
        setCurrentVisibleId(id);
      }
    }
  });

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <ArrowLeft color="#fff" size={28} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <FlashList
          data={reels}
          renderItem={({item}) => (
            <ReelItem
              item={item}
              currentVisible={item._id === currentVisibleId}
              isFocused={isFocused}
              handleHashtagPress={handleHashtagPress}
              openComment={openComment}
              showBottomSheet={showBottomSheetOptions}
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
      </View>
      <BottomSheetReels ref={sheetRef} selectedItem={undefined} />
      <BottomSheetComment ref={sheetRefComment} postId={_selectedPostId} />
    </>
  );
};

export default ViewReels;
