import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
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
import {Item, Load} from '@services/postUserRedux/postUserType';
import {ArrowLeft} from 'lucide-react-native';

const AllPostOfUserScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const colors = Colors[theme];
  const listRef = useRef<FlatList<any>>(null);
  const sheetRef = useRef<BottomSheetCommentRef>(null);
  const isFocused = useIsFocused();

  const {targetPostId} = route.params as {targetPostId: string};
  const postData = useSelector(
    (state: RootState) => state.postUser.posts,
  ) as Load;
  const PostsItem: Item[] = postData.items;

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);
  const selectedPostRef = useRef<{postId: string; receiverId: string}>({
    postId: '',
    receiverId: '',
  });

  const targetIndex = Array.isArray(PostsItem)
    ? PostsItem.findIndex((post: Item) => post._id === targetPostId)
    : -1;

  const onViewRef = useCallback(({viewableItems}: {viewableItems: any[]}) => {
    const id = viewableItems[0]?.item?._id;
    if (id) setCurrentVisible(id);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.header, {backgroundColor: colors.background}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text} />
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
                isFocused={isFocused}
                sheetRef={sheetRef}
                isFollow={item.isFollow}
                SelectedPostRef={selectedPostRef}
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
        <BottomSheetComment ref={sheetRef} selectedPostRef={selectedPostRef} />
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
