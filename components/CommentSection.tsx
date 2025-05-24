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
  SafeAreaView,
  ActivityIndicator,
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
import {fetchCommentsByPost} from '../services/commentRedux/commentSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../services/store';

const maxHeight = Dimensions.get('window').height;
const height = Dimensions.get('window').height * 0.85;

export type BottomSheetCommentRef = {
  open: () => void;
  close: () => void;
};

const BottomSheetComment = forwardRef<BottomSheetCommentRef>(({}, ref) => {
  const translateY = useSharedValue(height);
  const isOpen = useSharedValue(false);

  const open = () => {
    translateY.value = withSpring(0, {
      damping: 20,
    });
    isOpen.value = true;
  };

  const close = () => {
    translateY.value = withSpring(height, {damping: 20});
    isOpen.value = false;
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

  const {comments, loading} = useSelector((state: RootState) => state.comment);

  const [comment, setComment] = useState('');

  return (
    <>
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
        <View style={styles.handle} />
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
            style={{flex: 1}}>
            <View style={{flex: 1, paddingHorizontal: 20}}>
              <FlashList
                data={comments}
                renderItem={({item}) => {
                  return <CommentComponent {...item} />;
                }}
                estimatedItemSize={100}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.blockImg}>
                  <Image
                    style={styles.img}
                    source={{
                      uri: 'https://i.pinimg.com/736x/b4/a3/31/b4a3315d142cad5d2127347315888e82.jpg',
                    }}
                  />
                </View>
                <TextInput
                  placeholder="Searching..."
                  placeholderTextColor={color.text}
                  style={[styles.input, {color: color.text}]}
                  value={comment}
                  onChangeText={setComment}
                />
              </View>
              <TouchableOpacity style={styles.blockIcon}>
                <Image
                  style={[styles.icon, {tintColor: color.text}]}
                  source={require('../assets/icon/sticker.png')}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </Animated.View>
    </>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sheet: {
    position: 'absolute',
    top: maxHeight - height,
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
    backgroundColor: Colors.black,
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
    marginBottom: 60,
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
