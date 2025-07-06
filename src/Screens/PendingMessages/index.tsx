import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
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
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>{user?.handleName}</Text>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity>
            <Image
              source={require('../../../assets/icon/new_mess.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles2.searchBlock}>
          <View style={styles2.iconBlock}>
            <Image
              style={styles2.icon}
              source={require('../../../assets/icon/search.png')}
            />
          </View>
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
              <Image
                style={styles2.clearIcon}
                source={require('../../../assets/icon/closer.png')}
              />
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

const localStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});

export default PendingMessages;
