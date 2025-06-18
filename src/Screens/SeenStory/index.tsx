import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Video from 'react-native-video';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {toggleLikeStory} from '../../../services/StoryRedux/StorySlice';
import {styles} from './components/styles';
import {Header} from './components/Header';
import {ProgressBar} from './components/ProgressBar';
import {MediaPlayer} from './components/MediaPlayer';
import {Footer} from './components/Footer';

export const SeenStory = ({route, navigation}: any) => {
  const {creator, selectedItem: routeSelectedItem} = route.params;
  const [videoDuration, setVideoDuration] = useState(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef: any = useRef(null);
  const videoRef = useRef(null);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ✅ Giữ nguyên selectedItem, không bị ảnh hưởng từ Redux
  const selectedItem = useMemo(() => {
    return {
      ...routeSelectedItem,
    };
  }, []);

  const imageDuration = 15000;

  const getItemDuration = () => {
    if (selectedItem?.uriVideo && videoDuration) {
      return videoDuration * 1000;
    }
    return imageDuration;
  };

  const startProgressAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    progressAnim.setValue(0);
    const duration = getItemDuration();

    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    });

    animationRef.current.start(({finished}: any) => {
      if (finished) {
        setTimeout(() => navigation.goBack(), 50);
      }
    });
  };

  const onVideoLoad = (data: any) => {
    setVideoDuration(data.duration);
    startProgressAnimation();
  };

  const onVideoEnd = () => {
    setTimeout(() => navigation.goBack(), 50);
  };

  useEffect(() => {
    const likedList = selectedItem?.likedByUsers || [];
    setIsLiked(likedList.includes(user?._id));
  }, [selectedItem, user?._id]);

  useEffect(() => {
    setVideoDuration(null);
    progressAnim.setValue(0);

    if (selectedItem?.uriVideo) {
      if (animationRef.current) animationRef.current.stop();
    } else {
      startProgressAnimation();
    }

    return () => {
      if (animationRef.current) animationRef.current.stop();
    };
  }, []); // ✅ Không phụ thuộc selectedItem nữa

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = async () => {
    try {
      await dispatch(toggleLikeStory({storyId: selectedItem._id})).unwrap();
      setIsLiked(prev => !prev);
      animateLike();
    } catch (err) {
      console.error('Error liking story:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mediaWrapper}>
        <Header
          onClose={() => navigation.goBack()}
          username={creator?.username}
          profilePic={creator?.profilePic}
        />
        <ProgressBar progressAnim={progressAnim} />
        <MediaPlayer
          item={selectedItem}
          onLoad={onVideoLoad}
          onEnd={onVideoEnd}
          videoRef={videoRef}
        />
      </View>
      <Footer onLike={handleLike} isLiked={isLiked} scaleAnim={scaleAnim} />
    </SafeAreaView>
  );
};
