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
  TextStyle,
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
  type FontWeight = TextStyle['fontWeight'];
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
      backgroundColor: color.background,
      borderTopLeftRadius: Colors.radius.l,
      borderTopRightRadius: Colors.radius.l,
      paddingHorizontal: Colors.spacing.m,
      paddingTop: Colors.spacing.s,
      paddingBottom: Colors.spacing.l,
      maxHeight: '70%',
    },
    handleBar: {
      alignSelf: 'center',
      width: 40,
      height: 5,
      borderRadius: Colors.radius.xs,
      backgroundColor: color.textSecondary,
      marginBottom: Colors.spacing.s,
    },
    description: {
      color: color.textSecondary,
      fontSize: Colors.typography.fontSizes.s,
      textAlign: 'center',
      paddingHorizontal: Colors.spacing.s,
      marginBottom: Colors.spacing.s,
    },
    learnMoreText: {
      color: Colors.primary,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: color.search,
      borderRadius: Colors.radius.s,
      paddingHorizontal: Colors.spacing.s,
      height: 40,
      marginBottom: Colors.spacing.m,
    },
    searchInput: {
      flex: 1,
      marginLeft: Colors.spacing.s,
      color: color.text,
      fontSize: Colors.typography.fontSizes.m,
    },
    friendListContainer: {
      paddingBottom: Colors.spacing.m,
      paddingHorizontal: Colors.spacing.s,
      alignItems: 'center',
    },
    friendItem: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 64,
      marginBottom: Colors.spacing.m,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: Colors.spacing.xs,
    },
    checkmark: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      backgroundColor: Colors.white,
      borderRadius: 10,
    },
    friendName: {
      color: color.textSecondary,
      fontSize: Colors.typography.fontSizes.s,
      textAlign: 'center',
      paddingHorizontal: Colors.spacing.xs,
      flexWrap: 'wrap',
    },
    shareActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      rowGap: Colors.spacing.m,
      marginTop: Colors.spacing.m,
    },
    actionItem: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 72,
      height: 72,
      marginBottom: Colors.spacing.s,
    },
    actionLabel: {
      color: color.text,
      fontSize: 11,
      textAlign: 'center',
      marginTop: Colors.spacing.xs,
    },
    messageInput: {
      backgroundColor: color.backgroundSecondary,
      borderRadius: Colors.radius.s,
      color: color.text,
      paddingHorizontal: Colors.spacing.m,
      paddingVertical: Colors.spacing.s,
      marginTop: Colors.spacing.m,
      fontSize: Colors.typography.fontSizes.m,
      borderWidth: 1,
      borderColor: color.border,
    },
    sendButton: {
      backgroundColor: Colors.primary,
      paddingVertical: Colors.spacing.m,
      borderRadius: Colors.radius.s,
      marginTop: Colors.spacing.m,
    },
    sendButtonText: {
      color: Colors.white,
      textAlign: 'center',
      fontWeight: Colors.typography.fontWeights.semiBold,
      fontSize: Colors.typography.fontSizes.l,
    }, 
    emptyStateText: {
      height: 200,
      textAlign: 'center',
      fontSize: Colors.typography.fontSizes.xl,
      margin: 30,
      color: color.textSecondary,
      fontWeight: Colors.typography.fontWeights.regular,
      verticalAlign: 'middle',
    },
    actionIcon: {
      width: 20,
      height: 20,
      tintColor: color.text,
    },
    checkmarkIcon: {
      width: 20,
      height: 20,
      tintColor: Colors.primary,
    },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={() => { }}>
          <View style={styles.handleBar} />

          <Text style={styles.description}>
            Liên kết mà bạn chia sẻ là dành riêng cho bạn và có thể được dùng để
            cải thiện gợi ý cũng như quảng cáo bạn nhìn thấy.{' '}
            <Text style={styles.learnMoreText}>Tìm hiểu thêm</Text>
          </Text>

          {/* Tìm kiếm */}
          <View style={styles.searchBox}>
            <Search size={20} color={color.textSecondary} />
            <TextInput
              placeholder="Tìm kiếm"
              style={styles.searchInput}
              placeholderTextColor={color.textSecondary}
            />
            <UserPlus size={20} color={color.textSecondary} />
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
                paddingBottom: Colors.spacing.m,
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
                              style={styles.checkmarkIcon}
                              source={require('@assets/icon/success.png')}
                            />
                          </View>
                        )}
                      </View>
                      <Text style={styles.friendName}>{item.name}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          ) : (
            <Text style={styles.emptyStateText}>
              Bạn không có người theo dõi hay đang theo dõi bất kỳ ai
            </Text>
          )}

          {/* Gửi tin nhắn nếu có người được chọn */}
          {selectedFriendIds.length > 0 ? (
            <>
              <TextInput
                placeholder="Soạn tin nhắn..."
                placeholderTextColor={color.textSecondary}
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Gửi</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.shareActions}>
              <TouchableOpacity style={styles.actionItem}>
                <Image
                  source={require('@assets/icon/link.png')}
                  style={styles.actionIcon}
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