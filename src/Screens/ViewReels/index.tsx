import React, {useRef, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {styles} from '../../StyleSheet/ViewReels';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {ArrowLeft} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@services/store';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../../(tabs)/Home/components/CommentSection';
import BottomSheetReels, {
  BottomSheetReelsRef,
} from '../../(tabs)/Reels/bottomSheet/reelBottomSheet';
import ReelItem from './item';

const {width, height} = Dimensions.get('window');

export const ViewReels: React.FC = () => {
  const reels = useSelector((state: RootState) => state.reels.data);
  const isFocused = useIsFocused();

  const [currentVisibleId, setCurrentVisibleId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const sheetRefComment = useRef<BottomSheetCommentRef>(null);
  const sheetRef = useRef<BottomSheetReelsRef>(null);
  const navigation = useNavigation();

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const id = visibleItem?.item?._id;
      if (id) setCurrentVisibleId(id);
    }
  });

  const openComment = (postId: string) => {
    setSelectedPostId(postId);
    sheetRefComment.current?.open();
  };

  const openOptions = (postId: string) => {
    setSelectedPostId(postId);
    sheetRef.current?.open();
  };
  const handleHashtagPress = (tag: string) => {
    console.log('Hashtag pressed:', tag);
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#fff" size={28} />
        </TouchableOpacity>
      </View>

      <FlashList
        data={reels}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <ReelItem
            item={item}
            isFocused={isFocused}
            isCurrentVisible={item._id === currentVisibleId}
            handleHashtagPress={handleHashtagPress}
            navigation={navigation}
            openComment={openComment}
            showBottomSheet={openOptions}
          />
        )}
        extraData={[isFocused, currentVisibleId]}
        estimatedItemSize={height}
        estimatedListSize={{width, height}}
        pagingEnabled
        snapToInterval={height}
        decelerationRate="fast"
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        horizontal={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{itemVisiblePercentThreshold: 70}}
      />

      <BottomSheetReels ref={sheetRef} selectedItem={undefined} />
      <BottomSheetComment ref={sheetRefComment} postId={selectedPostId} />
    </>
  );
};

export default ViewReels;
