import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView, View, ActivityIndicator, ScrollView} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {AppDispatch, RootState} from '../../../services/store';
import {fetchPostsWithMedia} from '../../../services/postRedux/postSlice';
import {fetchFollowingStories} from '../../../services/StoryRedux/StorySlice';
import {
  getAllPlaylists,
  getItemsOfPlaylist,
} from '../../../services/bookmarkRedux/bookmarkSlice';
import {fetchCommentsByPost} from '../../../services/commentRedux/commentSlice';
import Header from '../../../components/Header';
import Story from './components/Story';
import ItemHome from './components/ItemHome';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from './components/CommentSection';
import {handleUserPress} from './util';

const HEADER_HEIGHT = 100;
const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

export const Home = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();

  const sheetRef = useRef<BottomSheetCommentRef>(null);
  const [currentVisible, setCurrentVisible] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const posts = useSelector((state: RootState) => state.post.posts);
  const followingUsers = useSelector(
    (state: RootState) => state.stories.followingUsers,
  );
  const storyLoading = useSelector((state: RootState) => state.stories.loading);
  const user = useSelector((state: RootState) => state.user.user);


  useEffect(() => {
    dispatch(fetchPostsWithMedia());
    dispatch(fetchFollowingStories({page: 1}));
  }, []);

  const onViewRef = useCallback(({viewableItems}: {viewableItems: any[]}) => {
    const id = viewableItems[0]?.item?._id;
    if (id) setCurrentVisible(id);
  }, []);

  const prevScrollY = useSharedValue(0);
  const headerTranslateY = useSharedValue(0);
  const scrolledUpDistance = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentY = event.contentOffset.y;
      const delta = currentY - prevScrollY.value;

      if (currentY <= 0) {
        headerTranslateY.value = withTiming(0, {duration: 200});
        scrolledUpDistance.value = 0;
      } else if (delta > 0) {
        headerTranslateY.value = withTiming(-HEADER_HEIGHT, {duration: 200});
        scrolledUpDistance.value = 0;
      } else {
        scrolledUpDistance.value = Math.min(
          scrolledUpDistance.value - delta,
          1000,
        );
        if (scrolledUpDistance.value >= 20) {
          headerTranslateY.value = withTiming(0, {duration: 200});
        }
      }

      prevScrollY.value = currentY;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    transform: [{translateY: headerTranslateY.value}],
  }));

  const handleOpenComment = useCallback(
    (postId: string) => {
      setSelectedPostId(postId);
      dispatch(fetchCommentsByPost(postId));
      sheetRef.current?.open();
    },
    [dispatch],
  );

  if (storyLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color.background,
        }}>
        <ActivityIndicator size="large" color={color.text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <Animated.View
        style={[
          {position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10},
          animatedHeaderStyle,
        ]}>
        <Header
          icon={require('../../../assets/icon/logo_row.png')}
          iconQR={require('../../../assets/icon/qr.png')}
          iconNotify={require('../../../assets/icon/heart.png')}
          iconMessage={require('../../../assets/icon/message.png')}
          navigation={navigation}
        />
      </Animated.View>
      <AnimatedFlatList
        data={posts}
        keyExtractor={item => item._id}
        extraData={isFocused}
        renderItem={({item}) => {
          const shouldPlay = item._id === currentVisible;
          return (
            <ItemHome
              {...item}
              isFocused={isFocused}
              currentVisible={shouldPlay}
              openComment={handleOpenComment}
            />
          );
        }}
        onViewableItemsChanged={onViewRef}
        viewabilityConfig={{itemVisiblePercentThreshold: 70}}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        ListHeaderComponent={
          <View style={{position: 'relative', height: 160}}>
            <View style={{position: 'absolute', top: 50}}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 10}}>
                {followingUsers
                  .filter(item => item !== undefined && item !== null)
                  .map(item => (
                    <Story
                      key={item._id}
                      name={
                        item.handleName === user?.handleName
                          ? 'Tin của tôi'
                          : item.handleName
                      }
                      image={item.profilePic}
                      status={item.stories.length > 0 ? 1 : 0}
                      func={() => handleUserPress(item, dispatch, navigation)}
                    />
                  ))}
              </ScrollView>
            </View>
          </View>
        }
      />
      <BottomSheetComment ref={sheetRef} postId={selectedPostId} />
    </SafeAreaView>
  );
};

export default Home;
