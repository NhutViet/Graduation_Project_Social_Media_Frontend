import React, {useState, useImperativeHandle, useRef, forwardRef} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  Search,
  UserPlus,
  Link,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react-native';
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import ChatRoomAvatar from '../../../../components/ChatRoomAvatar';
import { Modalize } from 'react-native-modalize';

interface CombinedItem {
  kind: 'room' | 'friend';
  data: any;
}

interface ModalShareProps {
  items: CombinedItem[];
}

export interface ModalShareHandle { open: () => void; close: () => void; };

const ModalShare = forwardRef<ModalShareHandle, ModalShareProps>(
  ({items}, ref) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const modalContentHeight = Dimensions.get('window').height * 0.5;
  const modalizeRef = useRef<Modalize>(null);

  useImperativeHandle(ref, () => ({
    open: () => modalizeRef.current?.open(),
    close: () => modalizeRef.current?.close(),
  }));

  const toggleSelectFriend = (id: string) => {
    setSelectedFriendIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id],
    );
  };

    return (
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        handlePosition="inside"
        handleStyle={styles.handleBar}
        modalStyle={[styles.modalContainer, { backgroundColor: color.background }]}
        panGestureEnabled={true}
        onOverlayPress={() => ref && (ref as any).current?.close()}
        HeaderComponent={
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
        }
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          nestedScrollEnabled: true,
        }}
        >
          <View style={{height:modalContentHeight}}>
            {items.length > 0 ? (
              // Danh sách bạn bè
              <FlashList
                data={items}
                numColumns={3}
                estimatedItemSize={80}
                showsVerticalScrollIndicator={false}
                extraData={selectedFriendIds}
                contentContainerStyle={{
                  paddingBottom: 40,
                  backgroundColor: color.background,
                }}
                keyExtractor={(item, idx) =>
                  item.kind === 'room'
                    ? `room-${item.data._id}`
                    : `friend-${item.data._id}`
                }
                renderItem={({ item }) => {
                  const id = item.data._id;
                  const isSelected = selectedFriendIds.includes(id);
                  return(
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => toggleSelectFriend(id)}>
                        {item.kind === 'room' ? (
                          <ChatRoomAvatar
                            avatars={item.data.avatars}
                            size={60}
                            overlap={50}
                          />
                        ) : (
                          <Image
                            source={{ uri: item.data.avatar }}
                            style={styles.avatar}
                          />
                        )}
                        {/* nếu đã chọn, hiển checkmark */}
                        {isSelected && (
                          <View style={styles.checkmark}>
                            <CheckCircle2 size={20} color="#4A90E2" />
                          </View>
                        )}
                        <Text style={[item.kind === "room" ? styles.roomName : styles.friendName, { color: color.text }]}>
                          {item.kind === 'room'
                            ? item.data.name || 'Chat nhóm'
                            : item.data.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            ) : (
              <Text style={{
                height: 200,
                textAlign: 'center',
                fontSize: 18,
                margin: 30,
                color: color.textSecondary,
                fontWeight: '400',
                verticalAlign: 'middle'
              }}>Bạn không có người theo dõi hay đang theo dõi bất kỳ ai</Text>
            )}

            {/* Gửi tin nhắn nếu có người được chọn */}
            {selectedFriendIds.length > 0 ? (
              <>
                <TextInput
                  placeholder="Soạn tin nhắn..."
                  placeholderTextColor="#888"
                  style={[styles.messageInput, {backgroundColor: color.backgroundSecondary}]}
                  value={message}
                  onChangeText={setMessage}
                />
                <TouchableOpacity style={[styles.sendButton]}>
                  <Text style={styles.sendButtonText}>Gửi</Text>
                </TouchableOpacity>
              </>
              ) : (
              <View style={styles.shareActions}>
                <TouchableOpacity style={styles.actionItem}>
                  <MessageCircle size={20} color="white" />
                  <Text style={styles.actionLabel}>Thêm vào tin</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem}>
                  <Link size={20} color="white" />
                  <Text style={styles.actionLabel}>Sao chép liên kết</Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      </Modalize>
    );
  }
);

export default ModalShare;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20
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
    color: '#fff',
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
    bottom: 13,
    right: 4,
    backgroundColor: '#000',
    borderRadius: 10,
    zIndex: 3
  },
  friendName: {
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
    color: '#fff',
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
  roomItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    marginBottom: 12,
  },
  roomName: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
    flexWrap: 'wrap',
    marginTop: 8
  }
});
