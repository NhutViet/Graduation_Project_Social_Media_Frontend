import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import {ChevronLeft, Check, CircleX} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {
  createPlaylist,
  getItemsOfPlaylist,
  switchBookmark,
} from '../../../services/bookmarkRedux/bookmarkSlice';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

export const AddCollectionScreen = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const {itemsByPlaylist, playlists} = useSelector(
    (state: RootState) => state.bookmark,
  );

  useEffect(() => {
    playlists.forEach(playlist => {
      dispatch(getItemsOfPlaylist({playlistId: playlist._id, refreshToken}));
    });
  }, [playlists]);

  const allItems = useMemo(() => {
    return Object.values(itemsByPlaylist).flat();
  }, [itemsByPlaylist, playlists]);

  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedPostIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  ///////////////redux
  const dispatch = useDispatch<AppDispatch>();
  const {refreshToken} = useSelector((state: RootState) => state.user);
  const {isloading, messageError} = useSelector(
    (state: RootState) => state.bookmark,
  );

  const handleSave = async () => {
    if (!name.trim()) {
      GlobalAlertManager.show('Lỗi', 'Vui lòng nhập tên bộ sưu tập');
      return;
    }

    if (selectedPostIds.length === 0) {
      GlobalAlertManager.show('Lỗi', 'Vui lòng chọn ít nhất 1 bài viết');
      return;
    }

    if (isloading) return;

    try {
      // 1. Tạo playlist mới
      const newPlaylist = await dispatch(
        createPlaylist({playlistName: name.trim(), refreshToken}),
      ).unwrap();

      const newPlaylistId = newPlaylist._id;

      // 2. Gọi API chuyển nhiều bài
      await dispatch(
        switchBookmark({
          playlistId: newPlaylistId,
          postIds: selectedPostIds,
          refreshToken,
        }),
      ).unwrap();

      GlobalAlertManager.show('Thông báo', 'Tạo danh sách mới thành công.');
      // 3. Quay lại màn hình trước
      navigation.goBack();
    } catch (err: any) {
      GlobalAlertManager.show('Lỗi', err.message || 'Không thể tạo bộ sưu tập');
    }
  };

  const renderPostItem = useCallback(
    ({item}: {item: any}) => {
      const isSelected = selectedPostIds.includes(item._id!);
      const isVideo = item.itemType === 'reel';
      if (!item?.media || item.media.length === 0) return null;
      const thumbnail = isVideo
        ? `https://videodelivery.net/${
            item.media?.[0]?.videoUrl?.split('/')[3]
          }/thumbnails/thumbnail.jpg?time=2s`
        : (item.media?.[0] as any)?.imageUrl;

      if (!thumbnail) return null;

      return (
        <TouchableOpacity
          onPress={() => toggleSelect(item._id!)}
          style={styles.postItem}>
          <Image source={{uri: thumbnail}} style={styles.postImage} />
          <View style={styles.iconOverlay}>
            <Image
              style={styles.icon}
              source={
                isVideo
                  ? require('../../../assets/icon/reels.png')
                  : require('../../../assets/icon/gallery.png')
              }
            />
          </View>
          {isSelected && (
            <View style={styles.overlayCheck}>
              <Check size={18} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [selectedPostIds, toggleSelect],
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={color.text} />
          </TouchableOpacity>
          <Text style={[styles.title, {color: color.text}]}>
            Bộ sưu tập mới
          </Text>
          <View style={{width: 24}} />
        </View>
        <View style={styles.nameInput}>
          <TextInput
            placeholder="Tên bộ sưu tập"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            style={[styles.input, {color: color.text}]}
          />
          {name.length > 0 && (
            <TouchableOpacity onPress={() => setName('')}>
              <CircleX size={20} color={color.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {allItems.length === 0 ? (
        <Text style={{textAlign: 'center', marginTop: 32, color: color.text}}>
          Không có bài viết nào đã lưu.
        </Text>
      ) : (
        <FlatList
          data={allItems}
          keyExtractor={item => item._id!}
          numColumns={3}
          renderItem={renderPostItem}
          contentContainerStyle={styles.gridContainer}
        />
      )}

      {selectedPostIds.length > 0 && (
        <TouchableOpacity
          style={[styles.saveButton, isloading && {opacity: 0.6}]}
          onPress={handleSave}
          disabled={isloading}>
          <Text style={styles.saveButtonText}>
            {isloading ? 'Đang lưu...' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  nameInput: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: 6,
    paddingBottom: 100,
  },
  postItem: {
    width: '31.5%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  overlayCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  iconOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
