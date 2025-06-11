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
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import BottomSheet, {BottomSheetRef} from './BottomSheet/BottomSheetMusic';

const ITEM_SIZE = Dimensions.get('window').width * 0.25 - 1;

const PostStory = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();
  const sheetRef = useRef<BottomSheetRef>(null);

  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //chọn nhạc 
  const [selectedMusic, setSelectedMusic] = useState<{
      musicId: string;
      timeStart: number;
      timeEnd: number;
      song: string;
      songImage: string;
    } | null>(null);
    const [songUrl, setSongUrl] = useState<any | null>(null);

    //lấy ảnh của máy
  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const permissions = [
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ];
      const results = await Promise.all(
        permissions.map(permission => PermissionsAndroid.request(permission)),
      );
      return results.every(
        result => result === PermissionsAndroid.RESULTS.GRANTED,
      );
    } catch {
      return false;
    }
  };

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setError('Không có quyền truy cập media.');
        return;
      }
      const result = await CameraRoll.getPhotos({
        first: 100,
        assetType: 'All',
        include: ['playableDuration', 'filename'],
      });

      const media = result.edges.map(edge => {
        const node = edge.node as any;
        return {
          uri: node.image.uri,
          type: node.type,
          duration: node.playableDuration || 0,
          id: node.image.filename || node.image.uri,
        };
      });

      setMediaList(media);
    } catch {
      setError('Lỗi khi tải media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const formatDuration = (duration: number) => {
    if (!duration || duration <= 0) return '00:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleItemPress = (item: any) => {
    navigation.navigate('EditStory', {selectedItem: item, selectedMusic: selectedMusic, songUrl: songUrl?.url || songUrl});
  };

  const renderItem = ({item}: any) => {
    const isVideo = item.type?.includes('video');

    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
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
  };

  const keyExtractor = (item: any) => item.id;

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
          icon={require('../../../assets/icon/iconAndYou.png')}
          label="Template"
          color={color.text}
        />
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
          estimatedItemSize={ITEM_SIZE}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy media</Text>
          }
        />
      )}

      <BottomSheet ref={sheetRef} onDoneSelect={(musicInfo: any) => {
          setSelectedMusic(musicInfo);
        }}
        songUrl={(url: any) => {
          setSongUrl(url);
        }}/>
    </SafeAreaView>
  );
};

const TopButton = ({icon, label, onPress, color}: any) => (
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
    justifyContent: 'space-between',
    margin: 15,
  },
  btnTop: {
    borderWidth: 1,
    borderColor: '#CDD7E1',
    width: '48%',
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
