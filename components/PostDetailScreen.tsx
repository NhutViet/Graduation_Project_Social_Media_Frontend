import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRoute, useNavigation, useIsFocused} from '@react-navigation/native';
import {useRef, useState, useEffect} from 'react';
import BottomSheetComment, {
  BottomSheetCommentRef,
} from '../src/(tabs)/Home/components/CommentSection';
import ItemHome from '../src/(tabs)/Home/components/ItemHome';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {fetchCommentsByPost} from '../services/commentRedux/commentSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../services/store';
import axios from 'axios'; // hoặc dùng custom hook fetch

interface RouteParams {
  postId: string;
}

const PostDetailScreen = () => {
  const {theme} = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();

  const route = useRoute();
  const {postId} = route.params as RouteParams;

  const [post, setPost] = useState<any | null>(null);
  const [selectedPostId, setSelectedPostId] = useState('');
  const sheetRef = useRef<BottomSheetCommentRef>(null);

  const fetchPostById = async () => {
    try {
      const {data} = await axios.get(`https://your-api.com/post/${postId}`);
      setPost(data);
    } catch (error) {
      console.log('Lỗi lấy post:', error);
    }
  };

  useEffect(() => {
    fetchPostById();
  }, [postId]);

  const handleOpenComment = (postId: string) => {
    setSelectedPostId(postId);
    dispatch(fetchCommentsByPost(postId));
    sheetRef.current?.open();
  };

  if (!post) {
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
          {...post}
          isFocused={isFocused}
          currentVisible={true}
          openComment={handleOpenComment}
        />
        <BottomSheetComment ref={sheetRef} postId={selectedPostId} />
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
});
