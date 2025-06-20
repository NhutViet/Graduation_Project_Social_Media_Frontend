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
  Dimensions,
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

// Định nghĩa kiểu cho route.params
interface RouteParams {
  creator: {username?: string; profilePic?: string};
  stories?: Array<{
    _id: string;
    uriVideo?: string;
    image?: string;
    mediaUrl?: string;
    likedByUsers?: string[];
    createdAt?: string;
    content?: {text?: string; x?: number; y?: number};
  }>;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const SeenStory = ({
  route,
  navigation,
}: {
  route: {params: RouteParams};
  navigation: any;
}) => {
  const {creator, stories: routeStories = []} = route.params || {}; // Mặc định rỗng nếu không có
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số story hiện tại
  const [videoDuration, setVideoDuration] = useState(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [mediaSize, setMediaSize] = useState({width: 0, height: 0}); // Khởi tạo với 0

  // Khai báo kiểu cho progressAnims
  const progressAnims = useRef<Animated.Value[]>(
    (routeStories || []).map(() => new Animated.Value(0)),
  ).current; // Khởi tạo an toàn
  const animationRef = useRef<Animated.CompositeAnimation | null>(null); // Khai báo kiểu
  const videoRef = useRef<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  console.log('routeStories:', routeStories); // Debug dữ liệu

  // Sử dụng useMemo để tối ưu hóa selectedItem hiện tại
  const selectedItem = useMemo(() => {
    return routeStories[currentIndex] || {};
  }, [routeStories, currentIndex]);

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

    if (progressAnims[currentIndex]) {
      progressAnims[currentIndex].setValue(0);
      const duration = getItemDuration();

      animationRef.current = Animated.timing(progressAnims[currentIndex], {
        toValue: 1,
        duration,
        useNativeDriver: false,
      });

      animationRef.current.start(({finished}) => {
        if (finished) {
          goToNextStory();
        }
      });
    }
  };

  const goToNextStory = () => {
    if (currentIndex < (routeStories.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
      setVideoDuration(null);
    } else {
      setTimeout(() => navigation.goBack(), 50);
    }
  };

  const goToPreviousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setVideoDuration(null);
    }
  };

  const onVideoLoad = (data: any) => {
    setVideoDuration(data.duration);
    startProgressAnimation();
  };

  const onVideoEnd = () => {
    goToNextStory();
  };

  const onMediaLayout = (size: {width: number; height: number}) => {
    setMediaSize(size);
  };

  useEffect(() => {
    const likedList = selectedItem?.likedByUsers || [];
    setIsLiked(likedList.includes(user?._id));
  }, [selectedItem, user?._id]);

  useEffect(() => {
    setVideoDuration(null);
    progressAnims.forEach((anim: Animated.Value, index: number) => {
      if (index < currentIndex) anim.setValue(1); // Đã xem
      else if (index > currentIndex) anim.setValue(0); // Chưa xem
    });

    if (selectedItem?.uriVideo) {
      if (animationRef.current) animationRef.current.stop();
    } else {
      startProgressAnimation();
    }

    return () => {
      if (animationRef.current) animationRef.current.stop();
    };
  }, [currentIndex]);

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

  const handleTouch = (event: any) => {
    const {locationX} = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    if (locationX < screenWidth / 3) {
      goToPreviousStory(); // Chạm bên trái để quay lại
    } else if (locationX > (screenWidth * 2) / 3) {
      goToNextStory(); // Chạm bên phải để tiến tới
    }
  };

  // Hiển thị caption
  const getCaptionPosition = (xPercent: number, yPercent: number) => {
    // Đảm bảo mediaSize không phải 0 để tránh lỗi chia cho 0
    const width = mediaSize.width || screenWidth;
    const height = mediaSize.height || screenHeight;
    return {
      left: (xPercent / 100) * width,
      top: (yPercent / 100) * height,
    };
  };

  const renderCaption = () => {
    const content = selectedItem?.content;
    if (!content?.text) return null;

    const position = getCaptionPosition(content.x || 50, content.y || 50); // Mặc định giữa nếu không có x, y
    console.log('Caption position:', position, 'mediaSize:', mediaSize); // Debug

    return (
      <Text
        style={{
          position: 'absolute',
          color: '#fff',
          fontSize: 18,
          fontWeight: '600',
          ...position,
        }}>
        {content.text}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.mediaWrapper}
        activeOpacity={1}
        onPress={handleTouch}>
        <Header
          onClose={() => navigation.goBack()}
          username={creator?.username}
          profilePic={creator?.profilePic}
        />
        <ProgressBar
          progressAnims={progressAnims}
          storyCount={routeStories.length || 0}
        />
        <MediaPlayer
          item={selectedItem}
          onLoad={onVideoLoad}
          onEnd={onVideoEnd}
          videoRef={videoRef}
          onMediaLayout={onMediaLayout}
        />
        {renderCaption()}
      </TouchableOpacity>
      <Footer onLike={handleLike} isLiked={isLiked} scaleAnim={scaleAnim} />
    </SafeAreaView>
  );
};
