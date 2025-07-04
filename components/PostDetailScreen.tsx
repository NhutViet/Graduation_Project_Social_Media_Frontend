import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRoute, useNavigation, useIsFocused} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../src/(tabs)/Home/components/CommentSection';
import ItemHome from '../src/(tabs)/Home/components/ItemHome';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {fetchCommentsByPost} from '../services/commentRedux/commentSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../services/store';
import axiosInstance from '@services/axiosInstance';

interface RouteParams {
  postId: string;
}

const PostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const colors = Colors[theme];
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();

  const {postId} = route.params as RouteParams;

  const sheetRef = useRef<BottomSheetCommentRef>(null);
  const [post, setPost] = useState<any | null>(null);

  const [selectedPostId, setSelectedPostId] = useState<{
    postId: string;
    receiverId: string;
  }>({postId: '', receiverId: ''});

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const {data} = await axiosInstance.get(
          `http://cirla.io.vn/posts/${postId}`,
          {
            headers: {
              token: 'refresh',
            },
          },
        );
        console.log('data: ', data.data);
        setPost(data.data);
      } catch (error) {
        console.log('Lỗi lấy post:', error);
      }
    };

    fetchPostById();
  }, [postId]);

  const onOpenComment = (postId: string, receiverId: string) => {
    setSelectedPostId({postId, receiverId});
    dispatch(fetchCommentsByPost(postId));
    sheetRef.current?.open();
  };

  if (!post) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={{color: colors.text}}>Đang tải bài viết...</Text>
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
        <Text style={[styles.title, {color: colors.text}]}>Chi tiết bài viết</Text>
        <View style={styles.iconBack} />
      </View>

      <View style={{flex: 1, backgroundColor: colors.background}}>
        <ItemHome
          _id={post._id}
          type={post.type}
          caption={post.caption}
          createdAt={post.createdAt}
          media={post.media}
          user={post.user}
          isLike={post.isLike}
          isBookmarked={post.isBookmarked}
          commentCount={post.commentCount}
          likeCount={post.likeCount}
          share={post.share}
          music={post.music}
          currentVisible={true}
          isFocused={isFocused}
          sheetRef={sheetRef}
          isFollow={post.isFollow}
          setSelectedPostId={setSelectedPostId}
        />
        <BottomSheetComment
          ref={sheetRef}
          postId={selectedPostId.postId}
          receiverId={selectedPostId.receiverId}
        />
      </View>
    </SafeAreaView>
  );
};

export default PostDetailScreen;

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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});