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
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Video from 'react-native-video';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import BottomSheet, {BottomSheetRef} from './BottomSheet/BottomSheetMusic';

const width = Dimensions.get('window').width * 0.25 - 1;

export const PostStory = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();

  const [mediaList, setMediaList] = useState([]);
  const [videoDurations, setVideoDurations] = useState<Record<string, number>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const permissions = [
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ];

        const results = await Promise.all(
          permissions.map(permission =>
            PermissionsAndroid.request(permission, {
              title: 'Media Access Permission',
              message:
                'This app needs access to your media library to display photos and videos.',
              buttonNeutral: 'Ask Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }),
          ),
        );

        return results.every(
          result => result === PermissionsAndroid.RESULTS.GRANTED,
        );
      }
      return true;
    } catch (err) {
      setError('Failed to request permissions');
      return false;
    }
  };

  useEffect(() => {
    const loadMedia = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
          setError('Media access permission denied');
          return;
        }

        const result = await CameraRoll.getPhotos({
          first: 100,
          assetType: 'All',
          include: ['playableDuration', 'filename'],
        });

        const media: any = result.edges.map((edge: any) => ({
          uri: edge.node.image.uri,
          type: edge.node.type,
          duration: edge.node.playableDuration || 0,
          id: edge.node.image.filename || edge.node.image.uri,
        }));

        setMediaList(media);
      } catch (error) {
        setError('Failed to load media');
        console.error('Error loading media:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedia();
  }, []);

  const handleItemPress = useCallback(
    (item: any) => {
      console.log('Navigating to EditStory with item:', item);
      navigation.navigate('EditStory', {
        selectedItem: item,
      });
    },
    [navigation],
  );

  const onLoadVideo = useCallback((data: any, uri: string) => {
    console.log(`Video loaded for ${uri}, duration: ${data.duration}`);
    if (data.duration && data.duration > 0) {
      setVideoDurations(prev => ({
        ...prev,
        [uri]: data.duration,
      }));
    }
  }, []);

  const formatDuration = useCallback((duration: number) => {
    if (!duration || duration <= 0) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  const renderItem = useCallback(
    ({item}: any) => {
      const duration = videoDurations[item.uri] || item.duration || 0;

      console.log(`Rendering item: ${item.uri}, Duration: ${duration}`);

      return (
        <TouchableOpacity
          onPress={() => handleItemPress(item)}
          activeOpacity={0.8}>
          <View style={styles.thumbnailWrapper}>
            <Image source={{uri: item.uri}} style={styles.thumbnail} />
            {item.type.includes('video') && (
              <>
                <Video
                  source={{uri: item.uri}}
                  style={styles.thumbnail}
                  onLoad={data => onLoadVideo(data, item.uri)}
                  paused={true}
                  muted={true}
                  preload="metadata"
                />
                <Text style={styles.videoDuration}>
                  {formatDuration(duration)}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [videoDurations, onLoadVideo, handleItemPress],
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  console.log('Rendering PostStory');

  const sheetRef = useRef<BottomSheetRef>(null);

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
        <TouchableOpacity style={styles.btnTop}>
          <View style={styles.iconBlock}>
            <Image
              style={[styles.imgTop, {tintColor: color.text}]}
              source={require('../../../assets/icon/iconAndYou.png')}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.txtTop, {color: color.text}]}>Template</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnTop}
          onPress={() => sheetRef.current?.open()}>
          <View style={styles.iconBlock}>
            <Image
              style={[styles.imgTop, {tintColor: color.text}]}
              source={require('../../../assets/icon/music.png')}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.txtTop, {color: color.text}]}>Music</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mid}>
        <TouchableOpacity>
          <Text style={[styles.titleMid, {color: color.text}]}>
            Gần đây {'>'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSection}>
        <FlashList
          data={mediaList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={4}
          estimatedItemSize={width}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading ? (
              <Text style={styles.emptyText}>Không tìm thấy media</Text>
            ) : null
          }
        />
      </View>
      <BottomSheet ref={sheetRef} children={undefined} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    margin: 15,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
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
  iconBlock: {
    height: 35,
    width: 60,
    padding: 2,
  },
  imgTop: {
    width: '100%',
    height: '100%',
  },
  txtTop: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '400',
  },
  bottomSection: {
    flex: 1,
    // position: 'relative',
  },
  grid: {
    paddingLeft: 1,
  },
  thumbnailWrapper: {
    position: 'relative',
    width: width,
    height: width,
    marginRight: 1,
    marginBottom: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  // hiddenVideo: {
  //   width: '100%',
  //   height: '100%',
  // },
  videoDuration: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    color: '#fff',
    fontSize: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    zIndex: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
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
  mid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },
  titleMid: {
    fontSize: 16,
    fontWeight: '500',
  },
});
