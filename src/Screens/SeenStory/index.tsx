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
import { Modalize } from "react-native-modalize";
import {Portal} from 'react-native-portalize';
import HighlightViewModal from './components/HighlightViewModal';
import HighlightAddModal from './components/HighlightAddModal';


// data mẫu cho modal highlight
const highlights= [
  { id: "1", name: "Trip", isAdded: true, imageURL: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg'},
  { id: "2", name: "Food", isAdded: true, imageURL: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg'},
  { id: "3", name: "Friends", isAdded: false, imageURL: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg'},
];

export const SeenStory = ({route, navigation}: any) => {
  const {selectedItem} = route.params;
  const [videoDuration, setVideoDuration] = useState(null);
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
  }

  const handleAddHighlight = (name: string) => {
    // xử lý thêm highlight mới vào danh sách
  };

  const imageDuration = 10000; // 10 seconds for images

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
    navigation.goBack(); // Quay lại khi video kết thúc
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
                uri: 'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
              }}
            />
            <Text style={styles.nameUser}>Nhut Viet</Text>
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
          {selectedItem ? (
            selectedItem.uriVideo ? (
              <Video
                ref={videoRef}
                source={{uri: selectedItem.uriVideo}}
                style={styles.media}
                resizeMode="cover"
                repeat={false}
                onLoad={onVideoLoad}
                onEnd={onVideoEnd}
                playInBackground={false}
                playWhenInactive={false}
              />
            ) : selectedItem.image ? (
              <Image
                source={{uri: selectedItem.image}}
                style={styles.media}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.errorText}>Không có media để hiển thị</Text>
            )
          ) : (
            <Text style={styles.errorText}>Không có media để hiển thị</Text>
          )}
        </View>
      </View>
      <View style={styles.viewBottom}>
        <TextInput
          style={styles.input}
          placeholder="Gửi tin nhắn"
          placeholderTextColor={'#fff'}
        />
        <View style={styles.viewIcon}>
          <TouchableOpacity onPress={() => viewModalRef.current?.open()}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/heart.png')}
            />
          </TouchableOpacity>
          <Image
            style={styles.icon}
            source={require('../../../assets/icon/share.png')}
          />
        </View>
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
          imageSource={"https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg"}
        />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
  },
  viewUser: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 10,
    top: 20,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  nameUser: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  btnCloser: {
    position: 'absolute',
    right: 10,
    top: 20,
    borderRadius: 50,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(140, 137, 137, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCloser: {
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  ViewMedia: {
    flex: 1,
  },
  mediaItems: {
    marginBottom: 15,
    top: 5,
  },
  mediaWrapper: {
    flex: 1,
  },
  media: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
  },
  progressBarWrapper: {
    flex: 1,
    height: 3,
    backgroundColor: '#888',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
    padding: 15,
  },
  viewBottom: {
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  input: {
    width: '75%',
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    padding: 10,
    borderRadius: 15,
  },
  icon: {
    height: 30,
    width: 30,
    tintColor: '#fff',
  },
  viewIcon: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
