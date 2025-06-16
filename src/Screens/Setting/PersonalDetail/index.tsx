import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {X, ChevronRight} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';

interface PersonalDetailsProps {
  isVisible: boolean;
  onClose: () => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  isVisible,
  onClose,
}) => {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    closeButton: {
      paddingLeft: 8,
    },
    title: {
      marginBottom: 24,
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginRight: 32,
    },
    content: {
      padding: 16,
    },
    description: {
      color: colors.text,
      fontSize: 14,
      marginBottom: 24,
    },
    section: {
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuText: {
      flex: 1,
      color: colors.text,
    },
    menuValue: {
      color: colors.text,
      opacity: 0.5,
      marginRight: 8,
    },
  });

  const user = useSelector((state: RootState) => state.user?.user);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Thông tin cá nhân</Text>
          <Text style={styles.description}>
            Cirla ​​sử dụng thông tin này để xác minh danh tính của bạn và giữ
            cho cộng đồng của chúng tôi an toàn. Bạn quyết định thông tin cá
            nhân nào bạn có thể hiển thị cho người khác.
          </Text>

          <View style={styles.section}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Tên tài khoản</Text>
              <Text style={styles.menuValue}>{user?.username}</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Thông tin liên hệ</Text>
              <Text style={styles.menuValue}>{user?.email}</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Số điện thoại</Text>
              <Text style={styles.menuValue}>{user?.phoneNumber}</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Giới tính</Text>
              <Text style={styles.menuValue}>{user?.gender}</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Ngày sinh</Text>
              <Text style={styles.menuValue}>{user?.dateOfBirth}</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Địa chỉ</Text>
              <Text style={styles.menuValue}>{user?.address}</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Xác nhận danh tính</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PersonalDetails;
