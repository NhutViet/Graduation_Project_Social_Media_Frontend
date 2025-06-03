import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Keyboard,
  KeyboardEvent,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
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
import Toast from 'react-native-toast-message';
import {Send} from 'lucide-react-native';

const maxHeight = Dimensions.get('window').height;
const height = Dimensions.get('window').height * 0.85;

export type BottomSheetCommentRef = {
  open: () => void;
  close: () => void;
};

interface Props {
  postId: string;
}

const BottomSheetComment = forwardRef<BottomSheetCommentRef, Props>(
  ({postId}, ref) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(postId);
    const [replyTo, setReplyTo] = useState<{
      id: string;
      handleName: string;
    } | null>(null);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      if (postId) {
        setCurrentPostId(postId);
      }
    }, [postId]);

    const translateY = useSharedValue(height);
    const isOpen = useSharedValue(false);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);

    const open = () => {
      setModalVisible(true);
      setTimeout(() => {
        translateY.value = withSpring(0, {
          damping: 20,
        });
        isOpen.value = true;
      }, 50);
    };

    const close = () => {
      translateY.value = withSpring(height, {damping: 20});
      isOpen.value = false;
      setReplyTo(null);
      setComment('');
      setTimeout(() => {
        setModalVisible(false);
      }, 300);
    };

    useImperativeHandle(ref, () => ({open, close}));

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{translateY: translateY.value}],
    }));

    const overlayStyle = useAnimatedStyle(() => ({
      opacity: isOpen.value ? 1 : 0,
      display: isOpen.value ? 'flex' : 'none',
    }));

    const {theme} = useTheme();
    const color = Colors[theme];

    const {comments, loading} = useSelector(
      (state: RootState) => state.comment,
    );

    const [comment, setComment] = useState('');

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    useEffect(() => {
      const showSubscription = Keyboard.addListener(
        'keyboardDidShow',
        (e: KeyboardEvent) => {
          setKeyboardHeight(e.endCoordinates.height);
        },
      );

      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    const handleSendComment = async () => {
      if (!comment.trim()) return;

      const payload: any = {
        postID: currentPostId,
        content: comment.trim(),
        parentID: replyTo?.id || '',
        mediaUrl: null,
      };

      try {
        await dispatch(addComment(payload)).unwrap();
        setComment('');
        setReplyTo(null);
        dispatch(fetchCommentsByPost(currentPostId));
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Failed to add comment!',
        });
        console.log('Failed to add comment:', error);
      }
    };

    return (
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent
        statusBarTranslucent
        onRequestClose={close}>
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <TouchableWithoutFeedback onPress={close}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            animatedStyle,
            {backgroundColor: color.background},
          ]}>
          <View style={[styles.handle, {backgroundColor: color.text}]} />
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.background,
              }}>
              <ActivityIndicator size="large" color={color.text} />
            </View>
          ) : (
            <>
              <View style={{flex: 1, paddingHorizontal: 20}}>
                <FlashList
                  data={comments}
                  renderItem={({item}) => {
                    return (
                      <CommentComponent
                        {...item}
                        onReply={(id, handleName) => {
                          setReplyTo({id, handleName});
                          setTimeout(() => {
                            inputRef.current?.focus();
                          }, 200); // nhỏ delay để đảm bảo TextInput đã render
                        }}
                      />
                    );
                  }}
                  estimatedItemSize={10}
                />
              </View>
              {/* View visble reply */}
              {replyTo && (
                <View style={styles.visibleReply}>
                  <Text style={styles.txtReply}>
                    Đang trả lời{' '}
                    <Text style={styles.replyName}>{replyTo.handleName}</Text>
                  </Text>
                  <TouchableOpacity onPress={() => setReplyTo(null)}>
                    <Text style={styles.cancelReply}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View
                style={[styles.inputContainer, {marginBottom: keyboardHeight}]}>
                <View style={styles.inputRow}>
                  <View style={styles.blockImg}>
                    <Image
                      style={styles.img}
                      source={{
                        uri: user?.profilePic,
                      }}
                    />
                  </View>

                  <TextInput
                    ref={inputRef}
                    placeholder={
                      replyTo ? `Trả lời ${replyTo.handleName}` : 'Bình luận'
                    }
                    placeholderTextColor={color.text}
                    style={[styles.input, {color: color.text}]}
                    value={comment}
                    onChangeText={setComment}
                    onSubmitEditing={handleSendComment}
                  />

                  {comment.length > 0 ? (
                    <TouchableOpacity onPress={handleSendComment}>
                      <Send size={24} color={color.text} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.blockIcon}>
                      <Image
                        style={[styles.icon, {tintColor: color.text}]}
                        source={require('../../../../assets/icon/sticker.png')}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </>
          )}
        </Animated.View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    zIndex: 2,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 16,
  },
  visibleReply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 8,
  },

  txtReply: {
    fontSize: 14,
    color: '#666',
  },

  replyName: {
    fontWeight: 'bold',
    color: '#666',
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
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: Colors.whiteSmoke,
    paddingHorizontal: 20,
    borderRadius: 15,
    height: 40,
    marginHorizontal: 10,
  },
});

export default BottomSheetComment;
