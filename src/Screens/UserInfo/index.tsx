import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useTheme } from '../../util/ThemeContext';
import UserInfoStyles from '../../StyleSheet/UserInfoStyles';
import { Colors } from '../../../assets/color/Colors';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import BottomSheetNotification, {
  SwitchOption,
} from '../../../components/BottomSheetNotification';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { RootStackParamList } from '../../Navigation/AppNavigation';
import ModalTheme from '../Message/components/ModalTheme';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../services/store';
import { updateRoomTheme } from '../../../services/roomRedux/roomSlice';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';
import { getAllMediaInRoom } from '../../util/msgImgList';
import { TabVi } from './components/mediaComponent';
import { MediaItem } from '../../util/msgImgList';
import { MessageSearchModal } from '../../../components/MessageSearchModal';
import { fetchMessages } from '../../../services/messageRedux/messageSlice';
import { Message } from '../../../services/messageRedux/messageType';
import {
  ArrowLeft,
  User,
  Search,
  Bell,
  MoreHorizontal,
  Palette,
  Shield,
  Users,
  ChevronRight,
  Repeat,
  Image as ImageIcon,
  LucideProps,
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width - 8;
const initialLayout = { width: Dimensions.get('window').width };
const createFeatureItems = (navigation: any, openNotifications: () => void, handleSearchPress: () => void) => [
  { icon: User, text: 'Trang tài khoản', onPress: () => { } },
  {
    icon: Search,
    text: 'Tìm kiếm tin nhắn',
    onPress: handleSearchPress,
  },
  { icon: Bell, text: 'Tắt thông báo', onPress: openNotifications },
  { icon: MoreHorizontal, text: 'Thêm tùy chọn', onPress: () => { } },
];
const createSettingItems = (
  navigation: any,
  setVisibleThemeModal: (visible: boolean) => void,
) => [
    { icon: Palette, text: 'Chủ đề', onPress: () => setVisibleThemeModal(true) },
    { icon: Shield, text: 'Quyền riêng tư và an toàn', onPress: () => { } },
    {
      icon: Users,
      text: 'Tạo nhóm trò chuyện',
      onPress: () => navigation.navigate('CreateGroupScreen'),
    },
  ];

export const UserInfo = () => {
  const [index, setIndex] = useState(0);
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'InfoUser'>>();
  const { roomId, img1, nameChat } = route.params || {};
  const dispatch = useDispatch<AppDispatch>();
  const animatedLeftValue = useRef(new Animated.Value(0)).current;
  const [visibleThemeModal, setVisibleThemeModal] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const styles = UserInfoStyles(theme);
  const color = Colors[theme];

  // State to manage MessageMedia fetching data
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaPage, setMediaPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  // Simplified useEffect()
  useEffect(() => {
    const fetchInitialMedia = async () => {
      if (!roomId) {
        return;
      }

      setIsLoading(true);
      try {
        const res = await getAllMediaInRoom({ roomId, page: 1 });
        if (res && res.media && res.media.length > 0) {
          setMedia(res.media);
          setMediaPage(2);
          setHasNextPage(true);
        } else {
          setMedia([]);
          setHasNextPage(false);
        }
      } catch (error) {
        console.error('Failed to fetch media:', error);
        setHasNextPage(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMedia();
  }, [roomId]);

  // Fetch messages for search functionality
  useEffect(() => {
    if (roomId) {
      dispatch(fetchMessages({ roomId }))
        .unwrap()
        .then((fetchedMessages) => {
          setMessages(fetchedMessages);
        })
        .catch((error) => {
          console.error('Failed to fetch messages:', error);
          setMessages([]);
        });
    }
  }, [roomId, dispatch]);

  const handleSearchPress = useCallback(() => {
    setSearchModalVisible(true);
  }, []);

  const handleMessageSelect = useCallback((messageId: string, index: number) => {
    setHighlightedMessageId(messageId);
    navigation.navigate('MessageScreen', {
      room: roomId,
      highlightMessageId: messageId,
      scrollToIndex: index,
    });
  }, [navigation, roomId]);

  const handleHighlightClear = useCallback((messageId: string) => {
    setHighlightedMessageId(null);
  }, []);

  const handleCloseSearchModal = useCallback(() => {
    setSearchModalVisible(false);
  }, []);

  const handleCloseThemeModal = useCallback(() => {
    setVisibleThemeModal(false);
  }, []);

  const handleThemeSelect = useCallback((selectedBackground: string) => {
    dispatch(updateRoomTheme({ roomId, theme: selectedBackground }))
      .unwrap()
      .then(() =>
        GlobalAlertManager.show('Thành công', 'Đã cập nhật chủ đề'),
      )
      .catch(() =>
        GlobalAlertManager.show('Thất bại', 'Cập nhật chủ đề thất bại'),
      );
    setVisibleThemeModal(false);
  }, [dispatch, roomId]);

  const openNotifications = useCallback(() => {
    sheetRef.current?.open();
  }, []);

  const closeNotifications = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage || !roomId) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const res = await getAllMediaInRoom({ roomId, page: mediaPage });
      if (res && res.media && res.media.length > 0) {
        setMedia(prev => [...prev, ...res.media]);
        setMediaPage(prevPage => prevPage + 1);
      } else {
        setHasNextPage(false);
      }
    } catch (error) {
      console.error('Failed to fetch more media:', error);
      setHasNextPage(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasNextPage, roomId, mediaPage]);

  useEffect(() => {
    Animated.timing(animatedLeftValue, {
      toValue: (screenWidth / 2) * index,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedLeftValue, index]);

  const sheetRef = useRef<Modalize>(null);

  const [notificationSettings, setNotificationSettings] = useState({
    msg: false,
    call: false,
    preview: false,
  });

  const handleNotifChange = (
    key: keyof typeof notificationSettings,
    value: boolean,
  ) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const notificationOptions: SwitchOption[] = [
    {
      id: 'msg',
      label: 'Tắt thông báo tin nhắn',
      value: notificationSettings.msg,
      onValueChange: v => handleNotifChange('msg', v),
    },
    {
      id: 'call',
      label: 'Tắt thông báo cuộc gọi',
      value: notificationSettings.call,
      onValueChange: v => handleNotifChange('call', v),
    },
    {
      id: 'preview',
      label: 'Xem trước thông báo',
      description: 'Hiển thị tên và tin nhắn trên thông báo',
      value: notificationSettings.preview,
      onValueChange: v => handleNotifChange('preview', v),
    },
  ];

  const [routes] = useState([
    { key: 'tab1', title: 'Media' },
    { key: 'tab2', title: 'Files' },
  ]);

  const Header = memo(() => {
    const featureItems = createFeatureItems(navigation, openNotifications, handleSearchPress);
    const settingItems = createSettingItems(navigation, setVisibleThemeModal);

    const renderIcon = (
      Icon: React.FC<LucideProps>,
      text: string,
      onPress: () => void,
    ) => (
      <View style={styles.blockFeature} key={text}>
        <TouchableOpacity onPress={onPress}>
          <Icon size={22} color={color.text} />
        </TouchableOpacity>
        <Text style={styles.text}>{text}</Text>
      </View>
    );

    const renderSettingRow = (
      Icon: React.FC<LucideProps>,
      text: string,
      onPress: () => void,
    ) => (
      <TouchableOpacity key={text} style={styles.row} onPress={onPress}>
        <View style={styles.infoRowContainer}>
          <Icon size={22} color={color.text} />
          <Text style={styles.nameUser}>{text}</Text>
        </View>
        <ChevronRight size={22} color={color.text} />
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <View style={styles.blockHeader}>
          <TouchableOpacity style={styles.blockImg}>
            <Image source={{ uri: img1 }} style={styles.imgUser} />
          </TouchableOpacity>
          <Text style={styles.nameUser}>{nameChat}</Text>
        </View>
        <TouchableOpacity
          style={styles.iconBack}
          onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={color.text} />
        </TouchableOpacity>
        <View style={styles.featureContainer}>
          {featureItems.map(item =>
            renderIcon(item.icon, item.text, item.onPress),
          )}
        </View>
        <View style={styles.tab2Container}>
          {settingItems.map(item =>
            renderSettingRow(item.icon, item.text, item.onPress),
          )}
        </View>
      </View>
    );
  });

  const renderMediaTab = useCallback(() => {
    if (!isLoading && media.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ImageIcon size={64} color={color.textSecondary} />
          <Text style={styles.emptyText}>Chưa có tệp nào</Text>
        </View>
      );
    }
    return (
      <TabVi medi={media} isLoading={isLoading} onEndReached={handleLoadMore} />
    );
  }, [media, isLoading, handleLoadMore]);

  const renderScene = SceneMap({
    tab1: renderMediaTab,
    tab2: renderMediaTab,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.background }}>
      <Header />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={() => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: color.background,
              borderColor: color.gray,
              height: 40,
            }}>
            {[Repeat, ImageIcon].map((Icon, i) => (
              <TouchableOpacity
                key={i}
                style={{ flex: 1, alignItems: 'center' }}
                onPress={() => setIndex(i)}>
                <Icon size={22} color={color.text} />
              </TouchableOpacity>
            ))}
            <Animated.View
              style={{
                position: 'absolute',
                bottom: 0,
                left: animatedLeftValue,
                width: '50%',
                height: 2,
                backgroundColor: color.text,
              }}
            />
          </View>
        )}
      />
      <ModalTheme
        visible={visibleThemeModal}
        onClose={handleCloseThemeModal}
        onSelect={handleThemeSelect}
      />
      <Portal>
        <Modalize
          ref={sheetRef}
          modalStyle={{
            backgroundColor: color.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 18,
          }}
          handleStyle={{
            backgroundColor: color.text,
            height: 6,
            width: 40,
            marginBottom: 8,
          }}
          handlePosition="inside"
          panGestureEnabled
          adjustToContentHeight>
          <BottomSheetNotification
            title="Thông báo"
            options={notificationOptions}
            onClose={closeNotifications}
          />
        </Modalize>
      </Portal>
      <MessageSearchModal
        visible={searchModalVisible}
        onClose={handleCloseSearchModal}
        messages={messages}
        onMessageSelect={handleMessageSelect}
        onHighlightClear={handleHighlightClear}
      />
    </SafeAreaView>
  );
};