import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, View, ActivityIndicator, Text} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Story from './components/Story';
import {useDispatch, useSelector} from 'react-redux';
import ItemHome from './components/ItemHome';
import {Modalize} from 'react-native-modalize';
import {AppDispatch, RootState} from '../../../services/store';
import {fetchPostsWithMedia} from '../../../services/postRedux/postSlice';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from './components/CommentSection';
import {fetchCommentsByPost} from '../../../services/commentRedux/commentSlice';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Header from '../../../components/Header';
import {
  fetchFollowingStories,
  fetchStoriesByIds,
  seenStory,
} from '../../../services/StoryRedux/StorySlice';
import {userFollow} from '../../../services/StoryRedux/StoryType';

const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

export const Home = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const isFocused = useIsFocused();
  const sheetRef: any = useRef<BottomSheetCommentRef>(null);

  // redux
  const dispatch = useDispatch<AppDispatch>();
  const {posts, loading} = useSelector((state: RootState) => state.post);
  const {likePosts} = useSelector((state: RootState) => state.reactions);

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);
  const {
    followingUsers,
    loading: storyLoading,
    error: storyError,
  } = useSelector((state: RootState) => state.stories);
  const user = useSelector((state: RootState) => state.user);
  const [dataUser, setDataUser] = useState<userFollow[]>();

  useEffect(() => {
    dispatch(fetchPostsWithMedia());
    dispatch(fetchFollowingStories());
  }, [dispatch]);

  useEffect(() => {
    setDataUser(followingUsers);
  }, [followingUsers]);

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const id = visibleItem?.item?._id;
      if (id) {
        setCurrentVisible(id);
      }
    }
  });

  const modalizeRef = useRef<Modalize>(null);

  const handleUserPress = async (user: userFollow) => {
    if (user.stories.length === 0) return;

    const firstStoryId = user.stories[0];
    try {
      // 1. Fetch story detail
      const storyDetailResult = await dispatch(
        fetchStoriesByIds([firstStoryId]),
      ).unwrap();
      const storyDetail = storyDetailResult[0];

      // 2. Đánh dấu đã xem
      await dispatch(seenStory({storyId: firstStoryId, userId: user._id}));

      // 3. Navigate và truyền story chi tiết
      navigation.navigate('SeenStory', {
        selectedItem: {
          _id: storyDetail._id,
          uriVideo: storyDetail.mediaUrl.endsWith('.m3u8')
            ? storyDetail.mediaUrl
            : null,
          image: storyDetail.mediaUrl.endsWith('.m3u8')
            ? null
            : storyDetail.mediaUrl,
        },
      });
    } catch (err) {
      console.error('Error fetching or marking story:', err);
    }
  };
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const HEADER_HEIGHT = 100;

  const scrollY = useSharedValue(0);
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
        scrolledUpDistance.value = 0;
        headerTranslateY.value = withTiming(-HEADER_HEIGHT, {duration: 200});
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

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: headerTranslateY.value}],
    };
  });

  if (loading) {
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
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          },
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
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        data={posts}
        extraData={[currentVisible, isFocused]}
        renderItem={({item}: any) => {
          const shouldPlay = item?._id === currentVisible;
          return (
            <ItemHome
              {...item}
              isFocused={isFocused}
              currentVisible={shouldPlay}
              modalizeRef={modalizeRef}
              openComment={() => {
                setSelectedPostId(item._id);
                dispatch(fetchCommentsByPost(item._id));
                sheetRef.current?.open();
              }}
            />
          );
        }}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={{position: 'relative', height: 160}}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                position: 'absolute',
                top: 50,
              }}>
              <Animated.FlatList
                data={dataUser}
                renderItem={({item}) => (
                  <Story
                    name={
                      item.handleName === user?.user?.handleName
                        ? 'Tin của tôi'
                        : item.handleName
                    }
                    image={item.profilePic}
                    status={item.stories.length > 0 ? 1 : 0}
                    func={() => handleUserPress(item)}
                  />
                )}
                horizontal
                keyExtractor={item => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                }}
              />
            </View>
          </View>
        }
      />
      <BottomSheetComment ref={sheetRef} postId={selectedPostId} />
    </SafeAreaView>
  );
};
