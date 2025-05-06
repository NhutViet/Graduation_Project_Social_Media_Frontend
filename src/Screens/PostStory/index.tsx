import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Video from 'react-native-video';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';

export const PostStory = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();

  const [mediaList, setMediaList] = useState([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    {uri: string; order: number}[]
  >([]);
  const [videoDurations, setVideoDurations] = useState<Record<string, number>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  // Use useRef to store the latest value of isMultiSelectMode
  const isMultiSelectModeRef = useRef(isMultiSelectMode);
  useEffect(() => {
    isMultiSelectModeRef.current = isMultiSelectMode;
    console.log(
      'Updated isMultiSelectModeRef to:',
      isMultiSelectModeRef.current,
    );
  }, [isMultiSelectMode]);

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

  const toggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(prev => {
      const newMode = !prev;
      console.log('Toggling multi-select mode to:', newMode);
      if (newMode) {
        // Entering multi-select mode, reset selected items
        setSelectedItems([]);
      }
      return newMode;
    });
  }, []);

  const handleItemPress = useCallback(
    (item: any) => {
      console.log(
        'handleItemPress called, Current isMultiSelectModeRef:',
        isMultiSelectModeRef.current,
      );
      if (isMultiSelectModeRef.current) {
        setSelectedItems((prev: any) => {
          const index = prev.findIndex((i: any) => i.uri === item.uri);
          if (index !== -1) {
            // Deselect the item
            const updatedItems = prev
              .filter((i: any) => i.uri !== item.uri)
              .map((media: any, idx: number) => ({...media, order: idx + 1}));
            console.log('Deselected, Updated Items:', updatedItems);
            return updatedItems;
          }
          // Select the item
          const updatedItems = [...prev, {...item, order: prev.length + 1}];
          console.log('Selected, Updated Items:', updatedItems);
          return updatedItems;
        });
      } else {
        // Single select mode: navigate immediately to EditStory
        console.log('Navigating to EditStory with single item:', item);
        navigation.navigate('EditStory', {
          selectedItem: item,
          clearSelections: () => setSelectedItems([]), // Pass callback to clear selections
        });
      }
    },
    [navigation],
  );

  const onLoadVideo = useCallback((data: any, uri: any) => {
    setVideoDurations(prev => ({
      ...prev,
      [uri]: data.duration,
    }));
  }, []);

  const formatDuration = useCallback((duration: any) => {
    if (!duration || duration <= 0) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  const renderItem = useCallback(
    ({item}: any) => {
      const isSelected = selectedItems.some((i: any) => i.uri === item.uri);
      const selectionOrder =
        selectedItems.find((i: any) => i.uri === item.uri)?.order || 0;
      const duration = videoDurations[item.uri] || item.duration || 0;

      console.log(
        'Rendering item:',
        item.uri,
        'Is Selected:',
        isSelected,
        'Order:',
        selectionOrder,
        'isMultiSelectMode:',
        isMultiSelectMode,
      );

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
                  style={styles.hiddenVideo}
                  onLoad={data => onLoadVideo(data, item.uri)}
                  paused
                  muted
                />
                <Text style={styles.videoDuration}>
                  {formatDuration(duration)}
                </Text>
              </>
            )}
            {isSelected && (
              <View style={styles.selectionCircle}>
                <Text style={styles.selectionNumber}>{selectionOrder}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [
      selectedItems,
      videoDurations,
      onLoadVideo,
      handleItemPress,
      isMultiSelectMode,
    ],
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  const handleNextPress = () => {
    if (selectedItems.length > 0) {
      console.log(
        'Navigating to EditStory with multiple items:',
        selectedItems,
      );
      navigation.navigate('EditStory', {
        selectedItems,
        clearSelections: () => setSelectedItems([]), // Pass callback to clear selections
      });
    } else {
      console.log('No items selected');
      Alert.alert(
        'Thông báo',
        'Vui lòng chọn ít nhất một hình ảnh hoặc video!',
      );
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  console.log('Rendering PostStory, isMultiSelectMode:', isMultiSelectMode);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')}>
          <Image
            style={[styles.headerIcon, {tintColor: color.text}]}
            source={require('../../../assets/icon/left.png')}
          />
        </TouchableOpacity>
        <Text style={{color: color.text}}>Tạo Story</Text>
        <TouchableOpacity onPress={handleNextPress}>
          <Text style={{color: selectedItems.length > 0 ? color.text : '#888'}}>
            Tiếp
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.btnTop}>
          <Image
            style={[styles.imgTop, {tintColor: color.text}]}
            source={require('../../../assets/icon/iconAndYou.png')}
            resizeMode="contain"
          />
          <Text style={[styles.txtTop, {color: color.text}]}>Template</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnTop}>
          <Image
            style={[styles.imgTop, {tintColor: color.text}]}
            source={require('../../../assets/icon/music.png')}
            resizeMode="contain"
          />
          <Text style={[styles.txtTop, {color: color.text}]}>Music</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mid}>
        <TouchableOpacity>
          <Text style={[styles.titleMid, {color: color.text}]}>
            Gần đây {'>'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.multiSelectButton,
            {backgroundColor: color.background},
          ]}
          onPress={toggleMultiSelectMode}>
          <Image source={require('../../../assets/icon/Select.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSection}>
        <FlashList
          data={mediaList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={4}
          estimatedItemSize={92}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={
            !isLoading ? (
              <Text style={styles.emptyText}>Không tìm thấy media</Text>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcon: {
    width: 15,
    height: 15,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  btnTop: {
    borderWidth: 1,
    borderColor: '#CDD7E1',
    width: 170,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgTop: {
    height: 35,
    width: 60,
  },
  txtTop: {
    fontSize: 15,
    fontWeight: '400',
  },
  bottomSection: {
    flex: 1,
    position: 'relative',
  },
  grid: {
    padding: 5,
  },
  thumbnailWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  hiddenVideo: {
    width: 0,
    height: 0,
    position: 'absolute',
  },
  selectionCircle: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    zIndex: 10,
  },
  selectionNumber: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
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
  multiSelectButton: {
    borderRadius: 25,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiSelectIcon: {
    fontSize: 20,
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
