import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../services/store';
import { Colors } from '@assets/color/Colors';
import { useTheme } from '../../../../src/util/ThemeContext';

interface ContactInformationProps {
  isVisible: boolean;
  onClose: () => void;
}

const ContactInformation: React.FC<ContactInformationProps> = ({
  isVisible,
  onClose,
}) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 16,
      paddingLeft: 16,
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

  const user = useSelector((state: RootState) => state.user?.user);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('@assets/icon/x.png')}
              resizeMode="cover"
              style={{
                tintColor: colors.text,
                width: 18,
                height: 18
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Thông tin liên lạc</Text>
          <Text style={styles.description}>
            Quản lý số điện thoại di động và email của bạn để đảm bảo thông tin
            liên lạc của bạn chính xác và cập nhật.
          </Text>

          <View style={styles.section}>
            <View style={styles.menuItem}>
              <Image
                source={require('@assets/icon/mail.png')}
                resizeMode="cover"
                style={[
                  styles.menuIcon
                  , {
                    tintColor: colors.text,
                    width: 18,
                    height: 18
                  }]}
              />
              <View style={{ flex: 0 }}>
                <Text style={styles.menuText}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.menuItem}>
              <Image
                source={require('@assets/icon/phone.png')}
                resizeMode="cover"
                style={[
                  styles.menuIcon
                  , {
                    tintColor: colors.text,
                    width: 18,
                    height: 18
                  }]}
              />
              <Text style={styles.menuText}>{user?.phoneNumber}</Text>

            </View>
          </View>
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

export default ContactInformation;
