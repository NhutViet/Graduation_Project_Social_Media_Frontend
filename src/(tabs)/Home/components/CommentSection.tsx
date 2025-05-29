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
  KeyboardAvoidingView,
  Platform,
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
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import CommentComponent from './commentComponent';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Send} from 'lucide-react-native';
import {AddCommentDto} from '../../../../services/commentRedux/commentTypes';
import {
  fetchAddComment,
  fetchCommentsByPost,
} from '../../../../services/commentRedux/commentSlice';

const maxHeight = Dimensions.get('window').height;
const height = Dimensions.get('window').height * 0.85;

export type BottomSheetCommentRef = {
  open: () => void;
  close: () => void;
};

const BottomSheetComment = forwardRef<BottomSheetCommentRef, {posts: string}>(
  (props, ref) => {
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.user);
    const {posts} = props;
    const translateY = useSharedValue(height);
    const isOpen = useSharedValue(false);

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

      try {
        const dto: AddCommentDto = {
          postID: posts,
          userID: user._id,
          content: comment.trim(),
          parentID: '',
        };

        await dispatch(fetchAddComment(dto)).unwrap();
        await dispatch(fetchCommentsByPost(posts));
        setComment('');
      } catch (err) {
        console.error('Add comment failed:', err);
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
                style={[styles.inputContainer, {marginBottom: keyboardHeight}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.blockImg}>
                    <Image
                      style={styles.img}
                      source={{
                        uri: 'https://i.pinimg.com/736x/b4/a3/31/b4a3315d142cad5d2127347315888e82.jpg',
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                    }}>
                    <TextInput
                      placeholder="Comment"
                      placeholderTextColor={color.text}
                      style={[styles.input, {color: color.text}]}
                      value={comment}
                      onChangeText={setComment}
                    />
                    {comment.length > 0 ? (
                      <TouchableOpacity
                        style={styles.blockIcon}
                        onPress={handleSendComment}>
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
  input: {},
});

export default BottomSheetComment;
