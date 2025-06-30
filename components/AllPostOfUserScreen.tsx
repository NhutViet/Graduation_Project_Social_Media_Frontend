import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../src/(tabs)/Home/components/CommentSection';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../services/store';
import {fetchCommentsByPost} from '../services/commentRedux/commentSlice';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCallback, useRef, useState} from 'react';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../src/(tabs)/Home/components/CommentSection';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../services/store';
import ItemHome from '../src/(tabs)/Home/components/ItemHome';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';

const AllPostOfUserScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const colors = Colors[theme];
  const listRef = useRef<FlatList<any>>(null);
  const sheetRef = useRef<BottomSheetCommentRef>(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();

  const {targetPostId} = route.params as {targetPostId: string};
  const {items: PostsItem}: any = useSelector(
    (state: RootState) => state.postUser.posts,
  );

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const targetIndex = Array.isArray(PostsItem)
    ? PostsItem.findIndex((post: any) => post._id === targetPostId)
    : -1;

  const onViewRef = useCallback(({viewableItems}: {viewableItems: any[]}) => {
    const id = viewableItems[0]?.item?._id;
    if (id) setCurrentVisible(id);
  }, []);

  const handleOpenComment = useCallback(
    (postId: string) => {
      console.log('Opening comment for post:', postId); // Debug log
      setSelectedPostId(postId);
      dispatch(fetchCommentsByPost(postId));
      sheetRef.current?.open();
    },
    [dispatch],
  );

  if (!PostsItem || !Array.isArray(PostsItem)) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={[styles.header, {backgroundColor: colors.background}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/icon/left.png')}
              style={[styles.iconBack, {tintColor: colors.text}]}
            />
          </TouchableOpacity>
          <Text style={[styles.title, {color: colors.text}]}>
            Tất cả bài viết
          </Text>
          <View style={styles.iconBack} />
        </View>
        <View style={{flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: colors.text}}>No posts available</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.header, {backgroundColor: colors.background}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icon/left.png')}
            style={[styles.iconBack, {tintColor: colors.text}]}
          />
        </TouchableOpacity>
        <Text style={[styles.title, {color: colors.text}]}>
          Tất cả bài viết
        </Text>
        <View style={styles.iconBack} />
      </View>

      <View style={{flex: 1, backgroundColor: colors.background}}>
        <FlatList
          ref={listRef}
          data={PostsItem}
          keyExtractor={item => item._id}
          extraData={[currentVisible, isFocused]}
          onViewableItemsChanged={onViewRef}
          viewabilityConfig={{itemVisiblePercentThreshold: 100}}
          renderItem={({item}) => {
            const shouldPlay = item._id === currentVisible;
            return (
              <ItemHome
                _id={item._id}
                type={item.type}
                caption={item.caption}
                createdAt={item.createdAt}
                media={item.media}
                user={item.user}
                isLike={item.isLike}
                isBookmarked={item.isBookmarked}
                commentCount={item.commentCount}
                likeCount={item.likeCount}
                share={item.share}
                music={item.music}
                currentVisible={shouldPlay}
                openComment={handleOpenComment}
                isFocused={isFocused}
                sheetRef={sheetRef}
                isFollow={item.isFollow}
                setSelectedPostId={setSelectedPostId}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          initialScrollIndex={targetIndex >= 0 ? targetIndex : 0}
          removeClippedSubviews={true}
          nestedScrollEnabled={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
          getItemLayout={(_, index) => ({
            length: 500,
            offset: 500 * index,
            index,
          })}
        />
        <BottomSheetComment ref={sheetRef} postId={selectedPostId} />
      </View>
    </SafeAreaView>
  );
};

export default AllPostOfUserScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
  },
  iconBack: {
    width: 14,
    height: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
});