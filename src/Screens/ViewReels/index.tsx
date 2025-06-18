import React, {useRef, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Reel, styles} from '../../StyleSheet/ViewReels';
import ReelItem from './item';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../../(tabs)/Home/components/CommentSection';
import {useNavigation} from '@react-navigation/native';
import {useReelLike} from './hook';
const {width, height} = Dimensions.get('window');

import BottomSheetReels, {
  BottomSheetReelsRef,
} from '../../(tabs)/Reels/bottomSheet/reelBottomSheet';
import {ArrowLeft} from 'lucide-react-native';

const sampleReels: Reel[] = [
  {
    _id: '1',
    caption: 'Check out this awesome #ReactNative #Reels demo! 🔥',
    isLike: false,
    likeCount: 1234,
    commentCount: 56,
    shareCount: 12,
    music: {
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    user: {
      handleName: 'dev_user',
      profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    _id: '2',
    caption: 'Coding all night with #TypeScript and #NodeJS 🚀',
    isLike: true,
    likeCount: 2450,
    commentCount: 102,
    shareCount: 30,
    media: {
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    user: {
      handleName: 'nightcoder',
      profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  },
  {
    _id: '3',
    caption: 'Let’s build something cool with #MobileApp and #UIUX! ✨',
    isLike: false,
    likeCount: 980,
    commentCount: 20,
    shareCount: 8,
    media: {
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
    user: {
      handleName: 'uiux_guru',
      profilePic: 'https://randomuser.me/api/portraits/men/65.jpg',
    },
  },
];

export const ViewReels: React.FC = () => {
  const navigate = useNavigation();
  const sheetRefComment = useRef<BottomSheetCommentRef>(null);
  const sheetRef: any = useRef<BottomSheetReelsRef>(null);
  const [_selectedPostId, setSelectedPostId] = useState<string>('');

  const {handleLike} = useReelLike(sampleReels);

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
        data={sampleReels}
        renderItem={({item}) => (
          <ReelItem
            item={item}
            handleLike={handleLike}
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
