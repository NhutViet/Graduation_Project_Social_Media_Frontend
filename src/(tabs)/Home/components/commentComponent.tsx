import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useState, useRef, memo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {formatTimeAgo} from '../util';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {likeComment, unlikeComment} from '@services/commentRedux/commentSlice';
import HashtagText from '../../../../components/HashtagText';
import {
  updateCommentLike,
  updateCommentUnlike,
} from '@services/commentRedux/commentReducer';
import {Heart} from 'lucide-react-native';

const fallbackImg =
  'https://i.pinimg.com/736x/30/01/1e/30011ec01f59434d761d323e0d4b5a07.jpg';

interface CommentComponentProps {
  onReply: (id: string, handleName: string, userId?: string) => void;
  _id: string;
  postId: string;
  user?: {
    _id?: string;
    handleName?: string;
    profilePic?: string;
    username?: string;
  };
  content: string;
  mediaUrl?: string;
  isDeleted: boolean;
  likedBy?: string[];
  isLiked: boolean;
  createdAt: string;
  reply?: CommentComponentProps[];
  totalLikes?: number;
  navigation: any;
}

const ReplyComment = memo(
  ({
    item,
    onReply,
    navigation,
  }: {
    item: CommentComponentProps;
    onReply: (id: string, handleName: string, userId?: string) => void;
    navigation: any;
  }) => {
    const {theme} = useTheme();
    const color = Colors[theme];
    const {
      _id,
      user,
      content,
      createdAt,
      totalLikes,
      isLiked: defaultLiked,
      postId,
    } = item;

    const dispatch = useDispatch<AppDispatch>();
    const [isLiked, setIsLiked] = useState(defaultLiked);
    const likeTimeout = useRef<NodeJS.Timeout | null>(null);
    const currentUser = useSelector((state: RootState) => state.user.user);
    const userId = useSelector((state: RootState) => state.user.user?._id);

    const handleLike = () => {
      const newLiked = !isLiked;
      setIsLiked(newLiked);

      if (likeTimeout.current) clearTimeout(likeTimeout.current);
      likeTimeout.current = setTimeout(() => {
        if (newLiked) {
          dispatch(
            likeComment({
              commentId: _id,
              receiverId: user?._id,
              handleName: currentUser?.handleName,
              userId: currentUser?._id,
              postId: postId,
            }),
          );
          dispatch(updateCommentLike({commentId: _id, userId: userId || ''}));
        } else {
          dispatch(unlikeComment(_id));
          dispatch(updateCommentUnlike({commentId: _id, userId: userId || ''}));
        }
      }, 500);
    };

    return (
      <View style={styles.replyContainer}>
        <TouchableOpacity style={styles.replyAvatar}>
          <Image
            style={styles.imgUser}
            source={{uri: user?.profilePic || fallbackImg}}
          />
        </TouchableOpacity>
        <View style={styles.replyContentBox}>
          <View style={styles.rowTop}>
            <Text style={[styles.name, {color: color.text, marginRight: 8}]}>
              {user?.username || 'Người dùng'}
            </Text>
            <Text style={[styles.text, {color: color.text}]}>
              {formatTimeAgo(createdAt)}
            </Text>
          </View>
          <HashtagText
            text={content}
            clickable={true}
            baseStyle={[styles.content, {color: color.text}]}
            hashtagColor={Colors.hashtag}
            hashtagStyle={{fontWeight: '600'}}
            navigation={navigation}
          />
          <View style={styles.rowBottom}>
            <TouchableOpacity
              onPress={() => onReply(_id, user?.handleName || '', user?._id)}>
              <Text style={[styles.text, {color: color.text, marginRight: 16}]}>
                Trả lời
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.text, {color: color.text}]}>
                xem bản dịch
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.heartContainer}>
          <TouchableOpacity style={styles.blockIcon} onPress={handleLike}>
            <Heart
              size={20}
              color={isLiked ? 'red' : color.text}
              fill={isLiked ? 'red' : 'none'}
            />
          </TouchableOpacity>
          <Text style={[styles.text, {color: color.text, alignSelf: 'center'}]}>
            {totalLikes}
          </Text>
        </View>
      </View>
    );
  },
);

const CommentComponent = memo((props: CommentComponentProps) => {
  const {
    _id,
    user,
    content,
    createdAt,
    postId,
    totalLikes,
    isLiked: defaultLiked,
    reply = [],
    onReply,
    navigation,
  } = props;

  const {theme} = useTheme();
  const color = Colors[theme];
  const dispatch = useDispatch<AppDispatch>();
  const [isLiked, setIsLiked] = useState(defaultLiked);
  const [moreComment, setMoreComment] = useState(false);
  const likeTimeout = useRef<NodeJS.Timeout | null>(null);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const userId = useSelector((state: RootState) => state.user.user?._id);

  const handleToggleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);

    if (likeTimeout.current) clearTimeout(likeTimeout.current);
    likeTimeout.current = setTimeout(() => {
      if (newLiked) {
        dispatch(
          likeComment({
            commentId: _id,
            receiverId: user?._id,
            handleName: currentUser?.handleName,
            userId: currentUser?._id,
            postId: postId,
          }),
        );
        dispatch(updateCommentLike({commentId: _id, userId: userId || ''}));
      } else {
        dispatch(unlikeComment(_id));
        dispatch(updateCommentUnlike({commentId: _id, userId: userId || ''}));
      }
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.blockImg}>
          <Image
            style={styles.imgUser}
            source={{uri: user?.profilePic || fallbackImg}}
          />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <View style={styles.rowTop}>
            <Text style={[styles.name, {color: color.text, marginRight: 8}]}>
              {user?.username || 'Người dùng'}
            </Text>
            <Text style={[styles.text, {color: color.text}]}>
              {formatTimeAgo(createdAt)}
            </Text>
          </View>
          <HashtagText
            text={content}
            clickable={true}
            baseStyle={[styles.content, {color: color.text}]}
            hashtagColor={Colors.hashtag}
            hashtagStyle={{fontWeight: '600'}}
            navigation={navigation}
          />
          <View style={styles.rowBottom}>
            <TouchableOpacity
              onPress={() => onReply(_id, user?.handleName || '', user?._id)}>
              <Text style={[styles.text, {color: color.text, marginRight: 16}]}>
                Trả lời
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.text, {color: color.text}]}>
                xem bản dịch
              </Text>
            </TouchableOpacity>
          </View>

          {reply.length > 0 && (
            <View style={{marginTop: 6}}>
              {moreComment && (
                <FlashList
                  data={reply}
                  renderItem={({item}) => (
                    <ReplyComment
                      item={item}
                      onReply={onReply}
                      navigation={navigation}
                    />
                  )}
                  keyExtractor={item => item._id}
                  estimatedItemSize={50}
                  scrollEnabled={false}
                />
              )}
              <TouchableOpacity
                style={{marginLeft: 40, marginTop: 10}}
                onPress={() => setMoreComment(!moreComment)}>
                <Text
                  style={[
                    styles.text,
                    {color: color.text, fontWeight: 'bold'},
                  ]}>
                  {!moreComment
                    ? `Xem ${reply.length} câu trả lời khác`
                    : 'Ẩn câu trả lời'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.heartContainer}>
          <TouchableOpacity style={styles.blockIcon} onPress={handleToggleLike}>
            <Heart
              size={22}
              color={isLiked ? 'red' : color.text}
              fill={isLiked ? 'red' : 'none'}
            />
          </TouchableOpacity>
          <Text style={[styles.text, {color: color.text, alignSelf: 'center'}]}>
            {totalLikes}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  blockImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  imgUser: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
  },
  content: {
    fontSize: 15,
    fontWeight: '500',
    marginVertical: 4,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  blockIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginTop: 4,
    minWidth: 34,
  },
  // Reply styles
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  replyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 10,
  },
  replyContentBox: {
    flex: 1,
  },
});

export default CommentComponent;
