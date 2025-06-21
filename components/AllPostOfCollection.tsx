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
import ItemHome from '../src/(tabs)/Home/components/ItemHome';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {fetchCommentsByPost} from '../services/commentRedux/commentSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../services/store';

interface RouteParams {
  posts: any[]; // danh sách post được truyền vào
  targetPostId: string; // bài viết cần scroll đến
  playlistName: string;
}


const AllPostOfCollection = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const colors = Colors[theme];
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();

  const {posts, targetPostId, playlistName} = route.params as RouteParams;

  const listRef = useRef<FlatList<any>>(null);
  const sheetRef = useRef<BottomSheetCommentRef>(null);

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const targetIndex = posts.findIndex(p => p._id === targetPostId);

  const onViewRef = useCallback(({viewableItems}: {viewableItems: any[]}) => {
    const id = viewableItems[0]?.item?._id;
    if (id) setCurrentVisible(id);
  }, []);

  const handleOpenComment = useCallback(
    (postId: string) => {
      setSelectedPostId(postId);
      dispatch(fetchCommentsByPost(postId));
      sheetRef.current?.open();
    },
    [dispatch],
  );

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
          {playlistName}
        </Text>
        <View style={styles.iconBack} />
      </View>

      <View style={{flex: 1, backgroundColor: colors.background}}>
        <FlatList
          ref={listRef}
          data={posts.filter(p => p.media && p.media.length > 0)} // lọc bỏ post không có media
          keyExtractor={item => item._id}
          extraData={[currentVisible, isFocused]}
          onViewableItemsChanged={onViewRef}
          viewabilityConfig={{itemVisiblePercentThreshold: 100}}
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
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          initialScrollIndex={targetIndex >= 0 ? targetIndex : 0}
          removeClippedSubviews={true}
          nestedScrollEnabled={false}
          maintainVisibleContentPosition={{minIndexForVisible: 0}}
          getItemLayout={(_, index) => ({
            length: 200,
            offset: 200 * index,
            index,
          })}
        />
        <BottomSheetComment ref={sheetRef} postId={selectedPostId} />
      </View>
    </SafeAreaView>
  );
};

export default AllPostOfCollection;

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
