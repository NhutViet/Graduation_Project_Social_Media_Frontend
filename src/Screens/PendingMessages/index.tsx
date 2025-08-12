import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useProfileEditingStyles} from '../EditProfile/components/ProfileEditingStyles';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import ItemNewMessage from '../NewMessage/component/itemNewMessage';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {fetchMyWaitingRooms} from '@services/roomRedux/roomSlice';
import {Room} from '@services/roomRedux/roomType';
import MessageBoxStyles from '../../../src/StyleSheet/MessageBoxStyles';
import {useTheme} from '../../../src/util/ThemeContext';
import {Colors} from '@assets/color/Colors';
import {ArrowLeft, Search, X} from 'lucide-react-native';

export const PendingMessages: React.FC = () => {
  const styles = useProfileEditingStyles();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles2 = MessageBoxStyles(theme);
  const nav = useNavigation<any>();
  const searchInputRef = useRef<TextInput>(null);

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  // local state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // 1) Memo hoá fetch và dùng guard isActive để tránh setState sau khi blur
  const fetchRooms = useCallback(
    async (isActiveRef?: {current: boolean}) => {
      const res = await dispatch(fetchMyWaitingRooms());
      if (isActiveRef ? isActiveRef.current : true) {
        if (res.payload) setRooms(res.payload as Room[]);
        else setRooms([]);
      }
    },
    [dispatch],
  );

  // 2) Gọi mỗi lần focus
  useFocusEffect(
    useCallback(() => {
      const isActive = {current: true};
      fetchRooms(isActive);
      return () => {
        isActive.current = false;
      };
    }, [fetchRooms]),
  );

  // 3) Pull-to-refresh tái dùng fetchRooms
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  }, [fetchRooms]);

  // 4) Lọc theo search
  const filteredRooms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter(room => {
      const others = room.user_ids.filter(u => u._id !== user?._id);
      const user1 = others[0];
      const nameChat = room.name?.trim().length
        ? room.name
        : user1?.username || '';
      return nameChat.toLowerCase().includes(q);
    });
  }, [rooms, searchQuery, user?._id]);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <ArrowLeft size={22} color={color.text} />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>{user?.username}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles2.searchBlock}>
          <Search size={22} color={color.text} />
          <TextInput
            ref={searchInputRef}
            placeholder="Tìm kiếm đoạn hội thoại"
            placeholderTextColor={color.text}
            style={[
              styles2.searchInput,
              {paddingRight: searchQuery.length > 0 ? 40 : 0},
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles2.clearButton}
              onPress={() => setSearchQuery('')}>
              <X size={20} color={color.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <FlashList
        data={filteredRooms}
        keyExtractor={item => item._id}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item}) => {
          const others = item.user_ids.filter(u => u._id !== user?._id);
          const user1 = others[0];
          const user2 = others[1];
          const nameChat =
            item.name?.trim().length > 0
              ? item.name
              : user1?.username || 'Không xác định';

          return (
            <ItemNewMessage
              roomId={item._id}
              nameChat={nameChat}
              latestMessage={item.latestMessage}
              img1={user1?.profilePic || ''}
              img2={user2?.profilePic || ''}
              type={item.type}
            />
          );
        }}
        ListEmptyComponent={() => (
          <View style={{flex: 1, alignItems: 'center', paddingVertical: 50}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                width: '50%',
                textAlign: 'center',
              }}>
              Bạn hiện không có hộp thoại tin nhắn chờ nào.
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default PendingMessages;
