import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  Search,
  UserPlus,
  Link,
} from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import { Colors } from '../../../../assets/color/Colors';
import { useTheme } from '../../../util/ThemeContext';
import { Modalize } from 'react-native-modalize';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMyRooms} from '@services/roomRedux/roomSlice';
import {
  fetchFollowers,
  fetchFollowing,
} from '@services/relationRedux/relationSlice';
import ChatRoomAvatar from '../../../../components/ChatRoomAvatar';
import {RootState, AppDispatch} from '../../../../services/store';

export interface CombinedItem {
  kind: 'room' | 'friend';
  _id: string;
  name: string;
  avatars?: string[];
  avatar?: string;
}

export interface ModalShareHandle {
  open: () => void;
  close: () => void;
}

const ModalShare = forwardRef<ModalShareHandle>((_, ref)  => {
  const { theme } = useTheme();
  const color = Colors[theme];
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const userID = useSelector((s: RootState) => s.user.user?._id);
  const modalizeRef = useRef<Modalize>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CombinedItem[]>([]);  

  useImperativeHandle(ref, () => ({
    open: () => {
      loadData();
      modalizeRef.current?.open();
    },
    close: () => {
      modalizeRef.current?.close();
      setSelectedFriendIds([]);
      setMessage('');
    },
  }));

  const loadData = async () => {
    if (!userID) return;
    setLoading(true);
    try {

      // , followers, following
      const [rooms] = await Promise.all([
        dispatch(fetchMyRooms()).unwrap(),
        // dispatch(fetchFollowers({userId: userID})).unwrap(),
        // dispatch(fetchFollowing({userId: userID})).unwrap(),
      ]);
      const roomItems: CombinedItem[] = rooms.map(r => ({
        kind: 'room',
        _id: r._id,
        name: r.name || 'Chat nhóm',
        avatars: r.user_ids.map((u: any) => u.profilePic),
      }));
      // const users = [...followers, ...following];
      // const seen = new Set<string>();
      // const friendItems: CombinedItem[] = users.reduce((acc: CombinedItem[], u) => {
      //   if (!seen.has(u._id)) {
      //     seen.add(u._id);
      //     acc.push({
      //       kind: 'friend',
      //       _id: u._id,
      //       name: u.username,
      //       avatar: u.profilePic,
      //     });
      //   }
      //   return acc;
      // }, []);
      
      //, ...friendItems
      setItems([...roomItems]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectFriend = (id: string) => {
    setSelectedFriendIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id],
    );
  };

  const contentHeight = Dimensions.get('window').height * 0.6;

  const styles = StyleSheet.create({
    modal: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    headerContainer: {
      marginBottom: 12,
    },
    handleBar: {
      alignSelf: 'center',
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: '#666',
      marginBottom: 10,
    },
    description: {
      color: '#ccc',
      fontSize: 13,
      textAlign: 'center',
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2c2c2e',
      borderRadius: 8,
      paddingHorizontal: 10,
      height: 40,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
    },
    friendListContainer: {
      paddingBottom: 16,
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    friendItem: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 64,
      marginBottom: 12,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 4,
    },
    checkmark: {
      position: 'absolute',
      bottom: 10,
      right: 4,
      backgroundColor: 'white',
      borderRadius: 10,
      zIndex: 1
    },
    friendName: {
      color: '#fff',
      fontSize: 12,
      textAlign: 'center',
      paddingHorizontal: 4,
      flexWrap: 'wrap',
    },
    shareActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      rowGap: 12,
      marginTop: 16,
    },
    actionItem: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 72,
      height: 72,
      marginBottom: 8,
    },
    actionLabel: {
      color: color.text,
      fontSize: 11,
      textAlign: 'center',
      marginTop: 4,
    },
    messageInput: {
      backgroundColor: '#2c2c2e',
      borderRadius: 8,
      color: '#fff',
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 16,
      fontSize: 14,
    },
    sendButton: {
      backgroundColor: '#3B82F6',
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 12,
    },
    sendButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
    loader: {
      marginTop: 40,
    },
    listContainer: {
      paddingBottom: 16,
    },
    cell: {
      flex: 1,
      alignItems: 'center',
      marginBottom: 12,
    },
    label: {
      fontSize: 12,
      textAlign: 'center',
      marginTop: 10,
    },
  });
  return (
    <Modalize
      ref={modalizeRef}
      adjustToContentHeight
      handlePosition="inside"
      handleStyle={styles.handleBar}
      modalStyle={[styles.modal, {backgroundColor: color.background}]}
      scrollViewProps={{
          showsVerticalScrollIndicator: false,
          nestedScrollEnabled: true,
      }}
    >
      <View style={{height: contentHeight}}>
        {/* Header */}
        <View style={{marginTop: 10}}>
            <Text style={[styles.description, { color: color.text }]}>
               Liên kết mà bạn chia sẻ là dành riêng cho bạn và có thể được dùng để
              cải thiện gợi ý cũng như quảng cáo bạn nhìn thấy.{' '}
              <Text style={{ color: '#0095f6' }}>Tìm hiểu thêm</Text>
            </Text>
            <View style={[styles.searchBox, { backgroundColor: color.search }]}>
              <Search size={20} color="#aaa" />
              <TextInput
                placeholder="Tìm kiếm"
                style={[styles.searchInput, { backgroundColor: color.backgroundSecondary }]}
                placeholderTextColor={color.textSecondary}
              />
              <UserPlus size={20} color="#aaa" />
            </View>
          </View>


        {/* Content */}
        {loading ? (
          <ActivityIndicator size="large" color={color.text} style={styles.loader} />
        ) : (
          <FlashList
            data={items}
            numColumns={3}
            estimatedItemSize={80}
            extraData={selectedFriendIds}
            contentContainerStyle={styles.listContainer}
            keyExtractor={item => item._id}
            renderItem={({item}) => {
              const isSel = selectedFriendIds.includes(item._id);
              return (
                <View style={styles.cell}>
                  <TouchableOpacity onPress={() => toggleSelectFriend(item._id)}>
                    {item.kind === 'room' ? (
                      <ChatRoomAvatar avatars={item.avatars!} size={60} overlap={50} />
                    ) : (
                      <Image source={{uri: item.avatar!}} style={styles.avatar} />
                    )}
                    {isSel && (
                      <View style={[styles.checkmark]}>
                        <Image
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: color.primary
                          }}
                          source={require('@assets/icon/success.png')}
                        />
                      </View>
                    )}
                    <Text style={[styles.label, {color: color.textSecondary}]}>{item.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}

        {/* Footer */}
        {!loading && (
          selectedFriendIds.length > 0 ? (
            <View>
              <TextInput
                placeholder="Soạn tin nhắn..."
                placeholderTextColor={color.textSecondary}
                style={[styles.messageInput, {backgroundColor: color.backgroundSecondary}]}
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={[styles.sendButton]}>
                <Text style={styles.sendButtonText}>Gửi</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.shareActions}>
              <TouchableOpacity style={styles.actionItem}>
                <Link size={20} color={color.text} />
                <Text style={[styles.actionLabel, {color: color.text}]}>Sao chép liên kết</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </Modalize>
  );
});

export default ModalShare;
