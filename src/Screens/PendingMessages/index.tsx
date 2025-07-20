import React, {useCallback, useRef, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
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
  const nav = useNavigation();
  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [room, setRoom] = useState<Room[]>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useFocusEffect(
    useCallback(() => {
      const fetchRooms = async () => {
        const res = await dispatch(fetchMyWaitingRooms());
        if (res.payload) setRoom(res.payload as Room[]);
      };
      fetchRooms();
    }, [dispatch]),
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <ArrowLeft size={22} color={color.text} />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>{user?.handleName}</Text>
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

      {/* FlashList */}
      <FlashList
        data={room}
        renderItem={({item}) => {
          const filteredUsers = item.user_ids.filter(u => u._id !== user?._id);
          const user1 = filteredUsers[0];
          const user2 = filteredUsers[1];

          const nameChat =
            item.name?.trim().length > 0
              ? item.name
              : user1?.handleName || 'Không xác định';

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
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PendingMessages;
