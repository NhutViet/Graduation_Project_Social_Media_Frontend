import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';

import ModelPeopleSeen from './component/ModelPeopleSeen';
import ModelSeeMore from './component/ModelSeeMore';
import HighlightAddModal from './component/HighlightAddModal';
import HighlightViewModal from './component/HighlightViewModal';
import {styles} from './component/style';
import {useSelector} from 'react-redux';
import {RootState} from '../../../services/store';
import {MediaSection} from './component/MediaSection';

// Data mẫu cho modal highlight
const highlights = [
  {
    id: '1',
    name: 'Trip',
    isAdded: true,
    imageURL:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
  {
    id: '2',
    name: 'Food',
    isAdded: true,
    imageURL:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
  {
    id: '3',
    name: 'Friends',
    isAdded: false,
    imageURL:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
];

// Định nghĩa kiểu cho route.params
interface RouteParams {
  stories: Array<{
    mediaUrl?: string;
    uriVideo?: string;
    image?: string;
    _id?: string;
    createdAt?: string;
    content?: {text?: string; x?: number; y?: number};
  }>;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const SeenStoryOwner = ({
  route,
  navigation,
}: {
  route: {params: RouteParams};
  navigation: any;
}) => {
  const {stories} = route.params; // Nhận danh sách stories
  const user = useSelector((state: RootState) => state.user.user);
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số story hiện tại
  const selectedItem = stories[currentIndex];
  const [videoDuration, setVideoDuration] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleSeeMore, setVisibleSeeMore] = useState(false);
  const [mediaSize, setMediaSize] = useState({width: 0, height: 0}); // Khởi tạo với 0

  // Khai báo kiểu cho progressAnims
  const progressAnims = useRef<Animated.Value[]>(
    (stories || []).map(() => new Animated.Value(0)),
  ).current; // Tiến trình cho từng story

  // Khai báo kiểu cho animationRef
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const videoRef = useRef<any>(null);
  const viewModalRef = useRef<Modalize>(null);
  const addModalRef = useRef<Modalize>(null);

  const imageDuration = 15000; // 15 giây cho ảnh

  // Hàm mở modal thêm highlight
  const handleOpenAddModal = () => {
    viewModalRef.current?.close();
    setTimeout(() => addModalRef.current?.open(), 300);
  };

  // Hàm quay lại từ modal thêm highlight
  const handleOnBackAddModal = () => {
    addModalRef.current?.close();
    setTimeout(() => viewModalRef.current?.open(), 300);
  };

  // Hàm xử lý thêm highlight mới
  const handleAddHighlight = (name: string) => {
    console.log('Thêm highlight:', name);
    addModalRef.current?.close();
  };

  // Lấy thời gian hiển thị của story hiện tại
  const getItemDuration = () => {
    const currentStory = stories[currentIndex];
    if (currentStory?.mediaUrl?.endsWith('.m3u8') && videoDuration) {
      return videoDuration * 1000; // Chuyển sang mili giây
    }
    return imageDuration;
  };

  // Khởi động hiệu ứng thanh tiến trình
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

  // Chuyển sang story tiếp theo
  const goToNextStory = () => {
    if (currentIndex < (stories?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
      setVideoDuration(null);
    } else {
      navigation.goBack(); // Quay lại khi hết story
    }
  };

  // Quay lại story trước đó
  const goToPreviousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setVideoDuration(null);
    }
  };

  // Xử lý khi video tải xong
  const onVideoLoad = (data: any) => {
    setVideoDuration(data.duration);
    startProgressAnimation();
  };

  // Xử lý khi video kết thúc
  const onVideoEnd = () => {
    goToNextStory();
  };

  // Xử lý khi chạm vào màn hình
  const handleTouch = (event: any) => {
    const {locationX} = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    if (locationX < screenWidth / 3) {
      goToPreviousStory(); // Chạm bên trái để quay lại
    } else if (locationX > (screenWidth * 2) / 3) {
      goToNextStory(); // Chạm bên phải để tiến tới
    }
  };

  // Xử lý hiệu ứng và trạng thái khi chuyển story
  useEffect(() => {
    console.log('stories', stories); // Debug dữ liệu stories
    setVideoDuration(null);
    progressAnims.forEach((anim: Animated.Value, index: number) => {
      if (index < currentIndex) {
        anim.setValue(1); // Đã xem
      } else if (index > currentIndex) {
        anim.setValue(0); // Chưa xem
      }
    });

    const currentStory = stories[currentIndex];
    if (!currentStory?.mediaUrl?.endsWith('.m3u8')) {
      startProgressAnimation();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [currentIndex]);

  const handleCloserPress = () => {
    navigation.goBack();
  };

  // Hiển thị các thanh tiến trình
  const renderProgressBars = () => {
    return (
      <View style={styles.progressContainer}>
        {stories.map((_, index) => {
          const width = progressAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          });
          return (
            <View key={index} style={styles.progressBarWrapper}>
              <Animated.View
                style={[styles.progressBar, {width, backgroundColor: '#fff'}]}
              />
            </View>
          );
        })}
      </View>
    );
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
        <View style={styles.header}>
          <View style={styles.mediaItems}>{renderProgressBars()}</View>
          <TouchableOpacity style={styles.viewUser}>
            <Image style={styles.avatar} source={{uri: user?.profilePic}} />
            <Text style={styles.nameUser}>{user?.username}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCloser}
            onPress={handleCloserPress}>
            <Image
              style={styles.iconCloser}
              source={require('../../../assets/icon/closer.png')}
            />
          </TouchableOpacity>
        </View>
        <MediaSection
          selectedItem={stories[currentIndex]}
          ref={videoRef}
          onLoad={onVideoLoad}
          onEnd={onVideoEnd}
          onMediaLayout={setMediaSize} // Cập nhật mediaSize
        />
        {renderCaption()}
      </TouchableOpacity>
      <View style={styles.viewBottom}>
        <TouchableOpacity
          style={styles.viewIconItem}
          onPress={() => setVisible(true)}>
          <Image
            style={styles.icon}
            source={require('../../../assets/icon/users.png')}
          />
          <Text style={styles.txtIcon}>Hoạt động</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewIconItem}
          onPress={() => setVisibleSeeMore(true)}>
          <Image
            style={styles.icon}
            source={require('../../../assets/icon/ellipsis.png')}
          />
          <Text style={styles.txtIcon}>Xem thêm</Text>
        </TouchableOpacity>
        <ModelPeopleSeen visible={visible} onClose={() => setVisible(false)} />
        <ModelSeeMore
          visible={visibleSeeMore}
          onClose={() => setVisibleSeeMore(false)}
        />
      </View>

      <Portal>
        <HighlightViewModal
          ref={viewModalRef}
          data={highlights}
          onAddNew={handleOpenAddModal}
        />
      </Portal>

      <Portal>
        <HighlightAddModal
          ref={addModalRef}
          onAdd={handleAddHighlight}
          onBack={handleOnBackAddModal}
          imageSource={
            'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg'
          }
        />
      </Portal>
    </SafeAreaView>
  );
};
