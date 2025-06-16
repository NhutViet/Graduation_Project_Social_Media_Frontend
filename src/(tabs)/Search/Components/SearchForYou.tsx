import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';

const screenWidth = Dimensions.get('window').width;
const mediasHeight = ((screenWidth - 4) / 3) * 2;
const mediasWidth = (screenWidth - 4) / 3;
//trộn ngẫu nhiên
function shuffle<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SearchForYou = (props: any) => {
  const {
    searchText,
    isFocusedPage,
    currentVisibleIndex,
    onViewableItemsChanged,
    isPause,
  } = props;

  const viewabilityConfig = useMemo(() => ({ viewAreaCoveragePercentThreshold: 50 }), []);

  const {theme} = useTheme();
  const color = Colors[theme];

  const {posts, reels, isLoading} = useSelector(
    (state: RootState) => state.search,
  );

  const postItems = (posts as any)?.items || [];
  const reelItems = (reels as any)?.items || [];

    // only reshuffle when source arrays change
  const randomList = useMemo(() => shuffle([...postItems, ...reelItems]), [postItems, reelItems]);

  // extraData memo to avoid inline arrays
  const extra = useMemo(
    () => ({ currentVisibleIndex, isFocusedPage }),
    [currentVisibleIndex, isFocusedPage]
  );

  // memoized renderItem
  const renderMediaItem = useCallback(({item, index}: any) => {
    const media = item.media?.[0];
    if (!media) return null;

    const isActiveVideo =
      !!media.videoUrl &&
      index === currentVisibleIndex &&
      isPause &&
      isFocusedPage;

    const commonStyle = {
      width: mediasWidth,
      height: mediasHeight,
      marginRight: (index + 1) % 3 === 0 ? 0 : 2,
    };
        return (
      <TouchableOpacity style={{marginBottom: 2}}>
        {isActiveVideo ? (
          <Video
            source={{uri: media.videoUrl}}
            resizeMode="contain"
            style={[commonStyle, {backgroundColor: color.black}]}
            repeat
            muted
            paused={false}
          />
        ) : (
          <Image
            source={{ uri: media.imageUrl }}
            style={commonStyle}
          />
        )}
      </TouchableOpacity>
    );
  }, [currentVisibleIndex, isFocusedPage, isPause, color.black]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: color.background,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            color: color.textSecondary,
          }}>
          Đang tải...
        </Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: color.background}}>
      {randomList.length > 0 ? (
        <FlashList
          data={randomList}
          numColumns={3}
          renderItem={renderMediaItem}
          estimatedItemSize={mediasHeight + 2}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          extraData={extra}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <Text style={{fontSize: 18, fontWeight: '500', color: color.textSecondary}}>
            Không có kết quả phù hợp.
          </Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(SearchForYou);
