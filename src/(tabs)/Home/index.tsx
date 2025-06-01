import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import User from '../../../components/User';
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

  useEffect(() => {
    dispatch(fetchPostsWithMedia());
  }, [dispatch]);

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);

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

  const [dataUser, setDataUser] = useState([
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
  ]);

  useEffect(() => {
    const exists = dataUser.some(user => user.name === 'Tin của tôi');
    if (!exists) {
      const newUser = {
        id: Date.now(),
        name: 'Tin của tôi',
        image:
          'https://i.pinimg.com/736x/07/03/c7/0703c771ceecfd6142ce0ca726c056e7.jpg',
        status: 1,
      };
      setDataUser([newUser, ...dataUser]);
    }
  }, []);

  const handleUserPress = (user: any) => {
    setDataUser(prevData =>
      prevData.map(item => (item.id === user.id ? {...item, status: 0} : item)),
    );
    navigation.navigate('SeenStoryOwner', {selectedItem: user});
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
                  <User
                    name={item.name}
                    image={item.image}
                    status={item.status}
                    func={() => handleUserPress(item)}
                  />
                )}
                horizontal
                keyExtractor={item => item.id.toString()}
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
