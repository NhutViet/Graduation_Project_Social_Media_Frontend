import React, {useCallback, useEffect, useRef, useState, memo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import VideoPlayer from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {useBookmarkStyles} from '../../StyleSheet/BookmarkedStyles';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {
  removeBookmark,
} from '../../../services/bookmarkRedux/bookmarkSlice';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {PlaylistItem} from '@services/bookmarkRedux/bookmarkTypes';
import {Media, MediaR} from '@services/bookmarkRedux/bookmarkTypes';
import {
  ArrowLeft,
  MoreVertical,
  LayoutGrid,
  Clapperboard,
  Check,
  Video,
} from 'lucide-react-native';
import CustomPopupModal from '../../../components/Global/CustomPopupModal';


export const PlaylistsScreen = () => {
  const navigation = useNavigation<any>();

  const styles = useBookmarkStyles();
  const {theme} = useTheme();
  const palette = Colors[theme];

  const dispatch = useDispatch<AppDispatch>();
  const {allItems} = useSelector(
    (state: RootState) => state.bookmark,
  );
  const [playlistItems, setPlaylistItems] = useState(
    allItems || [],
  );
  const isLoading = useSelector((s: RootState) => s.bookmark.isloading);
  const {refreshToken} = useSelector((state: RootState) => state.user);

  const [activeTab, setActiveTab] = useState<'grid' | 'reels'>('grid');
  const [isSelec, setIsSelect] = useState(false);
  const [listSelected, setListSelected] = useState<string[]>([]);

  const selectRef = useRef<Modalize>(null);
  const switchRef = useRef<Modalize>(null);

  const openItem = (item: PlaylistItem) => {
    if (activeTab === 'grid') {
      navigation.navigate(
        'AllPostOfCollection' as never,
        {
          posts: playlistItems,
          targetPostId: item._id,
          playlistName: 'Tất cả bài viết đã lưu',
          clickableHashtag: true,
          clearSearchRedux: true,
        } as never,
      );
    } else {
      navigation.navigate('AllReels', {
        data: playlistItems,
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

  const isAllSelected =
    (listSelected || []).length === (playlistItems || []).length &&
    (playlistItems || []).length > 0;

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

  const EmptyPlaceholder = memo(({message}: {message: string}) => (
    <View style={{alignItems: 'center', paddingVertical: 40}}>
      <Text style={{color: palette.textSecondary}}>{message}</Text>
    </View>
  ));

  const renderTabBar = useCallback(
    () => (
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
              color={
                activeTab === tab.key ? palette.text : palette.textSecondary
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    ),
    [activeTab, setActiveTab],
  );

  const renderItemThumb = useCallback(
    (item: PlaylistItem) => {
      // Handle both itemType and type properties for backward compatibility
      const isVideo = item.itemType === 'reel' || (item as any).type === 'reel';
      if (
        !item.media ||
        !Array.isArray(item.media) ||
        item.media.length === 0
      ) {
        return null;
      }

      const isSelected = (listSelected || []).includes(item._id);
      const url = isVideo
        ? (item.media[0] as Media)?.videoUrl
        : (item.media[0] as MediaR)?.imageUrl;
      const isMP4Video = url && url.endsWith('.mp4');

      return (
        <TouchableOpacity
          style={styles.postItem}
          onPress={() => (isSelec ? toggleSelect(item._id) : openItem(item))}>
          {isMP4Video ? (
            <VideoPlayer
              source={{uri: url}}
              style={styles.postImage}
              resizeMode="cover"
              paused
              muted
            />
          ) : (
            <Image
              source={{uri: url}}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
          {isVideo && (
            <View style={styles.videoIconContainer}>
              <Video size={22} color="#fff" />
            </View>
          )}
          {isSelec && (
            <View style={styles.overlay}>
              {isSelected && <Check size={18} color="#fff" />}
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [listSelected, openItem],
  );

  const GridContent = useCallback(() => {
    const data = playlistItems;
    if (!data || data.length < 1) {
      return <EmptyPlaceholder message="Bạn vẫn chưa lưu bài viết nào." />;
    }
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
  }, [playlistItems, renderItemThumb, styles]);

  const ReelsContent = useCallback(() => {
    const data = (playlistItems || []).filter(i => (i as any).type === 'reel');
    if (!data.length)
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
  }, [playlistItems, renderItemThumb, styles]);

  const renderContent = useCallback(() => {
    if (isLoading) return <EmptyPlaceholder message="Đang tải..." />;
    return activeTab === 'grid' ? <GridContent /> : <ReelsContent />;
  }, [isLoading, activeTab, GridContent, ReelsContent]);

  const removeListBookmark = useCallback(() => {
    dispatch(
      removeBookmark({
        postIds: listSelected,
        refreshToken,
      }),
    )
      .unwrap()
      .then(() => {
        setPlaylistItems(prev =>
          prev.filter(item => !listSelected.includes(item._id)),
        );
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
        {/* left: back or cancel */}
        <View style={[styles.headerSlot, styles.headerSlotLeft]}>
          <TouchableOpacity
            onPress={() => (isSelec ? handleCancel() : navigation.goBack())}>
            {isSelec ? (
              <Text style={styles.textTop}>Hủy bỏ</Text>
            ) : (
              <ArrowLeft size={24} color={palette.text} />
            )}
          </TouchableOpacity>
        </View>

        {/* center: title */}
        <View style={styles.headerSlot}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Tất cả bài viết
          </Text>
        </View>

        {/* right: options */}
        <View style={[styles.headerSlot, styles.headerSlotRight]}>
          <TouchableOpacity onPress={handleRight}>
            {isSelec ? (
              <Text style={styles.textTop}>
                {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Text>
            ) : (
              <MoreVertical size={24} color={palette.text} />
            )}
          </TouchableOpacity>
        </View>
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
        </View>
      )}

      <Portal>
        {/* //////select */}
        <CustomPopupModal
          ref={selectRef}
          title={undefined}
          showCancelButton={true}
          cancelText="Huỷ"
          cancelTextColor="red"
          backgroundColor={palette.background}
          onCancel={() => selectRef.current?.close()}>
          <View style={styles.box}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setIsSelect(true);
                selectRef.current?.close();
              }}>
              <Text style={styles.optionText}>Chọn...</Text>
            </TouchableOpacity>
          </View>
        </CustomPopupModal>
      </Portal>
    </SafeAreaView>
  );
};
