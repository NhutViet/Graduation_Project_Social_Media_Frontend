import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Lock, Mail, Eye, EyeOff} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {
  fetchLogin,
  fetchCheckEmail,
  fetchRegister,
} from '../../../services/userRedux/userSlice';
import {resetStatus} from '../../../services/userRedux/userReducer';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {fetchMyRooms} from '@services/roomRedux/roomSlice';
import { useTheme } from '../../../src/util/ThemeContext';
import { Colors } from '@assets/color/Colors';

const {width, height} = Dimensions.get('window');

const GRADIENT_TOP = '#FFFFFF';
const GRADIENT_BOTTOM = '#88C1FB';
const PRIMARY = '#002479';
const INPUT_BG = '#D9EDFF';
const BUTTON_GRADIENT = ['#6C5CE7', '#00B0FF'];

export const SwitchAccount = ({navigation, route}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.user);
  const {email: initialEmail, newPassword: initialPassword} =
    route?.params || {};
  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialPassword) setPassword(initialPassword);
    GoogleSignin.configure({
      webClientId:
        '368528485101-ccrjeejqslg8t7uaokaduposs0c96qne.apps.googleusercontent.com',
    });
  }, [initialEmail, initialPassword]);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleForgot = async () => {
    navigation.navigate('ForgotPassword');
  };

  const handleLogin = async () => {
    setErrorEmail('');
    setErrorPassword('');
    let valid = true;
    if (!email) {
      setErrorEmail('Vui lòng nhập đầy đủ thông tin.');
      valid = false;
    } else if (!email.includes('.') || !email.includes('@')) {
      setErrorEmail('Email không đúng định dạng');
      valid = false;
    }
    if (!password) {
      setErrorPassword('Vui lòng nhập đầy đủ thông tin.');
      valid = false;
    }
    if (!valid) return;

    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      GlobalAlertManager.show(
        'Thông báo',
        'Bạn cần cấp quyền thông báo để sử dụng ứng dụng.',
      );
      return;
    }

    let fcmToken = '';
    try {
      fcmToken = await messaging().getToken();
    } catch (err) {
      console.warn('Lấy FCM token thất bại:', err);
    }

    const resultAction = await dispatch(
      fetchLogin({email, password, fcmToken}),
    );
    if (fetchLogin.fulfilled.match(resultAction)) {
      showAlert('Thành công', 'Đăng nhập thành công');
      navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
      dispatch(fetchMyRooms());
    } else {
      showAlert(
        'Thất bại',
        resultAction.payload?.message ||
          'Đăng nhập thất bại. Vui lòng thử lại.',
      );
    }
  };

  const signInWithGoogle = async () => {
    try {
      dispatch(resetStatus());
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      const email = userInfo.data.user.email;
      const tempPassword = userInfo.data.user.id;
      const profilePic = userInfo.data.user.photo;
      await GoogleSignin.signOut();
      const checkEmailAction = await dispatch(fetchCheckEmail({email}));

      if (fetchCheckEmail.fulfilled.match(checkEmailAction)) {
        const {exists} = checkEmailAction.payload;
        let fcmToken = await messaging().getToken();
        if (exists) {
          const loginAction = await dispatch(
            fetchLogin({email, password: tempPassword, fcmToken}),
          );
          if (fetchLogin.fulfilled.match(loginAction)) {
            showAlert('Thành công', 'Đăng nhập thành công');
            navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
          } else {
            GlobalAlertManager.show(
              'Thông báo',
              'Tài khoản này đã được đăng ký bằng hình thức khác.\nVui lòng dùng phương thức ban đầu.',
            );
          }
        } else {
          const registerAction = await dispatch(
            fetchRegister({email, password: tempPassword, profilePic}),
          );
          if (fetchRegister.fulfilled.match(registerAction)) {
            const loginAction = await dispatch(
              fetchLogin({email, password: tempPassword}),
            );
            if (!fetchLogin.fulfilled.match(loginAction)) {
              showAlert('Thông báo', 'Đăng nhập thất bại');
            }
          } else {
            showAlert(
              'Thông báo',
              registerAction.payload?.message || 'Đăng nhập thất bại',
            );
          }
        }
      } else {
        showAlert(
          'Thông báo',
          checkEmailAction.payload?.message || 'Kiểm tra email thất bại',
        );
      }
    } catch (error: any) {
      showAlert('Lỗi', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        colors={[GRADIENT_TOP, GRADIENT_BOTTOM]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={styles.root}>
        <ImageBackground
          source={require('../../../assets/illustration-background.png')}
          style={styles.topIllustration}
          resizeMode="cover"
        />
        <ScrollView style={styles.container}>
          <Text style={styles.logo}></Text>
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.subtitle}>Đăng nhập với địa chỉ email</Text>
          <View style={styles.form}>
            <View style={[styles.inputRow, {marginTop: 0}]}>
              <Mail size={20} color={PRIMARY} />
              <TextInput
                style={styles.input}
                placeholder="Email@gmail.com"
                placeholderTextColor={PRIMARY}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {errorEmail ? (
              <Text style={{color: 'red', marginBottom: 8}}>{errorEmail}</Text>
            ) : null}
            <View style={styles.inputRow}>
              <Lock size={20} color={PRIMARY} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor={PRIMARY}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                {showPassword ? (
                  <EyeOff size={20} color={PRIMARY} />
                ) : (
                  <Eye size={20} color={PRIMARY} />
                )}
              </TouchableOpacity>
            </View>
            {errorPassword ? (
              <Text style={{color: 'red', marginBottom: 8}}>
                {errorPassword}
              </Text>
            ) : null}
            <TouchableOpacity onPress={handleForgot}>
              <Text
                style={[styles.orText, {textAlign: 'right', marginBottom: 0}]}>
                Quên mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
            <LinearGradient
              colors={BUTTON_GRADIENT}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.button}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.orText}>Hoặc tiếp tục với</Text>
          <TouchableOpacity
            style={styles.socialButton}
            activeOpacity={0.8}
            onPress={signInWithGoogle}>
            <Image
              source={require('../../../assets/icon/gg.png')}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 16,
            }}>
            <Text style={{color: '#666'}}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <Text style={{color: PRIMARY, fontWeight: '600'}}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
  topIllustration: {position: 'absolute', width, height: height * 0.7},
  container: {flex: 1, padding: 24, paddingTop: height * 0.2},
  logo: {fontSize: 30, fontWeight: '800', color: PRIMARY, marginBottom: 16},
  title: {fontSize: 32, fontWeight: '700', color: PRIMARY},
  subtitle: {fontSize: 14, color: PRIMARY, marginBottom: 24, marginTop: 5},
  form: {marginBottom: 32},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginTop: 16,
    marginBottom: 5,
  },
  input: {flex: 1, marginLeft: 8, color: PRIMARY, fontSize: 14},
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {color: '#FFF', fontSize: 16, fontWeight: '600'},
  orText: {textAlign: 'center', color: PRIMARY, marginBottom: 16},
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  socialIcon: {width: 20, height: 20},
  headerTop: {
    position: 'absolute',
    zIndex: 1,
  },
  socialText: {marginLeft: 8, fontSize: 16, color: PRIMARY, fontWeight: '500'},
});