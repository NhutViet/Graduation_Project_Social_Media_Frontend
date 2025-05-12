import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View, Image} from 'react-native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {Check} from 'lucide-react-native';

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
                borderColor: color.text,
              }}>
              <View style={styles.accountItem}>
                <Image
                  source={{
                    uri: 'https://www.smartsight.in/wp-content/uploads/2019/10/golang-1200x900.png', // Thay thế bằng URL avatar thực
                  }}
                  style={styles.avatar}
                />
                <View style={styles.accountInfo}>
                  <Text style={[styles.username, {color: color.text}]}>
                    Mimi11_0
                  </Text>
                </View>
                <Check size={20} color="#0095F6" />
              </View>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: color.text,
                }}
              />

              {/* Add Account Button */}
              <Pressable
                style={({pressed}) => [
                  styles.addAccountButton,
                  {opacity: pressed ? 0.8 : 1},
                ]}>
                <View style={styles.addIcon}>
                  <Text style={[styles.plusIcon, {color: color.text}]}>+</Text>
                </View>
                <Text style={[styles.addAccountText, {color: color.text}]}>
                  Thêm tài khoản Instagram
                </Text>
              </Pressable>
            </View>
            {/* Account Center Button */}
            <Pressable
              style={({pressed}) => [
                styles.accountCenterButton,
                {opacity: pressed ? 0.8 : 1},
              ]}>
              <Text style={[styles.accountCenterText, {color: color.text}]}>
                Đi đến trung tâm tài khoản
              </Text>
            </Pressable>
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
    paddingVertical: 12,
    padding: 5,
    margin: 8,
  },
  accountCenterText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
