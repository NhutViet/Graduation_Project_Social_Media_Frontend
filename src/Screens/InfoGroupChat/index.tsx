import React, {useEffect, useMemo, useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {
  Bell,
  Search,
  UserPlus,
  PenLine,
  LogOut,
  ArrowLeft,
} from 'lucide-react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Navigation/AppNavigation';
import ModalTheme from '../Message/components/ModalTheme';
import {
  updateRoomName,
  updateRoomTheme,
} from '../../../services/roomRedux/roomSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {ModalRenameRoom} from '../../../components/ModalRenameRoom';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {MenuSection} from './component/menuItem';
import {MediaItem} from '@services/postRedux/postTypes';
import {getAllMediaInRoom} from '../../util/msgImgList';
import MessageSearchModal from '../../../components/MessageSearchModal';
import {fetchMessages} from '../../../services/messageRedux/messageSlice';
import {Message} from '../../../services/messageRedux/messageType';

export const InforGroupChat = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<RouteProp<RootStackParamList, 'InforGroupChat'>>();
  const roomId = route?.params?.roomId;
  const img1 = route?.params?.img1;
  const img2 = route?.params?.img2;
  const [visibleThemeModal, setVisibleThemeModal] = useState(false);
  const [visibleRenameModal, setVisibleRenameModal] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const room = useMemo(
    () => rooms.find(r => r._id === roomId),
    [rooms, roomId],
  );

  // State to manage MessageMedia fetching data
  const [media, setMedia] = useState<MediaItem[]>([]);
  useEffect(() => {
    const fetchInitialMedia = async () => {
      if (!roomId) {
        return;
      }

      try {
        const res = await getAllMediaInRoom({roomId, page: 1});
        if (res && res.media && res.media.length > 0) {
          setMedia(res.media as MediaItem[]);
        } else {
          setMedia([]);
        }
      } catch (error) {
        setMedia([]);
      }
    };

    fetchInitialMedia();
  }, [roomId]);

  // Fetch messages for search functionality
  useEffect(() => {
    if (roomId) {
      dispatch(fetchMessages({roomId}))
        .unwrap()
        .then(fetchedMessages => {
          setMessages(fetchedMessages);
        })
        .catch(error => {
          console.error('Failed to fetch messages:', error);
          setMessages([]);
        });
    }
  }, [roomId, dispatch]);

  const handleSearchPress = useCallback(() => {
    setSearchModalVisible(true);
  }, []);

  const handleMessageSelect = useCallback(
    (messageId: string, index: number) => {
      // Navigate back to the message screen with the selected message
      navigation.navigate('MessageScreen', {
        room: roomId,
        highlightMessageId: messageId,
        scrollToIndex: index,
      });
    },
    [navigation, roomId],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddPeople = useCallback(() => {
    navigation.navigate('AddPeopleToGroupChat', {roomId: roomId});
  }, [navigation]);

  const handleCloseThemeModal = useCallback(() => {
    setVisibleThemeModal(false);
  }, []);

  const handleThemeSelect = useCallback(
    (selectedBackground: string) => {
      dispatch(updateRoomTheme({roomId: roomId, theme: selectedBackground}))
        .unwrap()
        .then(() => {
          GlobalAlertManager.show('Thành công', 'Đã cập nhật chủ đề');
        })
        .catch(() => {
          GlobalAlertManager.show('Thất bại', 'Cập nhật chủ đề thất bại');
        });
      setVisibleThemeModal(false);
    },
    [dispatch, roomId],
  );

  const handleCloseRenameModal = useCallback(() => {
    setVisibleRenameModal(false);
  }, []);

  const handleRenameSubmit = useCallback(
    (newName: string) => {
      dispatch(updateRoomName({roomId: roomId, name: newName}))
        .unwrap()
        .then(() => {
          GlobalAlertManager.show('Thành công', 'Đã đổi tên nhóm');
          setVisibleRenameModal(false);
        })
        .catch(() => {
          GlobalAlertManager.show('Lỗi', 'Không thể đổi tên nhóm');
        });
    },
    [dispatch, roomId],
  );

  const handleOpenRenameModal = useCallback(() => {
    setVisibleRenameModal(true);
  }, []);

  const handleCloseSearchModal = useCallback(() => {
    setSearchModalVisible(false);
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <ArrowLeft size={24} color={color.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarBlock}>
        <TouchableOpacity
          style={[
            styles.imgContainer,
            {overflow: img1 && !img2 ? 'hidden' : undefined},
          ]}>
          {img2 && (
            <>
              <Image style={styles.iconW} source={{uri: img1}} />
              <Image
                style={[
                  styles.iconF,
                  {
                    borderColor: color.background,
                    backgroundColor: color.backgroundSecondary,
                  },
                ]}
                source={{uri: img2}}
              />
            </>
          )}
          {!img2 && img1 && <Image style={styles.img} source={{uri: img1}} />}
        </TouchableOpacity>
        <Text style={[styles.name, {color: color.text}]}>{room?.name}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionItem} onPress={handleAddPeople}>
          <UserPlus size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>Thêm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={handleSearchPress}>
          <Search size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>Tìm kiếm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Bell size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>
            Tắt thông báo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleOpenRenameModal}>
          <PenLine size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>
            Đổi tên nhóm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <LogOut size={20} color={color.text} />
          <Text style={[styles.actionText, {color: color.text}]}>Rời khỏi</Text>
        </TouchableOpacity>
      </View>

      <MenuSection
        media={media}
        color={color}
        navigation={navigation}
        setVisibleThemeModal={setVisibleThemeModal}
        room={roomId}
      />

      <ModalTheme
        visible={visibleThemeModal}
        onClose={handleCloseThemeModal}
        onSelect={handleThemeSelect}
      />
      <ModalRenameRoom
        visible={visibleRenameModal}
        onClose={handleCloseRenameModal}
        currentName={room?.name || ''}
        theme={theme}
        onSubmit={handleRenameSubmit}
      />
      <MessageSearchModal
        visible={searchModalVisible}
        onClose={handleCloseSearchModal}
        messages={messages}
        onMessageSelect={handleMessageSelect}
      />
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  edit: {
    color: '#4A90E2',
    fontSize: 13,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 6,
    fontSize: 12,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuTextBlock: {
    width: '70%',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  imgContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconW: {
    width: '75%',
    height: '75%',
    resizeMode: 'cover',
    borderRadius: 40,
    top: 0,
    left: 0,
    position: 'absolute',
  },
  iconF: {
    width: '85%',
    height: '85%',
    resizeMode: 'cover',
    borderRadius: 40,
    zIndex: 1,
    bottom: 0,
    right: 0,
    borderWidth: 2,
    position: 'absolute',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediaContainer: {
    height: 70,
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaRow: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  mediaItem: {
    width: 60,
    height: 60,
    aspectRatio: 1,
    margin: 1,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  placeholder: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
  },
  placeholderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
