import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {Plus} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../services/store';
import AccountCenterComponent from '../src/Screens/AccountCenter/components/AccountCenterComponent';

interface SwitchAccountProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
  onAddAccountPress: () => void;
}

export const SwitchAccount: React.FC<SwitchAccountProps> = ({
  visible,
  onClose,
  navigation,
  onAddAccountPress,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const loggedInUsers = useSelector(
    (state: RootState) => state.user.loggedInUsers,
  );

  const renderAccounts = () =>
    loggedInUsers.map(user => (
      <AccountCenterComponent key={user._id} user={user} />
    ));

  const renderAddAccountButton = () => (
    <TouchableOpacity
      style={styles.addAccountButton}
      onPress={onAddAccountPress}>
      <View style={[styles.iconCircle, {backgroundColor: color.lightDark}]}>
        <Plus size={24} color={color.text} />
      </View>
      <Text style={[styles.addAccountText, {color: color.text}]}>
        Thêm tài khoản Cirla
      </Text>
    </TouchableOpacity>
  );

  const renderAccountCenterButton = () => (
    <TouchableOpacity
      style={[styles.accountCenterButton, {borderColor: '#aaa'}]}
      onPress={() => navigation.navigate('AccountCenter')}>
      <Text style={[styles.accountCenterText, {color: color.text}]}>
        Đi đến trung tâm tài khoản
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[styles.modalContent, {backgroundColor: color.background}]}>
          <View style={styles.content}>
            <View style={styles.accountContainer}>
              {renderAccounts()}
              <View style={styles.divider} />
              {renderAddAccountButton()}
            </View>
            {renderAccountCenterButton()}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
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
  accountContainer: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#aaa',
    marginBottom: 14,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#aaa',
    marginHorizontal: 10,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAccountText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  accountCenterButton: {
    borderWidth: 1,
    borderRadius: 20,
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
