import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Search,
  UserPlus,
  Link,
} from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import { Colors } from '../../../../assets/color/Colors';
import { useTheme } from '../../../util/ThemeContext';

interface Friend {
  _id: string;
  name: string;
  avatar: string;
}

interface ModalShareProps {
  visible: boolean;
  onClose: () => void;
  friends: Friend[];
}

const ModalShare: React.FC<ModalShareProps> = ({ visible, onClose, friends }) => {
  const { theme } = useTheme();
  const color = Colors[theme];
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const toggleSelectFriend = (id: string) => {
    setSelectedFriendIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id],
    );
  };


  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: '#1c1c1e',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 20,
      maxHeight: '70%',
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
      bottom: 4,
      right: 4,
      backgroundColor: 'white',
      borderRadius: 10,
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
  });
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.modalContainer, { backgroundColor: color.background }]} onPress={() => { }}>
          <View style={styles.handleBar} />

          <Text style={[styles.description, { color: color.text }]}>
            Liên kết mà bạn chia sẻ là dành riêng cho bạn và có thể được dùng để
            cải thiện gợi ý cũng như quảng cáo bạn nhìn thấy.{' '}
            <Text style={{ color: '#0095f6' }}>Tìm hiểu thêm</Text>
          </Text>

          {/* Tìm kiếm */}
          <View style={[styles.searchBox, { backgroundColor: color.search }]}>
            <Search size={20} color="#aaa" />
            <TextInput
              placeholder="Tìm kiếm"
              style={[styles.searchInput, { color: color.text }]}
              placeholderTextColor={color.text}
            />
            <UserPlus size={20} color="#aaa" />
          </View>

          {friends.length > 0 ? (
            <FlashList
              data={friends}
              numColumns={3}
              estimatedItemSize={80}
              showsVerticalScrollIndicator={false}
              extraData={selectedFriendIds}
              keyExtractor={item => item._id}
              contentContainerStyle={{
                paddingBottom: 16,
                backgroundColor: color.background,
              }}
              renderItem={({ item }) => {
                const isSelected = selectedFriendIds.includes(item._id);
                return (
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => toggleSelectFriend(item._id)}
                      style={styles.friendItem}>
                      <View>
                        <Image
                          source={{ uri: item.avatar }}
                          style={styles.avatar}
                        />
                        {isSelected && (
                          <View style={styles.checkmark}>
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
                      </View>
                      <Text style={[styles.friendName, { color: color.textSecondary }]}>{item.name}</Text>
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
                style={[styles.messageInput, { backgroundColor: color.backgroundSecondary }]}
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
                <Image
                  source={require('@assets/icon/link.png')}
                  style={{width: 20, height: 20, tintColor: color.text}}
                />
                <Text style={styles.actionLabel}>Sao chép liên kết</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ModalShare;
