import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';

const screenWidth = Dimensions.get('window').width;
const mediasHeight = ((screenWidth - 4) / 3) * 2;
const mediasWidth = (screenWidth - 4) / 3;

const SearchForYou = (props: any) => {
  const {
    searchText,
    isFocusedPage,
    currentVisibleIndex,
    onViewableItemsChanged,
    isPause,
  } = props;

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  const {theme} = useTheme();
  const color = Colors[theme];

  const {posts, reels, isLoading} = useSelector(
    (state: RootState) => state.search,
  );

  const postItems = (posts as any)?.items || [];
  const reelItems = (reels as any)?.items || [];

  //trộn ngẫu nhiên
  const randomList = useMemo(() => {
    return [...postItems, ...reelItems].sort(() => Math.random() - 0.5);
  }, [postItems, reelItems]);

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
          renderItem={({item, index}: any) => {
            const media = item.media?.[0];
            if (!media) return null;
            const isPlaying =
              index >= currentVisibleIndex && index < currentVisibleIndex + 3;
            return (
              <TouchableOpacity style={{marginBottom: 2}}>
                {item.media[0]?.videoUrl ? (
                  <View>
                    <Video
                      source={{uri: item.media[0].videoUrl}}
                      resizeMode="contain"
                      style={{
                        width: mediasWidth,
                        height: mediasHeight,
                        marginRight: (index + 1) % 3 == 0 ? 0 : 2,
                        overflow: 'hidden',
                        backgroundColor: color.black,
                      }}
                      repeat
                      muted={true}
                      paused={!isPlaying || !isPause || !isFocusedPage}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                      }}>
                      <Image
                        source={require('../../../../assets/icon/eye.png')}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                          tintColor: color.background,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: color.background,
                        }}>
                        {item.viewCount}
                      </Text>
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        top: 5,
                        left: 5,
                        backgroundColor:
                          theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'rgba(0, 0, 0, 0.5)',
                        padding: 5,
                        borderRadius: 50,
                        borderColor: color.background,
                      }}>
                      <Image
                        source={require('../../../../assets/icon/clapperboard.png')}
                        style={{
                          width: 18,
                          height: 18,
                          resizeMode: 'contain',
                          tintColor: color.background,
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <Image
                      source={{
                        uri: item.media[0].imageUrl,
                      }}
                      style={{
                        width: mediasWidth,
                        height: mediasHeight,
                        marginRight: (index + 1) % 3 == 0 ? 0 : 2,
                      }}
                    />
                    {item.media.length > 1 && (
                      <Image
                        source={require('../../../../assets/icon/gallery.png')}
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: color.background,
                          position: 'absolute',
                          right: 12,
                          top: 10,
                        }}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          estimatedItemSize={200}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          extraData={[currentVisibleIndex, isFocusedPage]}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: color.textSecondary,
            }}>
            Không có kết quả phù hợp.
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchForYou;
