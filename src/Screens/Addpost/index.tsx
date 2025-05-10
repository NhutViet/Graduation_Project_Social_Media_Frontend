import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CameraRoll,
  PhotoIdentifier,
  PhotoIdentifiersPage,
} from '@react-native-camera-roll/camera-roll';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {getAddPostStyles} from '../../StyleSheet/AddPostStyles';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';

export const AddPost = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const {width} = Dimensions.get('window');
  const navigation: any = useNavigation();
  const [medias, setMedias] = useState<PhotoIdentifier[]>([]);
  const [pageInfo, setPageInfo] = useState<
    PhotoIdentifiersPage['page_info'] | null
  >(null);
  const [selectedMedia, setSelectedMedia] = useState<PhotoIdentifier | null>(
    null,
  );
  const [selectedItems, setSelectedItems] = useState<PhotoIdentifier[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const styles = getAddPostStyles(theme);

  async function requestPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  // lấy ảnh từ máy
  const fetchMedia = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 50,
        assetType: 'All',
      });

      setMedias(result.edges);
      setPageInfo(result.page_info);
      if (result.edges.length > 0) {
        setSelectedMedia(result.edges[0]); // tự động chọn ảnh đầu tiên
      }
    } catch (error) {
      console.log('AddPost line 26: ', error);
    }
  };

  useEffect(() => {
    (async () => {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        fetchMedia();
      } else {
        console.log('AddPost line 63: Permission denied');
      }
    })();
  }, []);

  // load thêm ảnh
  const fetchMoreMedia = async () => {
    if (!pageInfo?.has_next_page) return;

    const result = await CameraRoll.getPhotos({
      first: 50,
      assetType: 'All',
      after: pageInfo.end_cursor, // lấy trang tiếp theo dựa vào end_cursor
    });

    setMedias(prev => [...prev, ...result.edges]);
    setPageInfo(result.page_info);
  };

  const handleSelect = (item: PhotoIdentifier) => {
    if (isMultiSelect) {
      const isSelected = selectedItems.some(
        i => i.node.image.uri === item.node.image.uri,
      );
      if (isSelected) {
        setSelectedItems(prev =>
          prev.filter(i => i.node.image.uri !== item.node.image.uri),
        );
      } else {
        setSelectedItems(prev => [...prev, item]);
      }
    } else {
      // Single mode: chỉ chọn duy nhất 1 item
      setSelectedItems([item]);
    }
    setSelectedMedia(item); // luôn cập nhật ảnh lớn
  };

  const handleNext = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 ảnh hoặc video');
      return;
    }
    navigation.navigate('PostSetting', {selectedMedia: selectedItems});
  };

  const toggleSelectMode = () => {
    setIsMultiSelect(prev => {
      const next = !prev;
      if (next) {
        // Từ single → multi
        if (selectedMedia) {
          setSelectedItems([selectedMedia]);
        }
      } else {
        // Từ multi → single
        if (selectedItems.length > 0) {
          const lastSelected = selectedItems[selectedItems.length - 1];
          setSelectedMedia(lastSelected);
          setSelectedItems([lastSelected]);
        }
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.rowSpace}>
          <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')}>
            <Image
              source={require('../../../assets/icon/x.png')}
              style={styles.iconR}
            />
          </TouchableOpacity>
          <Text style={styles.title}>New Campaign</Text>
          <TouchableOpacity onPress={handleNext}>
            <Text style={[styles.textR, {color: color.primary}]}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị ảnh/video lớn */}
        <View style={styles.showContainer}>
          {selectedMedia ? (
            <Image
              source={{uri: selectedMedia.node.image.uri}}
              style={styles.showImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.placeholderText}>Select a media</Text>
          )}
        </View>

        <View style={styles.container}>
          <View style={styles.rowSpace}>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.textR}>Recently</Text>
              <Image
                source={require('../../../assets/icon/right.png')}
                style={styles.iconRR}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleSelectMode}
              style={[
                styles.btnCir,
                {backgroundColor: isMultiSelect ? color.gray : 'transparent'},
              ]}>
              <Image
                source={require('../../../assets/icon/gallery.png')}
                style={[styles.icon]}
              />
            </TouchableOpacity>
          </View>

          <FlashList
            data={medias}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            extraData={selectedItems}
            renderItem={({item}) => {
              const isSelected = selectedItems.some(
                i => i.node.image.uri === item.node.image.uri,
              );
              const indexSelected = selectedItems.findIndex(
                i => i.node.image.uri === item.node.image.uri,
              );
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelect(item)}>
                  <Image
                    source={{uri: item.node.image.uri}}
                    style={{
                      width: width / 3,
                      height: width / 3,
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: 'white',
                    }}
                  />
                  {/* Thứ tự chọn */}
                  {indexSelected >= 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: 'black', fontSize: 12}}>
                        {indexSelected + 1}
                      </Text>
                    </View>
                  )}
                  {/* Icon video */}
                  {item.node.type.startsWith('video') && (
                    <Image
                      source={require('../../../assets/icon/x.png')}
                      style={{
                        position: 'absolute',
                        bottom: 5,
                        right: 5,
                        width: 20,
                        height: 20,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            estimatedItemSize={width / 3}
            onEndReached={fetchMoreMedia}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
