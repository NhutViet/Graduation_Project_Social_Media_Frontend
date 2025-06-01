import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {data as list} from './Data';
import {FlashList} from '@shopify/flash-list';
import {ChangePasswordStyles} from '../../StyleSheet/ChangePasswordStyles';
import {useTheme} from '../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import EditText from './Components/EditText';
import {Colors} from '../../../assets/color/Colors';

const {height} = Dimensions.get('window');

export const ChangePassword = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = ChangePasswordStyles(theme);
  const navigation = useNavigation();
  const modalRef = useRef<Modalize>(null);
  const [selectAccount, setSelectAccount] = useState<any | null>(null);
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
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.iconBack}
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.textXL}>Change password</Text>
          <Text style={styles.textL}>Choose an account to make changes.</Text>
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
                <Image
                  source={require('../../../assets/icon/right.png')}
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
              <Image
                source={require('../../../assets/icon/left.png')}
                style={styles.iconBack}
              />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              {selectAccount && (
                <Text style={styles.textM}>{selectAccount.handle}</Text>
              )}
              <Text style={styles.textXL}>Change password</Text>
              <Text style={styles.textL}>
                Your password must be at least 6 characters and should include a
                combination of numbers, letters and special characters (!$@%).
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <View>
                <EditText
                  placeholder={'Current password'}
                  password={true}
                  value={currentPass}
                  valueChange={setCurrentPass}
                />
                {!isEnter && (
                  <Text style={styles.error}>
                    Please enter your current password
                  </Text>
                )}
              </View>
              <View>
                <EditText
                  placeholder={'New password'}
                  password={true}
                  value={newPass}
                  valueChange={setNewPass}
                />
                {!isValid && (
                  <Text style={styles.error}>
                    Password must be at least 6 character and include letters,
                    numbers, and special characters (!$@%).
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
                    New password and re-typed password do not match.
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => setIsCheck(!isCheck)}>
                {isCheck ? (
                  <Image
                    source={require('../../../assets/icon/checked.png')}
                    style={styles.tick}
                  />
                ) : (
                  <View style={styles.circle} />
                )}
              </TouchableOpacity>
              <Text
                style={[
                  styles.textM,
                  {color: color.text, flex: 1, textAlign: 'justify'},
                ]}>
                Log out of other devices. Choose this if someone else used your
                account.
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

                Alert.alert('Password changed successfully!');
                modalRef.current?.close();
              }}>
              <Text style={[styles.textL, {color: color.background}]}>
                Change password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modalize>
    </SafeAreaView>
  );
};
