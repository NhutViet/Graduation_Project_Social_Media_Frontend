import React, {useCallback, useState} from 'react';
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
import { ChevronLeft, ChevronDown, Video, SquarePen, Search } from 'lucide-react-native';

export const PendingMessages: React.FC = () => {
  const styles = useProfileEditingStyles();
  const nav = useNavigation();
  const [searchText, setSearchText] = useState('');
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
          <ChevronLeft size={15} color={styles.headerIcon.tintColor} style={{marginLeft: 8}}/>
        </TouchableOpacity>
        <Text style={styles.headerUsername}>{user?.handleName}</Text>
        <TouchableOpacity>
          <ChevronLeft size={12} color={styles.headerSmallIcon.tintColor} style={{marginLeft: 4}}/>
        </TouchableOpacity>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={{marginRight: 16}}>
            <Video size={15} color={styles.headerIcon.tintColor} style={{marginLeft: 8}}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <SquarePen size={15} color={styles.headerIcon.tintColor} style={{marginLeft: 8}}/>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={localStyles.searchContainer}>
        <Search style={{marginRight: 10}}/>
        <TextInput
          style={localStyles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor={styles.tabSelected.backgroundColor}
          value={searchText}
          onChangeText={setSearchText}
        />
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
