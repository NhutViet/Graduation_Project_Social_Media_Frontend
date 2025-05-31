import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
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
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import CommentComponent from '../src/(tabs)/Home/components/commentComponent';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../services/store';
import {
  addComment,
  fetchCommentsByPost,
} from '../services/commentRedux/commentSlice';
import Toast from 'react-native-toast-message';

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
        parentID: '',
        mediaUrl: null,
      };

      try {
        await dispatch(addComment(payload)).unwrap();
        setComment('');
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
                    return <CommentComponent {...item} />;
                  }}
                  estimatedItemSize={100}
                />
              </View>
              <View
                style={[
                  styles.inputContainer,
                  {marginBottom: keyboardHeight, borderTopColor: color.text},
                ]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.blockImg}>
                    <Image
                      style={styles.img}
                      source={{
                        uri: user?.profilePic,
                      }}
                    />
                  </View>
                  <TextInput
                    placeholder="Comment"
                    placeholderTextColor={color.text}
                    style={[styles.input, {color: color.text}]}
                    value={comment}
                    onChangeText={setComment}
                    onSubmitEditing={handleSendComment}
                  />
                </View>
                <TouchableOpacity style={styles.blockIcon}>
                  <Image
                    style={[styles.icon, {tintColor: color.text}]}
                    source={require('../assets/icon/sticker.png')}
                  />
                </TouchableOpacity>
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
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  blockImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
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
    width: '70%',
  },
});

export default BottomSheetComment;
