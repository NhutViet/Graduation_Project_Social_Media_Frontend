import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import VideoPlayer, {VideoRef} from 'react-native-video';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {useBookmarkStyles} from '../../StyleSheet/BookmarkedStyles';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {
  getItemsOfPlaylist,
  removeBookmark,
  switchBookmark,
} from '../../../services/bookmarkRedux/bookmarkSlice';
import {FlashList} from '@shopify/flash-list';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {PlaylistItem} from '@services/bookmarkRedux/bookmarkTypes';
import {Media, MediaR} from '@services/bookmarkRedux/bookmarkTypes';
import {
  ArrowLeft,
  MoreVertical,
  LayoutGrid,
  Clapperboard,
  X,
  Check,
  Video,
} from 'lucide-react-native';

interface RouteParams {
  title: string;
  playlistId: string;
}

const convertToImage = (uri: string): string => {
  if (
    uri.includes('videodelivery.net') &&
    uri.includes('/manifest/') &&
    !uri.endsWith('.jpg') // tránh convert ảnh đã hợp lệ
  ) {
    const parts = uri.split('/');
    const videoId = parts[3]; // lấy videoId từ đường dẫn
    return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=2s`;
  }
  return uri;
};

export const PlaylistsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {title, playlistId} = route.params as RouteParams;

  const styles = useBookmarkStyles();
  const {theme} = useTheme();
  const palette = Colors[theme];

  const dispatch = useDispatch<AppDispatch>();
  const {itemsByPlaylist, playlists} = useSelector(
    (state: RootState) => state.bookmark,
  );
  const [playlistItems, setPlaylistItems] = useState(
    itemsByPlaylist[playlistId] ?? [],
  );
  const isLoading = useSelector((s: RootState) => s.bookmark.isloading);
  const {refreshToken} = useSelector((state: RootState) => state.user);

  const [activeTab, setActiveTab] = useState<'grid' | 'reels'>('grid');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isSelec, setIsSelect] = useState(false);
  const [listSelected, setListSelected] = useState<string[]>([]);

  const modalizeRef = useRef<Modalize>(null);
  const selectRef = useRef<Modalize>(null);
  const switchRef = useRef<Modalize>(null);
  const videoRef = useRef<VideoRef>(null);

  const anotherplaylist = playlists.filter(
    playlist =>
      playlist._id !== playlistId && playlist.playlistName !== 'Music',
  );

  useEffect(() => {
    dispatch(getItemsOfPlaylist({playlistId, refreshToken}));
    setSelectedItem(null);
    modalizeRef.current?.close();
  }, [dispatch, playlistId]);

  useEffect(() => {
    setPlaylistItems(itemsByPlaylist[playlistId] ?? []);
  }, [itemsByPlaylist]);

  const openItem = (item: PlaylistItem) => {
    if (activeTab === 'grid') {
      navigation.navigate(
        'AllPostOfCollection' as never,
        {
          posts: playlistItems,
          targetPostId: item._id,
          playlistName: title,
          clickableHashtag: true,
          clearSearchRedux: true,
        } as never,
      );
    } else {
      navigation.navigate('AllReels', {
        reels: playlistItems,
        initialId: item._id,
      });
    }
  };

  const toggleSelect = (id: string) => {
    setListSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const selectAll = (items: PlaylistItem[]) => {
    const allIds = items.map(item => item._id);
    setListSelected(allIds);
  };

  const unselectAll = () => {
    setListSelected([]);
  };

  const isAllSelected = listSelected.length === playlistItems.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      unselectAll();
    } else {
      selectAll(playlistItems);
    }
  };

  const handleCancel = () => {
    setIsSelect(false);
    setListSelected([]);
  };

  const handleRight = () => {
    if (isSelec) {
      handleToggleAll();
    } else {
      selectRef.current?.open();
    }
  };

  const closeModal = () => modalizeRef.current?.close();

  const EmptyPlaceholder = ({message}: {message: string}) => (
    <View style={{alignItems: 'center', paddingVertical: 40}}>
      <Text style={{color: palette.textSecondary}}>{message}</Text>
    </View>
  );

  const renderTabBar = () => (
    <View style={[styles.tabBar, {backgroundColor: palette.background}]}>
      {(
        [
          {key: 'grid', icon: LayoutGrid},
          {key: 'reels', icon: Clapperboard},
        ] as const
      ).map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab,
            {borderBottomColor: palette.text},
          ]}
          onPress={() => setActiveTab(tab.key)}>
          <tab.icon
            size={20}
            color={activeTab === tab.key ? palette.text : palette.textSecondary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItemThumb = (item: PlaylistItem) => {
    const isVideo = item.itemType === 'reel';
    if (!(item.media && item.media.length > 0)) return null;
    const isSelected = listSelected.includes(item?._id!) || false;
    const thumb = isVideo
      ? convertToImage((item?.media[0] as Media)?.videoUrl)
      : (item.media[0] as MediaR)?.imageUrl;
    return (
      <TouchableOpacity
        style={styles.postItem}
        onPress={() => {
          if (isSelec) {
            toggleSelect(item._id);
          } else {
            openItem(item);
          }
        }}>
        <Image
          source={{uri: thumb}}
          style={styles.postImage}
          resizeMode="cover"
        />
        {isVideo && (
          <View style={styles.videoIconContainer}>
            <Video size={22} color="#fff" style={styles.videoIcon} />
          </View>
        )}
        {isSelec && (
          <View style={styles.overlay}>
            {isSelected && <Check size={18} color="#fff" />}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const GridContent = () => {
    const data = playlistItems;
    if (!data.length)
      return <EmptyPlaceholder message="Bạn vẫn chưa lưu bài viết nào." />;
    return (
      <FlatList
        data={data}
        numColumns={3}
        renderItem={({item}) => renderItemThumb(item)}
        keyExtractor={item => item._id!}
        extraData={[data.length, playlistItems]}
        contentContainerStyle={styles.postsGridContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const ReelsContent = () => {
    const data = playlistItems.filter(i => i.type === 'reel');
    if (!data.length && data.length === 0)
      return <EmptyPlaceholder message="Bạn chưa lưu thước phim nào." />;
    return (
      <FlatList
        data={data}
        numColumns={3}
        renderItem={({item}) => renderItemThumb(item)}
        keyExtractor={item => item._id!}
        extraData={[data.length, playlistItems]}
        contentContainerStyle={styles.postsGridContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderContent = () => {
    if (isLoading) return <EmptyPlaceholder message="Đang tải..." />;
    return activeTab === 'grid' ? <GridContent /> : <ReelsContent />;
  };

  const switchPlaylist = useCallback(
    (id: string) => {
      dispatch(
        switchBookmark({
          postIds: listSelected,
          playlistId: id,
          refreshToken,
        }),
      )
        .unwrap()
        .then(() => {
          //chỉnh hiển thị
          setPlaylistItems(prev =>
            prev.filter(item => !listSelected.includes(item._id)),
          );
          //reset chọn
          setIsSelect(false);
          setListSelected([]);
          switchRef.current?.close();
        })
        .catch(res => {
          GlobalAlertManager.show(
            'Lỗi',
            res?.response?.data?.message || 'Chuyển danh mục thất bại.',
          );
        });
    },
    [listSelected, refreshToken, dispatch],
  );

  const removeListBookmark = useCallback(() => {
    dispatch(
      removeBookmark({
        postIds: listSelected,
        refreshToken,
      }),
    )
      .unwrap()
      .then(() => {
        //chỉnh hiển thị
        setPlaylistItems(prev =>
          prev.filter(item => !listSelected.includes(item._id)),
        );
        //reset chọn
        setIsSelect(false);
        setListSelected([]);
        switchRef.current?.close();
      })
      .catch(res => {
        GlobalAlertManager.show(
          'Lỗi',
          res?.response?.data?.message || 'Bỏ lưu thất bại.',
        );
      });
  }, [listSelected, refreshToken, dispatch]);

  return (
    <SafeAreaView style={styles.playlistsContainer}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.playlistsHeader}>
        <TouchableOpacity
          onPress={() => {
            if (isSelec) {
              handleCancel();
            } else {
              navigation.goBack();
            }
          }}>
          {isSelec ? (
            <Text style={styles.textTop}>Hủy bỏ</Text>
          ) : (
            <ArrowLeft size={24} color={palette.text} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRight}>
          {isSelec ? (
            <Text style={styles.textTop}>
              {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Text>
          ) : (
            <MoreVertical size={24} color={palette.text} />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={handleRight}>
          {isSelec ? (
            <Text style={styles.textTop}>
              {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Text>
          ) : (
            <View style={styles.videoIconContainer}>
              <Clapperboard size={16} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {renderTabBar()}

      <View style={{flex: 1}}>{renderContent()}</View>

      {isSelec && (
        <View style={styles.bottomcontainer}>
          <TouchableOpacity
            style={[
              styles.bottomBtn,
              {opacity: listSelected.length > 0 ? 1 : 0.3},
            ]}
            disabled={listSelected.length === 0}
            onPress={removeListBookmark}>
            <Text style={styles.textBtn}>Bỏ lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomBtn,
              {opacity: listSelected.length > 0 ? 1 : 0.3},
            ]}
            disabled={listSelected.length === 0}
            onPress={() => switchRef.current?.open()}>
            <Text style={styles.textBtn}>Chuyển danh mục lưu</Text>
          </TouchableOpacity>
        </View>
      )}

      <Portal>
        <Modalize
          ref={modalizeRef}
          modalStyle={{backgroundColor: palette.background}}
          adjustToContentHeight
          withHandle={false}
          onClose={() => setSelectedItem(null)}>
          <View style={styles.modalizeContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <X size={20} color={palette.text} />
              </TouchableOpacity>
            </TouchableOpacity>
            {selectedItem &&
              (selectedItem.type === 'reel' ? (
                <VideoPlayer
                  ref={videoRef}
                  source={{uri: selectedItem.media[0]?.videoUrl}}
                  style={styles.fullScreenVideo}
                  controls
                  resizeMode="contain"
                  paused={false}
                />
              ) : (
                <Image
                  source={{uri: selectedItem.media[0]?.imageUrl}}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              ))}
          </View>
        </Modalize>
        {/* //////select */}
        <Modalize
          ref={selectRef}
          adjustToContentHeight
          modalStyle={styles.modal}
          handleStyle={styles.handle}
          withHandle>
          <View style={styles.box}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setIsSelect(true);
                selectRef.current?.close();
              }}>
              <Text style={styles.optionText}>Chọn...</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancel}
              onPress={() => selectRef.current?.close()}>
              <Text style={styles.cancelText}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </Modalize>
        {/* /////////////switch bookmark sang playlist khác */}
        <Modalize
          ref={switchRef}
          adjustToContentHeight
          modalStyle={styles.modal}
          handleStyle={styles.handle}
          withHandle>
          <View style={{width: '100%', height: 100}}>
            <FlashList
              data={anotherplaylist}
              horizontal
              estimatedItemSize={200}
              keyExtractor={item => item._id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={item => {
                return (
                  <TouchableOpacity
                    style={styles.anotherBox}
                    onPress={() => switchPlaylist(item.item._id)}>
                    <Image
                      source={{
                        uri:
                          item.item.thumbnails[0] === ''
                            ? item.item.coverImg
                            : convertToImage(item.item.thumbnails[0]),
                      }}
                      style={styles.anotherImage}
                    />
                    <Text style={styles.anotherText}>
                      {item.item.playlistName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modalize>
      </Portal>
    </SafeAreaView>
  );
};
