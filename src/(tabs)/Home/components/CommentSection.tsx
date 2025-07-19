import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {useTheme} from '../../../../src/util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import CommentComponent from './commentComponent';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  addComment,
  fetchCommentsByPost,
} from '../../../../services/commentRedux/commentSlice';
import {Send} from 'lucide-react-native';
import {Portal} from 'react-native-portalize';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {checkProfanityAndAlert} from '../../../util/profanityFilter';
import {incrementCommentCountByPostId} from '@services/postRedux/postReducer';
import {useSharedValue} from 'react-native-reanimated';
import {fetchFollowers} from '@services/relationRedux/relationSlice';
import MentionSuggestion from '../../../../src/Screens/PostSetting/Components/MentionSuggestion';
import {useNavigation} from '@react-navigation/native';
import { CommentSkeleton } from '../../../../components/SkeletonGrid';

export type BottomSheetCommentRef = {
  open: () => void;
  close: () => void;
};

interface Props {
  selectedPostRef: React.RefObject<{
    postId: string;
    receiverId: string;
  }>;
}
const height = Dimensions.get('window').height * 0.9;

const BottomSheetComment = forwardRef<BottomSheetCommentRef, Props>(
  ({selectedPostRef}, ref) => {
    const modalizeRef = useRef<Modalize>(null);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const {comments, loading} = useSelector(
      (state: RootState) => state.comment,
    );
    const {theme} = useTheme();
    const color = Colors[theme];
    const [isSending, setIsSending] = useState(false);
    const [comment, setComment] = useState('');
    const [replyTo, setReplyTo] = useState<{
      id: string;
      handleName: string;
      userId?: string;
    } | null>(null);
    const inputRef = useRef<TextInput>(null);
    const scrollY = useSharedValue(0);
    const [mentionQuery, setMentionQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputLayoutY = useSharedValue(0);
    const {followers} = useSelector((state: RootState) => state.relation);
    const navigation = useNavigation<any>();

    useImperativeHandle(ref, () => ({
      open: () => {
        modalizeRef.current?.open();
        if (user?._id) {
          dispatch(fetchFollowers({userId: user._id}));
        }
      },
      close: () => {
        modalizeRef.current?.close();
        setReplyTo(null);
        setComment('');
        setShowSuggestions(false);
      },
    }));

    const handleSendComment = async () => {
      if (!comment.trim() || isSending) return;
      if (checkProfanityAndAlert(comment)) {
        return;
      }

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
        const res = await dispatch(
          addComment({
            payload,
            handleName: user?.handleName,
            postId: selectedPostRef.current?.postId ?? '',
            receiverId: selectedPostRef.current?.receiverId,
            userId: user?._id,
            parentUserId: payload.parentID.length > 0 ? replyTo?.userId : '',
          }),
        );

        dispatch(
          incrementCommentCountByPostId(selectedPostRef.current?.postId ?? ''),
        );
      } catch (error) {
        GlobalAlertManager.show('Thất bại', 'Không thể bình luận');
      } finally {
        setIsSending(false);
      }
    };

    useEffect(() => {
      const showSub = Keyboard.addListener('keyboardDidShow', () => {
        setTimeout(() => {
          inputRef.current?.measureInWindow((_x, y) => {
            inputLayoutY.value = y;
          });
        }, 100);
      });

      const hideSub = Keyboard.addListener('keyboardDidHide', () => {
        setShowSuggestions(false);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    useEffect(() => {
      const unsubscribe = navigation.addListener('blur', () => {
        modalizeRef.current?.close();
        setReplyTo(null);
        setComment('');
        setShowSuggestions(false);
      });

      return unsubscribe;
    }, [navigation]);

    return (
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalStyle={{
            backgroundColor: color.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
          handleStyle={{
            backgroundColor: color.text,
            height: 6,
            width: 40,
            marginBottom: 8,
          }}
          handlePosition="inside"
          panGestureEnabled
          scrollViewProps={{scrollEnabled: false}}
          adjustToContentHeight
          keyboardAvoidingBehavior="padding"
          onClosed={() => {
            setReplyTo(null);
            setComment('');
          }}>
          <View style={{flex: 1, height: height, paddingTop: 40}}>
            {loading ? (
                <CommentSkeleton itemCount={6} spacing={16} />
            ) : (
              <>
                {comments.length > 0 ? (
                  <View style={{flex: 1, paddingHorizontal: 20}}>
                    <FlashList
                      data={comments}
                      estimatedItemSize={50}
                      keyExtractor={item => item._id}
                      renderItem={({item}) => (
                        <CommentComponent
                          postId={selectedPostRef.current?.postId ?? ''}
                          _id={item._id}
                          content={item.content}
                          isDeleted={item.isDeleted}
                          isLiked={item.isLiked}
                          createdAt={item.createdAt}
                          reply={item.reply}
                          totalLikes={item.totalLikes}
                          user={item.user}
                          onReply={(id, handleName, userId) => {
                            setReplyTo({id, handleName, userId});
                            setTimeout(() => inputRef.current?.focus(), 200);
                          }}
                          navigation={navigation}
                        />
                      )}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: color.text}}>
                      Bạn hãy là người đầu tiên bình luận
                    </Text>
                  </View>
                )}

                {replyTo && (
                  <View
                    style={[
                      styles.visibleReply,
                      {backgroundColor: color.backgroundSecondary},
                    ]}>
                    <Text style={[styles.txtReply, {color: color.text}]}>
                      Đang trả lời{' '}
                      <Text style={[styles.replyName, {color: color.text}]}>
                        {replyTo.handleName}
                      </Text>
                    </Text>
                    <TouchableOpacity onPress={() => setReplyTo(null)}>
                      <Text style={styles.cancelReply}>Hủy</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={[styles.inputContainer]}>
                  <View style={styles.inputRow}>
                    <View style={styles.blockImg}>
                      <Image
                        style={styles.img}
                        source={{uri: user?.profilePic}}
                      />
                    </View>
                    <TextInput
                      ref={inputRef}
                      placeholder={
                        replyTo ? `Trả lời ${replyTo.handleName}` : 'Bình luận'
                      }
                      placeholderTextColor={color.text}
                      style={[
                        styles.input,
                        {
                          color: color.text,
                          backgroundColor: color.backgroundSecondary,
                        },
                      ]}
                      value={comment}
                      onLayout={() => {
                        inputRef.current?.measureInWindow((_x, y) => {
                          inputLayoutY.value = y;
                        });
                      }}
                      onChangeText={text => {
                        setComment(text);
                        const lastAt = text.lastIndexOf('@');
                        if (lastAt !== -1) {
                          const textAfterAt = text.slice(lastAt + 1);
                          const isValid = /^[a-zA-Z0-9_]*$/.test(textAfterAt);
                          if (isValid) {
                            setMentionQuery(textAfterAt);
                            setShowSuggestions(true);
                            return;
                          }
                        }
                        setShowSuggestions(false);
                        setMentionQuery('');
                      }}
                      onSubmitEditing={() => handleSendComment()}
                    />

                    <MentionSuggestion
                      visible={showSuggestions}
                      query={mentionQuery}
                      followers={followers}
                      onSelect={handle => {
                        const lastAt = comment.lastIndexOf('@');
                        const newText =
                          comment.slice(0, lastAt + 1) + handle + ' ';
                        setComment(newText);
                        setShowSuggestions(false);
                      }}
                      backgroundColor={color.background}
                      scrollY={scrollY}
                      positionY={inputLayoutY.value}
                    />

                    {comment.length > 0 && (
                      <TouchableOpacity
                        onPress={handleSendComment}
                        disabled={isSending}>
                        <Send
                          size={24}
                          color={isSending ? 'gray' : color.text}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
        </Modalize>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  visibleReply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  txtReply: {
    fontSize: 14,
  },
  replyName: {
    fontWeight: 'bold',
  },
  cancelReply: {
    fontSize: 14,
    fontWeight: '500',
    color: 'red',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
    borderTopWidth: 0.5,
    borderColor: '#ccc',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  blockIcon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    borderRadius: 15,
    height: 40,
    marginHorizontal: 10,
  },
});

export default BottomSheetComment;
