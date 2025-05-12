import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import User from '../../../../components/User';
import Video from 'react-native-video';

const dataUser = [
  {
    id: 1,
    name: 'user1',
    image:
      'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
    status: 1,
  },
  {
    id: 2,
    name: 'user2',
    image:
      'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
    status: 1,
  },
  {
    id: 3,
    name: 'user3',
    image:
      'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
    status: 0,
  },
  {
    id: 4,
    name: 'user4',
    image:
      'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
    status: 0,
  },
];

const posts = [
  {
    type: 'image',
    uri: 'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
  },
  {
    type: 'video',
    uri: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718746/my_video/ncd28sjnze0wfaqti2hm.mp4',
    seen: 1000,
  },
  {
    type: 'image',
    uri: 'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
  },
  {
    type: 'image',
    uri: [
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
    ],
  },
  {
    type: 'image',
    uri: 'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
  },
  {
    type: 'video',
    uri: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718746/my_video/ncd28sjnze0wfaqti2hm.mp4',
    seen: 1000,
  },
  {
    type: 'video',
    uri: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718746/my_video/ncd28sjnze0wfaqti2hm.mp4',
    seen: 1000,
  },
  {
    type: 'image',
    uri: 'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
  },
  {
    type: 'image',
    uri: [
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
    ],
  },
  {
    type: 'image',
    uri: 'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
  },
  {
    type: 'video',
    uri: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718746/my_video/ncd28sjnze0wfaqti2hm.mp4',
    seen: 1000,
  },
  {
    type: 'image',
    uri: 'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
  },
  {
    type: 'image',
    uri: [
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
    ],
  },
  {
    type: 'image',
    uri: 'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
  },
  {
    type: 'video',
    uri: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718746/my_video/ncd28sjnze0wfaqti2hm.mp4',
    seen: 1000,
  },
  {
    type: 'video',
    uri: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718746/my_video/ncd28sjnze0wfaqti2hm.mp4',
    seen: 1000,
  },
  {
    type: 'image',
    uri: 'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
  },
  {
    type: 'image',
    uri: [
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
      'https://kimipet.vn/wp-content/uploads/2021/06/husky-ngao-.jpg',
    ],
  },
];

const screenWidth = Dimensions.get('window').width;
const mediasHeight = ((screenWidth - 4) / 3) * 2;
const mediasWidth = (screenWidth - 4) / 3;

const SearchForYou = (props: any) => {
  const {searchText, isFocusedPage, currentVisibleIndex, onViewableItemsChanged, isPause} = props;

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <View style={{flex: 1, backgroundColor: color.background}}>
      <FlashList
        data={posts}
        numColumns={3}
        renderItem={({item, index}: any) => {
          const isPlaying = index >= currentVisibleIndex && index < (currentVisibleIndex + 3);
          return (
            <TouchableOpacity style={{marginBottom: 2}}>
              {item.type === 'video' ? (
                <View>
                  <Video
                    source={{uri: item.uri}}
                    resizeMode="cover"
                    style={{
                      width: mediasWidth,
                      height: mediasHeight,
                      marginRight: (index + 1) % 3 == 0 ? 0 : 2,
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
                      {item.seen}
                    </Text>
                  </View>
                </View>
              ) : (
                <View>
                  <Image
                    source={{
                      uri: Array.isArray(item.uri) ? item.uri[0] : item.uri,
                    }}
                    style={{
                      width: mediasWidth,
                      height: mediasHeight,
                      marginRight: (index + 1) % 3 == 0 ? 0 : 2,
                    }}
                  />
                  {Array.isArray(item.uri) && (
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
    </View>
  );
};

export default SearchForYou;

const styles = StyleSheet.create({});
