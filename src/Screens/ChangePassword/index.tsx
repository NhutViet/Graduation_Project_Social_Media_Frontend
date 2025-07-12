import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {data as list} from './Data';
import {ChangePasswordStyles} from '../../StyleSheet/ChangePasswordStyles';
import {useTheme} from '../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import EditText from './Components/EditText';
import {Colors} from '../../../assets/color/Colors';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {ArrowLeft, ChevronRight, CheckCircle2} from 'lucide-react-native';

export const ChangePassword = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = ChangePasswordStyles(theme);
  const navigation = useNavigation();
  const modalRef = useRef<Modalize>(null);
  const [selectAccount, setSelectAccount] = useState<{
    id: string;
    name: string;
    handle: string;
    uri: string;
  } | null>(null);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [reNewPass, setReNewPass] = useState('');
  const [isCheck, setIsCheck] = useState(false);

  //check password
  const [isValid, setIsValid] = useState(true);
  const [isEnter, setIsEnter] = useState(true);
  const [isMatch, setIsMatch] = useState(true);

  const isValidPassword = (password: string): boolean => {
    if (password.length < 6) return false;

    let hasLetter = false;
    let hasDigit = false;
    let hasSpecialChar = false;
    const secialChars = '!$@%';

    for (let i = 0; i < password.length; i++) {
      const char = password[i];
      if (/[a-zA-Z]/.test(char)) {
        hasLetter = true;
      } else if (/[0-9]/.test(char)) {
        hasDigit = true;
      } else if (secialChars.includes(char)) {
        hasSpecialChar = true;
      }
    }

    return hasDigit && hasLetter && hasSpecialChar;
  };

  const onOpenModal = () => {
    modalRef.current?.open();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={color.text} style={styles.iconBack} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.textXL}>Đổi mật khẩu</Text>
          <Text style={styles.textL}>Chọn tài khoản để thay đổi.</Text>
        </View>
        <View style={styles.listContainer}>
          {list.map((item, index) => {
            return (
              <TouchableOpacity
                style={[
                  styles.btnContainer,
                  index + 1 == list.length && {borderBottomWidth: 0},
                ]}
                key={item.id}
                onPress={() => {
                  setSelectAccount(item);
                  onOpenModal();
                }}>
                <Image source={{uri: item.uri}} style={styles.userImg} />
                <View style={{flex: 1}}>
                  <Text style={styles.textL}>{item.handle}</Text>
                  <Text style={styles.textM}>{item.name}</Text>
                </View>
                <ChevronRight
                  size={22}
                  color={color.text}
                  style={styles.iconSmall}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        modalStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
        <View>
          <ScrollView
            style={styles.topContainer}
            contentContainerStyle={{flexGrow: 1}}>
            <TouchableOpacity onPress={() => modalRef.current?.close()}>
              <TouchableOpacity onPress={() => modalRef.current?.close()}>
                <ArrowLeft
                  size={22}
                  color={color.text}
                  style={styles.iconBack}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.textContainer}>
              {selectAccount && (
                <Text style={styles.textM}>{selectAccount.handle}</Text>
              )}
              <Text style={styles.textXL}>Đổi mật khẩu</Text>
              <Text style={styles.textL}>
                Mật khẩu phải có ít nhất 6 ký tự và bao gồm chữ, số và ký tự đặc
                biệt (!$@%).
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
                    Mật khẩu phải có ít nhất 6 ký tự và bao gồm chữ, số và ký tự
                    đặc biệt (!$@%).
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
            <View style={styles.row}>
              <TouchableOpacity onPress={() => setIsCheck(!isCheck)}>
                {isCheck ? (
                  <CheckCircle2 size={22} color={color.primary} />
                ) : (
                  <View style={styles.circle} />
                )}
              </TouchableOpacity>
              <Text
                style={[
                  styles.textM,
                  {color: color.text, flex: 1, textAlign: 'justify'},
                ]}>
                Đăng xuất khỏi các thiết bị khác. Chọn mục này nếu có người khác
                đã sử dụng tài khoản của bạn.
              </Text>
            </View>
          </ScrollView>
          <View style={[styles.bottomContainer]}>
            <TouchableOpacity
              style={styles.btnChange}
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

                GlobalAlertManager.show(
                  'Thông báo',
                  'Đổi mật khẩu thành công!',
                );
                modalRef.current?.close();
              }}>
              <Text style={[styles.textL, {color: color.background}]}>
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modalize>
    </SafeAreaView>
  );
};
