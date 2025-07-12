import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

const width = Dimensions.get('window').width - 96;
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
    onReply: (id: string, handleName: string) => void;
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
      likedBy = [],
      isLiked: defaultLiked,
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
              postId: item.postId,
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
      <View style={[styles.rowContainer, {marginTop: 10}]}>
        <TouchableOpacity style={styles.blockImgReply}>
          <Image
            style={styles.imgUser}
            source={{uri: user?.profilePic || fallbackImg}}
          />
        </TouchableOpacity>
        <View
          style={[
            styles.rowContainer,
            {justifyContent: 'space-between', width: width - 46},
          ]}>
          <View style={{width: '80%'}}>
            <View style={[styles.rowContainer, {alignItems: 'center'}]}>
              <Text style={[styles.name, {color: color.text, marginRight: 20}]}>
                {user?.handleName || 'Người dùng'}
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
            <TouchableOpacity>
              <Text style={[styles.text, {color: color.text}]}>
                xem bản dịch
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <TouchableOpacity style={styles.blockIcon} onPress={handleLike}>
              <Heart
                size={22}
                color={isLiked ? 'red' : color.text}
                fill={isLiked ? 'red' : 'none'}
              />
            </TouchableOpacity>
            <Text style={[styles.text, {color: color.text}]}>{totalLikes}</Text>
          </View>
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
    likedBy = [],
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
    <View style={[styles.rowContainer, {marginBottom: 20}]}>
      <TouchableOpacity style={styles.blockImg}>
        <Image
          style={styles.imgUser}
          source={{uri: user?.profilePic || fallbackImg}}
        />
      </TouchableOpacity>
      <View
        style={[
          styles.rowContainer,
          {justifyContent: 'space-between', width: width},
        ]}>
        <View style={{width: width}}>
          <View style={[styles.rowContainer, {alignItems: 'center'}]}>
            <Text style={[styles.name, {color: color.text, marginRight: 20}]}>
              {user?.handleName || 'Người dùng'}
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
          <View style={[styles.rowContainer, {alignItems: 'center'}]}>
            <TouchableOpacity
              onPress={() => onReply(_id, user?.handleName || '', user?._id)}>
              <Text style={[styles.text, {color: color.text, marginRight: 20}]}>
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
            <View>
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
                />
              )}
              <TouchableOpacity
                style={{marginLeft: 66, marginTop: 10}}
                onPress={() => setMoreComment(!moreComment)}>
                <Text style={[styles.text, {color: color.text}]}>
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
          <Text style={[styles.text, {color: color.text}]}>{totalLikes}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  blockImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  blockImgReply: {
    width: 30,
    height: 30,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
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
  blockIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  heartContainer: {
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    marginTop: 20,
    marginLeft: 10,
  },
});

export default CommentComponent;
