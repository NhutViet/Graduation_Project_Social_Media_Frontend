import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import BottomSheet, {BottomSheetRef} from './BottomSheet/BottomSheetMusic';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

const ITEM_SIZE = Dimensions.get('window').width * 0.25 - 1;

interface MediaItem {
  uri: string;
  type: string;
  duration: number;
  id: string;
}

interface MusicInfo {
  musicId: string;
  timeStart: number;
  timeEnd: number;
  song: string;
  songImage: string;
}

const PostStory = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();
  const sheetRef = useRef<BottomSheetRef>(null);

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //chọn nhạc
  const [selectedMusic, setSelectedMusic] = useState<MusicInfo | null>(null);
  const [songUrl, setSongUrl] = useState<string | null>(null);

  //lấy ảnh của máy
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const permissions =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const results = await PermissionsAndroid.request(permissions);
      return results === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      GlobalAlertManager.show('Thông báo', 'Không thể yêu cầu quyền truy cập.');
      return false;
    }
  }, []);

  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setError('Không có quyền truy cập thư viện media.');
        return;
      }

      const result = await CameraRoll.getPhotos({
        first: 50,
        assetType: 'All',
        include: ['playableDuration', 'filename'],
      });

      const media: MediaItem[] = result.edges.map(edge => ({
        uri: edge.node.image.uri,
        type: edge.node.type,
        duration: edge.node.image?.playableDuration || 0,
        id: edge.node.image.filename || edge.node.image.uri,
      }));

      setMediaList(media);
    } catch {
      setError('Lỗi khi tải media.');
    } finally {
      setIsLoading(false);
    }
  }, [requestPermissions]);

  //kiểm tra dữ liệu trước khi điều hướng
  const validateNavigationData = useCallback(
    (item: MediaItem): boolean => {
      if (!item?.uri) {
        setError('Không thể chọn media này.');
        return false;
      }
      if (selectedMusic && (!selectedMusic.musicId || !selectedMusic.song)) {
        setError('Dữ liệu nhạc không hợp lệ.');
        return false;
      }
      if (songUrl && typeof songUrl !== 'string') {
        setError('URL bài hát không hợp lệ.');
        return false;
      }
      return true;
    },
    [selectedMusic, songUrl],
  );

  const formatDuration = useCallback((duration: number) => {
    if (!duration || duration <= 0) return '00:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  //khi nhấm vào item media
  const handleItemPress = useCallback(
    (item: MediaItem, selectedMusic?: MusicInfo, songUrl?: string) => {
      if (!validateNavigationData) {
        return;
      }
      navigation.navigate('EditStory', {
        selectedItem: item,
        selectedMusic: selectedMusic || undefined,
        songUrl: songUrl || undefined,
      });
    },
    [navigation, selectedMusic, songUrl, validateNavigationData],
  );

  const renderItem = useCallback(
    ({item}: {item: MediaItem}) => {
      const isVideo = item.type?.includes('video');

      return (
        <TouchableOpacity
          onPress={() =>
            handleItemPress(
              item,
              selectedMusic || undefined,
              songUrl || undefined,
            )
          }
          activeOpacity={0.8}>
          <View style={styles.thumbnailWrapper}>
            <Image source={{uri: item.uri}} style={styles.thumbnail} />
            {isVideo && (
              <View style={styles.durationContainer}>
                <Text style={styles.videoDuration}>
                  {formatDuration(item.duration)}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [formatDuration, handleItemPress, selectedMusic, songUrl],
  );

  const keyExtractor = (item: any) => item.id;

  //tải media khi component được mount
  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.navigate('BottomTabs')}>
          <Image
            style={[styles.icon, {tintColor: color.text}]}
            source={require('../../../assets/icon/left.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.topSection}>
        <TopButton
          icon={require('../../../assets/icon/music.png')}
          label="Music"
          color={color.text}
          onPress={() => sheetRef.current?.open()}
        />
      </View>

      <View style={styles.mid}>
        <Text style={[styles.titleMid, {color: color.text}]}>
          Gần đây {'>'}
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={color.text} style={{flex: 1}} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlashList
          data={mediaList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={4}
          extraData={[selectedMusic]}
          estimatedItemSize={ITEM_SIZE}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy media</Text>
          }
        />
      )}

      <BottomSheet
        ref={sheetRef}
        onDoneSelect={(musicInfo: any) => {
          setSelectedMusic(musicInfo);
        }}
        songUrl={(url: any) => {
          setSongUrl(url);
        }}
      />
    </SafeAreaView>
  );
};

//component TopButton
interface TopButtonProps {
  icon: any;
  label: string;
  color: string;
  onPress?: () => void;
}

const TopButton = ({icon, label, onPress, color}: TopButtonProps) => (
  <TouchableOpacity style={styles.btnTop} onPress={onPress}>
    <View style={styles.iconBlock}>
      <Image
        style={[styles.imgTop, {tintColor: color}]}
        source={icon}
        resizeMode="contain"
      />
    </View>
    <Text style={[styles.txtTop, {color}]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {flexDirection: 'row', margin: 15},
  headerIcon: {width: 20, height: 20},
  icon: {width: '100%', height: '100%', resizeMode: 'contain'},
  topSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 15,
  },
  btnTop: {
    borderWidth: 1,
    borderColor: '#CDD7E1',
    width: '75%',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBlock: {height: 35, width: 60, padding: 2},
  imgTop: {width: '100%', height: '100%'},
  txtTop: {marginTop: 6, fontSize: 15, fontWeight: '400'},
  mid: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
  titleMid: {fontSize: 16, fontWeight: '500'},
  grid: {paddingLeft: 1},
  thumbnailWrapper: {
    position: 'relative',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginRight: 1,
    marginBottom: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {width: '100%', height: '100%'},
  durationContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDuration: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

export default PostStory;
