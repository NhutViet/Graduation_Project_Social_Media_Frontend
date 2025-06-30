import {
  Alert,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginStyles from '../../StyleSheet/LoginStyles';
import {useEffect, useState} from 'react';
import SwitchAccountStyles from '../../StyleSheet/SwitchAccountStyles';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {
  fetchCheckEmail,
  fetchLogin,
  fetchRegister,
} from '../../../services/userRedux/userSlice';
import {resetStatus} from '../../../services/userRedux/userReducer';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Eye, EyeOff} from 'lucide-react-native';
import messaging from '@react-native-firebase/messaging';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

export const SwitchAccount = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = LoginStyles();
  const SwitchStyles = SwitchAccountStyles(theme);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [isPassWord, setIsPassWord] = useState(true);
  //redux
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, isError, errorMessage, isSuccess} = useSelector(
    (state: RootState) => state.user,
  );

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS or Android < 13
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      if (email === '') setErrorEmail('Vui lòng nhập đầy đủ thông tin.');
      if (password === '') setErrorPassword('Vui lòng nhập đầy đủ thông tin.');
    } else if (!email.includes('.') || !email.includes('@')) {
      setErrorEmail('Email không đúng định dạng');
      setErrorPassword('');
    } else {
      setErrorEmail('');
      setErrorPassword('');

      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        Alert.alert('Bạn cần cấp quyền thông báo để sử dụng ứng dụng.');
        return;
      }

      const fcmToken = await messaging().getToken();
      dispatch(fetchLogin({email, password, fcmToken}));
    }
  };

  useEffect(() => {
    if (isSuccess && !isLoading) {
      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
        if (isSuccess) {
          navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
        }
        dispatch(resetStatus());
      }, 2000);
    } else if (!isSuccess && isError && !isLoading) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
        dispatch(resetStatus());
      }, 2000);
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '368528485101-ccrjeejqslg8t7uaokaduposs0c96qne.apps.googleusercontent.com',
    });
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
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
        let fcmToken = '';
         try {
          fcmToken = await messaging().getToken();
        } catch (err) {
          console.warn('Lấy FCM token thất bại:', err);
        }
        if (exists) {
          dispatch(resetStatus());
          const fcmToken = await messaging().getToken();
          const loginAction = await dispatch(
            fetchLogin({email, password: tempPassword, fcmToken}),
          );

          if (!fetchLogin.fulfilled.match(loginAction)) {
            GlobalAlertManager.show(
              'Thông báo',
              'Tài khoản này đã được đăng ký bằng hình thức khác.\nVui lòng dùng phương thức ban đầu.',
            );
          }
        } else {
          dispatch(resetStatus());
          const registerAction = await dispatch(
            fetchRegister({
              email,
              password: tempPassword,
              profilePic: profilePic,
            }),
          );

          if (fetchRegister.fulfilled.match(registerAction)) {
            dispatch(resetStatus());
            const loginAction = await dispatch(
              fetchLogin({email, password: tempPassword}),
            );
            if (!fetchLogin.fulfilled.match(loginAction)) {
              GlobalAlertManager.show(
                'Thông báo',
                'Đăng nhập thất bại sau khi đăng ký.',
              );
            }
          } else {
            GlobalAlertManager.show(
              'Thông báo',
              registerAction.payload?.message || 'Đăng ký thất bại',
            );
          }
        }
      } else {
        GlobalAlertManager.show(
          'Thông báo',
          checkEmailAction.payload?.message || 'Kiểm tra email thất bại',
        );
      }
    } catch (error: any) {
      GlobalAlertManager.show('Lỗi', error);
    }
  };

  return (
    <View style={styles.page}>
      <LinearGradient
        colors={['#FEB70B', '#C83753', '#A52AA3', '#0064E0', '#0064E0']}
        locations={[0, 0.24, 0.43, 0.65, 1]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.linear}
      />
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../../assets/icon/logo.png')}
        />
        <View style={[SwitchStyles.body]}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={Colors.light.lightDark}
            style={[SwitchStyles.input, {marginBottom: 5}]}
          />
          {!(errorEmail === '') && (
            <Text style={styles.errorText}>{errorEmail}</Text>
          )}
          <View
            style={[
              SwitchStyles.input,
              {
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5
              },
            ]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={{width: '90%', color: color.black}}
              placeholder="Mật khẩu"
              secureTextEntry={isPassWord}
              placeholderTextColor={Colors.light.lightDark}
            />
            <TouchableOpacity
              onPress={() =>
                isPassWord ? setIsPassWord(false) : setIsPassWord(true)
              }>
              {isPassWord ? (
                <EyeOff strokeWidth={1.5} size={20} color={'#000'} />
              ) : (
                <Eye strokeWidth={1.5} size={20} color={'#000'} />
              )}
            </TouchableOpacity>
          </View>

          {!(errorPassword === '') && (
            <Text style={styles.errorText}>{errorPassword}</Text>
          )}

          <TouchableOpacity style={SwitchStyles.btnForgot}>
            <Text style={SwitchStyles.textForgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
            <Text style={styles.textBtn}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center', marginTop: 15}}>
            <TouchableOpacity
              onPress={() => {
                signInWithGoogle();
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={SwitchStyles.icon}
                source={require('../../../assets/icon/gg.png')}
              />
              <Text style={SwitchStyles.textGoogle}>Đăng nhập bằng Google</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textGray}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
            }}>
            <Text style={styles.text}> Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={successModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../../../assets/icon/success.png')}
              style={[styles.iconNoti, {tintColor: color.primary}]}
            />
            <Text style={[styles.textNoti, {color: color.primary}]}>
              Đăng nhập thành công
            </Text>
            <Text style={styles.textContent}>Chào mừng bạn đã trở lại</Text>
          </View>
        </View>
      </Modal>
      <Modal visible={errorModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../../../assets/icon/danger.png')}
              style={[styles.iconNoti, {tintColor: color.error}]}
            />
            <Text style={[styles.textNoti, {color: color.error}]}>
              Đã có lỗi xảy ra
            </Text>
            {isError && <Text style={styles.textContent}>{errorMessage}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};
