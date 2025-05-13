import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {Check, Plus} from 'lucide-react-native';

interface SwitchAccountProps {
  visible: boolean;
  onClose: () => void;
}

export const SwitchAccount: React.FC<SwitchAccountProps> = ({
  visible,
  onClose,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <Pressable
        style={[styles.modalContainer, {backgroundColor: 'rgba(0,0,0,0.25)'}]}
        onPress={onClose}>
        <View
          style={[styles.modalContent, {backgroundColor: color.background}]}>
          <View style={styles.content}>
            {/* Current Account */}
            <View
              style={{
                borderWidth: 1,
                borderRadius: 20,
                padding: 10,
                marginBottom: 14,
                borderColor: '#aaa',
              }}>
              <View style={styles.accountItem}>
                <Image
                  source={{
                    uri: 'https://www.smartsight.in/wp-content/uploads/2019/10/golang-1200x900.png',
                  }}
                  style={styles.avatar}
                />
                <View style={styles.accountInfo}>
                  <Text style={[styles.username, {color: color.text}]}>
                    Mimi11_0
                  </Text>
                </View>
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 15,
                    backgroundColor: '#0095F6',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Check size={20} color="#fff" />
                </View>
              </View>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: '#aaa',
                }}
              />

              {/* Add Account Button */}
              <TouchableOpacity style={styles.addAccountButton}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: color.lightDark,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Plus size={24} color={color.text} />
                </View>
                <Text style={[styles.addAccountText, {color: color.text}]}>
                  Thêm tài khoản Instagram
                </Text>
              </TouchableOpacity>
            </View>
            {/* Account Center Button */}
            <TouchableOpacity
              style={[styles.accountCenterButton, {marginBottom: 16}]}>
              <Text style={[styles.accountCenterText, {color: color.text}]}>
                Đi đến trung tâm tài khoản
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 16,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  accountInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  addAccountText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  accountCenterButton: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#aaa',
    paddingVertical: 12,
    alignItems: 'center',
    padding: 15,
    margin: 4,
  },
  accountCenterText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
