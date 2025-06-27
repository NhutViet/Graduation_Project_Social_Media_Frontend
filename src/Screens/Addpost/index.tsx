import {
  Text,
  View,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Modal,
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
import { X, ChevronRight, Images, CameraOff, Check, Film } from 'lucide-react-native';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

const menu: string[] = ['Tất cả', 'Băng hình', 'Hình ảnh'];

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
  const isVideo = selectedMedia?.node.type.startsWith('video');
  const [selectedItems, setSelectedItems] = useState<PhotoIdentifier[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  //phân loại ảnh và video
  const [filter, setFilter] = useState('Tất cả');
  const [showModalFilter, setShowModalFilter] = useState(false);

  const styles = getAddPostStyles(theme);

  async function requestPermission() {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]);
        return (
          granted['android.permission.READ_MEDIA_IMAGES'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_MEDIA_VIDEO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  }

  // lấy ảnh từ máy
  const fetchMedia = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 50,
        assetType:
          filter === 'Tất cả'
            ? 'All'
            : filter === 'Videos'
            ? 'Videos'
            : 'Photos',
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
  }, [filter]);

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

  const handleSelect = (item: any) => {
    const isVideo = item.node.type.startsWith('video');
    const isVideoAlreadySelected =
      selectedItems.length > 0 &&
      selectedItems[0].node.type.startsWith('video');
    const isImageAlreadySelected =
      selectedItems.length > 0 &&
      !selectedItems[0].node.type.startsWith('video');

    if (isVideo) {
      if (isImageAlreadySelected) {
        GlobalAlertManager.show(
          'Thông báo',
          'Không thể chọn cả video và ảnh cùng một lúc!!!',
        );
        return;
      }

      //nếu cchỉ vd
      const isSelected =
        selectedItems[0]?.node.image.uri === item.node.image.uri;
      if (selectedItems.length === 1 && isSelected) {
        setSelectedItems([]);
        setSelectedMedia(null);
      } else {
        setSelectedItems([item]);
        setSelectedMedia(item);
      }
    } else {
      if (isVideoAlreadySelected) {
        GlobalAlertManager.show(
          'Thông báo',
          'Không thể chọn cả video và ảnh cùng một lúc!!!',
        );
        return;
      }

      const isSelected = selectedItems.some(
        i => i.node.image.uri === item.node.image.uri,
      );

      if (isMultiSelect) {
        if (isSelected) {
          setSelectedItems(prev =>
            prev.filter(i => i.node.image.uri !== item.node.image.uri),
          );
          setSelectedMedia(selectedItems[selectedItems.length - 2]);
        } else {
          if (selectedItems.length >= 10) {
            Alert.alert('Thông báo', 'Chỉ được chọn tối đa 10 ảnh!');
            return;
          }

          setSelectedItems(prev => [...prev, item]);
          setSelectedMedia(item);
        }
      } else {
        if (isSelected) {
          setSelectedItems([]);
          setSelectedMedia(null);
        } else {
          // Single mode: chỉ chọn duy nhất 1 item
          setSelectedItems([item]);
          setSelectedMedia(item); // luôn cập nhật ảnh lớn
        }
      }
    }
  };

  const handleNext = () => {
    if (selectedItems.length === 0) {
      GlobalAlertManager.show(
        'Thông báo',
        'Hãy chọn ít nhất một video hoặc ảnh',
      );
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

  const handleFilter = (filter: any) => {
    setFilter(filter);
    setShowModalFilter(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.rowSpace}>
          <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')}>
            <X size={30} color={color.text}/>
          </TouchableOpacity>
          <Text style={styles.title}>Bài đăng mới</Text>
          <TouchableOpacity onPress={handleNext}>
            <Text style={[styles.textR, {color: color.primary}]}>
              Tiếp theo
            </Text>
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
            <Text style={styles.placeholderText}>Chọn một phương tiện</Text>
          )}
        </View>

        <View style={styles.container}>
          <View
            style={[
              styles.rowSpace,
              {borderBottomColor: color.gray, borderBottomWidth: 1},
            ]}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => setShowModalFilter(true)}>
              <Text style={styles.textR}>{filter}</Text>
              <ChevronRight size={12} color={color.text} style={styles.iconRR}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleSelectMode}
              style={[
                styles.btnCir,
                {backgroundColor: isMultiSelect ? color.gray : 'transparent'},
              ]}>
              <Images size={20} color={color.text}/>
            </TouchableOpacity>
          </View>
          {medias.length === 0 ? (
            <View style={styles.emtyContainer}>
              <CameraOff size={30} style={{marginBottom: 15}} color={color.text}/>
              <Text style={[styles.notFound]}>Không tìm thấy 🙂‍↔️!</Text>
            </View>
          ) : (
            <FlashList
              data={medias}
              numColumns={3}
              keyExtractor={(item, index) => index.toString()}
              extraData={[selectedItems, filter]}
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
                      }}
                    />
                    {isSelected && (
                      <View
                        style={{
                          width: width / 3,
                          height: width / 3,
                          position: 'absolute',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                        }}
                      />
                    )}
                    {/* Thứ tự chọn */}
                    {indexSelected >= 0 ? (
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
                    ) : (
                      <View
                        style={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          borderWidth: 1,
                          borderColor: 'white',
                        }}></View>
                    )}
                    {/* Icon video */}
                    {item.node.type.startsWith('video') && (
                      <Film 
                        style={{
                          position: 'absolute',
                          bottom: 5,
                          right: 5,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: 3,
                        }}
                        color={color.white}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              estimatedItemSize={width / 3}
              onEndReached={fetchMoreMedia}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </View>

      {/* modal filter ---------------------------------------*/}
      <Modal visible={showModalFilter} animationType="fade" transparent>
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <FlashList
              data={menu}
              estimatedItemSize={200}
              showsVerticalScrollIndicator={false}
              renderItem={item => {
                return (
                  <TouchableOpacity
                    style={styles.filterContainer}
                    onPress={() => handleFilter(item.item)}>
                    <Text style={styles.textR}>{item.item}</Text>
                    {filter === item.item && (
                      <Check color={color.primary}/>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
