import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  LayoutChangeEvent,
  View,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import ReelsComponent from './reelsComponent';
import {Colors} from '@assets/color/Colors';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const ReelsList = ({
  reels,
  currentVisible,
  isFocused,
  loading,
  isInitialLoad,
  flashListRef,
  onViewRef,
  handleLoadMore,
  openBottomSheet,
  openCommentSheet,
  openShareModal,
  setSkipReload,
}: any) => {
  const [visibleHeight, setVisibleHeight] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setVisibleHeight(height);
  };

  return (
    <View style={{flex: 1}} onLayout={onLayout}>
      {visibleHeight > 0 && (
        <FlashList
          ref={flashListRef}
          data={reels}
          extraData={[currentVisible, isFocused]}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          getItemType={() => 'reel'}
          ListFooterComponent={
            loading && !isInitialLoad
              ? () => (
                  <View style={{padding: 12}}>
                    <ActivityIndicator color={Colors.white} />
                  </View>
                )
              : null
          }
          renderItem={({item}: any) => {
            const shouldPlay = item?._id === currentVisible;
            return (
              <ReelsComponent
                {...item}
                containerHeight={visibleHeight}
                isFocused={isFocused}
                currentVisible={shouldPlay}
                isFollow={item?.isFollow}
                muted={false}
                setSkipReload={setSkipReload}
                showBottomSheet={() => openBottomSheet(item)}
                openComment={() => openCommentSheet(item)}
                openReactionModal={() => {}}
                openShareModal={openShareModal}
              />
            );
          }}
          pagingEnabled={true}
          overScrollMode="never"
          decelerationRate="fast"
          disableHorizontalListHeightMeasurement={true}
          estimatedFirstItemOffset={3}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={visibleHeight}
          estimatedListSize={{height: visibleHeight, width}}
          keyExtractor={(item: any) => item._id}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 90,
            minimumViewTime: 300,
          }}
        />
      )}
    </View>
  );
};

export default ReelsList;
