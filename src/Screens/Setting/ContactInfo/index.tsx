import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {X, ChevronRight, Mail, Phone} from 'lucide-react-native';

interface ContactInformationProps {
  isVisible: boolean;
  onClose: () => void;
}

const ContactInformation: React.FC<ContactInformationProps> = ({
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
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 14,
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
    menuIcon: {
      marginRight: 16,
    },
    menuText: {
      width: Dimensions.get('window').width / 1.3,
      justifyContent: 'flex-start',
      color: colors.text,
    },
    pendingText: {
      color: '#c65d00',
      fontSize: 12,
      marginTop: 4,
    },
  });

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
          <Text style={styles.title}>Contact information</Text>
          <Text style={styles.description}>
            Quản lý số điện thoại di động và email của bạn để đảm bảo thông tin liên lạc của bạn chính xác và cập nhật.
          </Text>

          <View style={styles.section}>
            <TouchableOpacity style={styles.menuItem}>
              <Mail size={24} color={colors.text} style={styles.menuIcon} />
              <View style={{flex: 0}}>
                <Text style={styles.menuText}>
                  100017152606855-14977793@gmail.com
                </Text>
                <Text style={styles.pendingText}>Đang chờ xác nhận</Text>
              </View>
              <ChevronRight
                size={20}
                color={colors.text}
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Mail size={24} color={colors.text} style={styles.menuIcon} />
              <View>
                <Text style={styles.menuText}>HughCrw@gmail.com</Text>
                <Text style={styles.pendingText}>Đang chờ xác nhận</Text>
              </View>
              <ChevronRight
                size={20}
                color={colors.text}
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Phone size={24} color={colors.text} style={styles.menuIcon} />
              <Text style={styles.menuText}>+911</Text>
              <ChevronRight
                size={20}
                color={colors.text}
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Phone size={24} color={colors.text} style={styles.menuIcon} />
              <Text style={styles.menuText}>+911</Text>
              <ChevronRight
                size={20}
                color={colors.text}
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: '#0095f6',
                borderRadius: 8,
                justifyContent: 'center',
              },
            ]}>
            <Text
              style={[styles.menuText, {color: '#fff', textAlign: 'center'}]}>
              Thêm liên hệ mới
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ContactInformation;
