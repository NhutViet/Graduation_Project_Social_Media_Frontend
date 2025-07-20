import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTheme} from '../../../../src/util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import CommentComponent from './commentComponent';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {addComment} from '../../../../services/commentRedux/commentSlice';
import {Send} from 'lucide-react-native';
import {Portal} from 'react-native-portalize';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {checkProfanityAndAlert} from '../../../util/profanityFilter';
import {incrementCommentCountByPostId} from '@services/postRedux/postReducer';
import {fetchFollowers} from '@services/relationRedux/relationSlice';
import {useNavigation} from '@react-navigation/native';
import {CommentSkeleton} from '../../../../components/SkeletonGrid';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

export type BottomSheetCommentRef = {open: () => void; close: () => void};

interface Props {
  selectedPostRef: React.RefObject<{postId: string; receiverId: string}>;
}

interface ReplyTo {
  id: string;
  handleName: string;
  userId?: string;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;

const BottomSheetComment = forwardRef<BottomSheetCommentRef, Props>(
  ({selectedPostRef}, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const {theme} = useTheme();
    const color = Colors[theme];

    const user = useSelector((state: RootState) => state.user.user);
    const {comments, loading} = useSelector(
      (state: RootState) => state.comment,
    );

    const [visible, setVisible] = useState(false);
    const [comment, setComment] = useState('');
    const [replyTo, setReplyTo] = useState<ReplyTo | null>(null);
    const [isSending, setIsSending] = useState(false);

    const inputRef = useRef<TextInput>(null);
    const translateY = useSharedValue(SHEET_HEIGHT);
    const backdropOpacity = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const inputLayoutY = useSharedValue(0);

    const onCloseComplete = () => {
      setVisible(false);
      setReplyTo(null);
      setComment('');
    };

    const open = () => {
      setVisible(true);
      if (user?._id) dispatch(fetchFollowers({userId: user._id}));
      translateY.value = withTiming(0, {duration: 300});
      backdropOpacity.value = withTiming(1, {duration: 300});
    };

    const close = () => {
      translateY.value = withTiming(
        SHEET_HEIGHT,
        {duration: 300},
        finished => finished && runOnJS(onCloseComplete)(),
      );
      backdropOpacity.value = withTiming(0, {duration: 300});
    };

    useImperativeHandle(ref, () => ({open, close}));

    const sheetStyle = useAnimatedStyle(() => ({
      transform: [{translateY: translateY.value}],
    }));
    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    const handleSendComment = async () => {
      if (!comment.trim() || isSending) return;
      if (checkProfanityAndAlert(comment)) return;
      const payload = {
        postID: selectedPostRef.current?.postId ?? '',
        content: comment.trim(),
        parentID: replyTo?.id || '',
        mediaUrl: null,
      };
      setIsSending(true);
      setComment('');
      setReplyTo(null);
      try {
        await dispatch(
          addComment({
            payload,
            handleName: user?.handleName,
            postId: payload.postID,
            receiverId: selectedPostRef.current?.receiverId,
            userId: user?._id,
            parentUserId: replyTo?.userId,
          }),
        );
        dispatch(incrementCommentCountByPostId(payload.postID));
      } catch {
        GlobalAlertManager.show('Thất bại', 'Không thể bình luận');
      } finally {
        setIsSending(false);
      }
    };

    return (
      <Portal>
        {visible && (
          <>
            <TouchableWithoutFeedback onPress={close}>
              <Animated.View
                style={[
                  styles.backdrop,
                  {backgroundColor: "'rgba(0,0,0,0.5)"},
                  backdropStyle,
                ]}
              />
            </TouchableWithoutFeedback>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoid}>
              <Animated.View
                style={[
                  styles.sheet,
                  {backgroundColor: color.background},
                  sheetStyle,
                ]}>
                <View style={[styles.handle, {backgroundColor: color.text}]} />
                <View style={styles.content}>
                  {loading ? (
                    <CommentSkeleton itemCount={6} spacing={16} />
                  ) : (
                    <>
                      {comments.length ? (
                        <FlashList
                          data={comments}
                          estimatedItemSize={50}
                          keyExtractor={(item, index) => `${item._id}-${index}`}
                          onScroll={({nativeEvent}) =>
                            (scrollY.value = nativeEvent.contentOffset.y)
                          }
                          contentContainerStyle={styles.listContainer}
                          renderItem={({item}) => (
                            <CommentComponent
                              postId={selectedPostRef.current?.postId ?? ''}
                              _id={item._id}
                              navigation={navigation}
                              content={item.content}
                              isDeleted={item.isDeleted}
                              isLiked={item.isLiked}
                              createdAt={item.createdAt}
                              reply={item.reply}
                              totalLikes={item.totalLikes}
                              user={item.user}
                              onReply={(id, handleName, userId) => {
                                setReplyTo({id, handleName, userId});
                                setTimeout(
                                  () => inputRef.current?.focus(),
                                  200,
                                );
                              }}
                            />
                          )}
                        />
                      ) : (
                        <View style={styles.empty}>
                          <Text style={{color: color.text}}>
                            Bạn hãy là người đầu tiên bình luận
                          </Text>
                        </View>
                      )}
                      {replyTo && (
                        <View
                          style={[
                            styles.replyBanner,
                            {backgroundColor: color.backgroundSecondary},
                          ]}>
                          <Text style={[styles.replyText, {color: color.text}]}>
                            Đang trả lời{' '}
                            <Text
                              style={[styles.replyName, {color: color.text}]}>
                              {replyTo.handleName}
                            </Text>
                          </Text>
                          <TouchableOpacity onPress={() => setReplyTo(null)}>
                            <Text style={styles.cancel}>Hủy</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}
                </View>
                <View
                  style={[
                    styles.inputWrapper,
                    {backgroundColor: color.background},
                  ]}>
                  <Image
                    source={{uri: user?.profilePic}}
                    style={styles.avatar}
                  />
                  <View style={styles.inputArea}>
                    <TextInput
                      ref={inputRef}
                      value={comment}
                      onChangeText={setComment}
                      placeholder={
                        replyTo ? `Trả lời ${replyTo.handleName}` : 'Bình luận'
                      }
                      placeholderTextColor={color.text}
                      style={[
                        styles.textInput,
                        {
                          color: color.text,
                          backgroundColor: color.backgroundSecondary,
                        },
                      ]}
                      onLayout={({nativeEvent}) =>
                        (inputLayoutY.value = nativeEvent.layout.y)
                      }
                      onSubmitEditing={handleSendComment}
                    />
                  </View>
                  {comment ? (
                    <TouchableOpacity
                      onPress={handleSendComment}
                      disabled={isSending}>
                      <Send size={24} color={isSending ? 'gray' : color.text} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </Animated.View>
            </KeyboardAvoidingView>
          </>
        )}
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardAvoid: {
    position: 'absolute',
    top: SCREEN_HEIGHT - SHEET_HEIGHT,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
  },
  sheet: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 6,
    borderRadius: 3,
    marginVertical: 8,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  replyText: {
    fontSize: 14,
  },
  replyName: {
    fontWeight: 'bold',
  },
  cancel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'red',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    borderTopWidth: 0.5,
    borderColor: '#ccc',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  inputArea: {
    flex: 1,
    position: 'relative',
    marginRight: 10,
  },
  textInput: {
    height: 40,
    borderRadius: 15,
    paddingHorizontal: 20,
  },
});

export default BottomSheetComment;
