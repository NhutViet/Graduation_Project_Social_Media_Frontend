import React, {useState, useEffect, useRef} from 'react';
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
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import ModelPeopleSeen from './component/ModelPeopleSeen';
import ModelSeeMore from './component/ModelSeeMore';
import HighlightAddModal from './component/HighlightAddModal';
import HighlightViewModal from './component/HighlightViewModal';
import {styles} from './component/style';
import {useSelector} from 'react-redux';
import {RootState} from '../../../services/store';

// data mẫu cho modal highlight
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

export const SeenStoryOwner = ({route, navigation}: any) => {
  const {selectedItem} = route.params;
  const user = useSelector((state: RootState) => state.user.user);
  console.log('user', user);
  const [videoDuration, setVideoDuration] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleSeeMore, setVisibleSeeMore] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);
  const videoRef = useRef(null);
  const viewModalRef = useRef<Modalize>(null);
  const addModalRef = useRef<Modalize>(null);

  const handleOpenAddModal = () => {
    viewModalRef.current?.close();
    setTimeout(() => addModalRef.current?.open(), 300);
  };

  const handleOnBackAddModal = () => {
    addModalRef.current?.close();
    setTimeout(() => viewModalRef.current?.open(), 300);
  };

  const handleAddHighlight = (name: string) => {
    // xử lý thêm highlight mới vào danh sách
  };

  const imageDuration = 15000; // 10 seconds for images

  const getItemDuration = () => {
    if (selectedItem?.uriVideo && videoDuration) {
      return videoDuration * 1000; // Convert to milliseconds
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
      duration: duration,
      useNativeDriver: false,
    });

    animationRef.current.start(({finished}) => {
      if (finished) {
        navigation.goBack(); // Quay lại sau khi hết thời gian
      }
    });
  };

  const onVideoLoad = data => {
    setVideoDuration(data.duration);
    startProgressAnimation();
  };

  const onVideoEnd = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setVideoDuration(null);
    progressAnim.setValue(0);

    if (selectedItem?.uriVideo) {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    } else {
      startProgressAnimation();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [selectedItem]);

  const handleCloserPress = () => {
    navigation.goBack();
  };

  const renderProgressBar = () => {
    const width = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBarWrapper}>
          <Animated.View
            style={[styles.progressBar, {width, backgroundColor: '#fff'}]}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mediaWrapper}>
        <View style={styles.header}>
          <View style={styles.mediaItems}>{renderProgressBar()}</View>
          <TouchableOpacity style={styles.viewUser}>
            <Image
              style={styles.avatar}
              source={{
                uri: user?.profilePic,
              }}
            />
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
        <View style={styles.ViewMedia}>
          {selectedItem && selectedItem.mediaUrl ? (
            selectedItem.mediaUrl.endsWith('.m3u8') ? (
              <Video
                ref={videoRef}
                source={{uri: selectedItem.mediaUrl}}
                style={styles.media}
                resizeMode="cover"
                repeat={false}
                onLoad={onVideoLoad}
                onEnd={onVideoEnd}
                playInBackground={false}
                playWhenInactive={false}
              />
            ) : (
              <Image
                source={{uri: selectedItem.mediaUrl}}
                style={styles.media}
                resizeMode="cover"
              />
            )
          ) : (
            <Text style={styles.errorText}>Không có media để hiển thị</Text>
          )}
        </View>
      </View>
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
