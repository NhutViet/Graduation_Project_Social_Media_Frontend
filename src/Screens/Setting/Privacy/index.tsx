import {
  Image,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';
import { createStyles } from '../../../StyleSheet/Setting.Styles';
import { ChevronLeft } from 'lucide-react-native';
import { Modalize } from 'react-native-modalize';
import EditText from '../../../Screens/ChangePassword/Components/EditText';
import { ChangePasswordStyles } from '../../../StyleSheet/ChangePasswordStyles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@services/store';
import { changePassword } from '@services/userRedux/userSlice';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

export const Privacy = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const mColor = Colors[theme] || Colors;
  const styles = {
    ...createStyles(theme),
    ...ChangePasswordStyles(theme),
  };
  const modalRef = useRef<Modalize>(null);

  const [isPrivate, setIsPrivate] = useState(false);

  const handlePrivacyToogle = async () => {
    try {
      setIsPrivate(!isPrivate);
      GlobalAlertManager.show(
        'Thành công',
        `Chuyển sang chế độ ${!isPrivate ? 'riêng tư' : 'công khai'}`,
      );
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.user);

  const handleChangPassword = async (recentPassword: string, newPassword: string) => {
  try {
    await dispatch(changePassword({ recentPassword, newPassword })).unwrap();
    GlobalAlertManager.show('Thành công', 'Đổi mật khẩu thành công!');
  } catch (err: any) {
    GlobalAlertManager.show('Lỗi', err || 'Đổi mật khẩu thất bại');
  }
};

  // All these things below is for checking and changing password
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [reNewPass, setReNewPass] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isEnter, setIsEnter] = useState(true);
  const [isMatch, setIsMatch] = useState(true);
  const onOpenModal = () => {
    modalRef.current?.open();
  };

  return (
    <SafeAreaView style={[styles.container, {
      paddingHorizontal: 0,
      paddingVertical: 0,
    }]}>
      <View style={styles.head}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ChevronLeft size={30} color={mColor.text} />
        </TouchableOpacity>
        <Text style={styles.headTitle}>Quyền riêng tư của tài khoản</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.content}>
        <View
          style={[
            styles.privacyContainer,
            { backgroundColor: mColor.background },
          ]}>
          <View style={styles.privacyHeader}>
            <Text style={[styles.privacyTitle, { color: mColor.text }]}>
              Tài khoản riêng tư
            </Text>
            <Switch
              value={isPrivate}
              onValueChange={handlePrivacyToogle}
              trackColor={{
                false: mColor.border,
                true: mColor.blue,
              }}
              thumbColor={mColor.white}
            />
          </View>
          <Text style={styles.privacyDescription}>
            Khi tài khoản của bạn ở chế độ riêng tư, chỉ những người bạn chấp
            thuận mới có thể xem ảnh và video của bạn. Những người theo dõi hiện
            tại của bạn sẽ không bị ảnh hưởng.{' '}
            <TouchableOpacity onPress={() => console.log('VIEW MORE')}>
              <Text style={styles.learnMore}>Tìm hiều thêm</Text>
            </TouchableOpacity>
          </Text>
        </View>
        <View
          style={[
            styles.privacyContainer,
            { backgroundColor: mColor.background },
          ]}>
          <TouchableOpacity
            style={[styles.privacyHeader, {
              justifyContent: 'flex-end',
            }]}
            hitSlop={5}
            onPress={onOpenModal}
          >
            <Text style={[styles.privacyTitle, { color: Colors.blue }]}>
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        modalStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
          <ScrollView
            style={styles.topContainer}
            contentContainerStyle={{ flexGrow: 1 }}>
            <TouchableOpacity onPress={() => modalRef.current?.close()}>
              <Image
                source={require('../../../../assets/icon/left.png')}
                style={styles.iconBack}
              />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              {currentUser && (
                <Text style={styles.textM}>{currentUser.handleName}</Text>
              )}
              <Text style={styles.textXL}>Đổi mật khẩu</Text>
              <Text style={styles.textL}>
                Mật khẩu phải có ít nhất 6 ký tự và bao gồm chữ, số và ký tự đặc biệt (!$@%).
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <View>
                <EditText
                  placeholder={'Mật khẩu hiện tại'}
                  password={true}
                  value={currentPass}
                  valueChange={setCurrentPass}
                />
                {!isEnter && (
                  <Text style={styles.error}>
                    Vui lòng nhập mật khẩu hiện tại
                  </Text>
                )}
              </View>
              <View>
                <EditText
                  placeholder={'Mật khẩu mới'}
                  password={true}
                  value={newPass}
                  valueChange={setNewPass}
                />
                {!isValid && (
                  <Text style={styles.error}>
                    Mật khẩu phải có ít nhất 6 ký tự và bao gồm chữ, số và ký tự đặc biệt (!$@%).
                  </Text>
                )}
              </View>
              <View>
                <EditText
                  placeholder={'Re-type new password'}
                  password={true}
                  value={reNewPass}
                  valueChange={setReNewPass}
                />
                {!isMatch && (
                  <Text style={styles.error}>
                    Mật khẩu mới và mật khẩu nhập lại không khớp.
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
          <View style={[styles.bottomContainer]}>
            <TouchableOpacity
              style={[
                styles.btnChange,
                {
                  opacity: currentPass && newPass && reNewPass ? 1 : 0.5,
                },
              ]}
              disabled={!currentPass || !newPass || !reNewPass}
              onPress={() => {
                if (!currentPass) {
                  setIsEnter(false);
                  return;
                } else {
                  setIsEnter(true);
                }

                if (!isValidPassword(newPass)) {
                  setIsValid(false);
                  return;
                } else {
                  setIsValid(true);
                }

                if (newPass !== reNewPass) {
                  setIsMatch(false);
                  return;
                } else {
                  setIsMatch(true);
                }
                handleChangPassword(currentPass, newPass)
                  .finally(() => modalRef.current?.close());
              }}>
              <Text style={[styles.textL, { color: mColor.background }]}>
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
      </Modalize>
    </SafeAreaView>
  );
};

const isValidPassword = (password: string): boolean => {
  if (password.length < 3) {
    return false;
  }

  const specialChars = '!@#$%^&*()_+-=[]{}|;:",.<>?/~`';
  const passwordChars = password.split('');

  const hasLetter = passwordChars.some(char => /[a-zA-Z]/.test(char));
  const hasDigit = passwordChars.some(char => /[0-9]/.test(char));
  const hasSpecialChar = passwordChars.some(char => specialChars.includes(char));

  return hasDigit && hasLetter && hasSpecialChar;
};
