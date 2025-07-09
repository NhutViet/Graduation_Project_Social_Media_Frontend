import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginStyles from '../../StyleSheet/LoginStyles';
import {useState, useEffect} from 'react';
import SwitchAccountStyles from '../../StyleSheet/SwitchAccountStyles';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {fetchRegister, fetchLogin} from '../../../services/userRedux/userSlice';
import {AppDispatch, RootState} from '../../../services/store';
import {resetStatus} from '../../../services/userRedux/userReducer';
import {Eye, EyeOff, ChevronLeft} from 'lucide-react-native';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';
import messaging from '@react-native-firebase/messaging';

export const Register = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isPassWord, setIsPassWord] = useState(true);
  const [isRePassWord, setIsRePassWord] = useState(true);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorRePassword, setErrorRePassword] = useState('');

  const {theme} = useTheme();
  const styles = LoginStyles();
  const SwitchStyles = SwitchAccountStyles(theme);

  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, isSuccess, isError, errorMessage} = useSelector(
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

  const handleRegister = async () => {
    setErrorEmail('');
    setErrorPassword('');
    setErrorRePassword('');

    let valid = true;

    if (!email) {
      setErrorEmail('Vui lòng nhập đầy đủ thông tin.');
      valid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      setErrorEmail('Email không đúng định dạng.');
      valid = false;
    }

    if (!password) {
      setErrorPassword('Vui lòng nhập đầy đủ thông tin.');
      valid = false;
    } else if (!/^\d{6}$/.test(password)) {
      setErrorPassword(
        'Mật khẩu phải gồm đúng 6 chữ số và không có ký tự đặc biệt.',
      );
      valid = false;
    }

    if (!rePassword) {
      setErrorRePassword('Vui lòng nhập đầy đủ thông tin.');
      valid = false;
    } else if (password !== rePassword) {
      setErrorRePassword('Mật khẩu nhập lại không trùng khớp.');
      valid = false;
    }

    if (!valid) {
      return;
    }

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

    dispatch(resetStatus());

    const registerAction = await dispatch(
      fetchRegister({email, password})
    );

    if (fetchRegister.fulfilled.match(registerAction)) {
      const loginAction = await dispatch(
        fetchLogin({email, password, fcmToken})
      );

      if (fetchLogin.fulfilled.match(loginAction)) {
        GlobalAlertManager.show(
          'Thành công',
          'Đăng ký tài khoản thành công',
          () => {
            navigation.reset({ index: 0, routes: [{ name: 'BottomTabs' }] });
          }
        );
      } else {
        GlobalAlertManager.show(
          'Lỗi',
          'Đăng ký thành công nhưng không thể đăng nhập tự động.'
        );
      }
    } else {
      const msg = registerAction.payload?.message || 'Đăng ký thất bại.';
      GlobalAlertManager.show('Thất bại', msg);
      dispatch(resetStatus());
    }
  };

  // useEffect(() => {
  //   if(isSuccess){
  //     GlobalAlertManager.show('Thành công', 'Đăng ký tài khoản thành công', () => {
  //       navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
  //     });
  //   } else {
  //     GlobalAlertManager.show(
  //       'Thất bại',
  //       errorMessage ||
  //         'Đăng ký thất bại. Vui lòng thử lại.',
  //     );
  //   }
  // }, [isError, isSuccess]);

  return (
    <SafeAreaView style={styles.page}>
      <LinearGradient
        colors={['#FEB70B', '#C83753', '#A52AA3', '#0064E0', '#0064E0']}
        locations={[0, 0.24, 0.43, 0.65, 1]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.linear}
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={styles.icon} source={require('@assets/icon/left.png')} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Image
          style={RegisterStyle.logo}
          source={require('../../../assets/icon/logo.png')}
        />
        <View style={SwitchStyles.body}>
          <View
            style={[
              SwitchStyles.input,
              {
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              },
            ]}>
            <TextInput
              value={email}
              onChangeText={text => {
                setEmail(text);
                setErrorEmail('');
              }}
              placeholder="Email"
              placeholderTextColor={Colors.light.lightDark}
              style={{width: '90%', color: Colors.black}}
            />
          </View>
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
                marginBottom: 5,
              },
            ]}>
            <TextInput
              value={password}
              onChangeText={text => {
                setPassword(text);
                setErrorPassword('');
              }}
              style={{width: '90%', color: Colors.black}}
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

          <View
            style={[
              SwitchStyles.input,
              {
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              },
            ]}>
            <TextInput
              value={rePassword}
              onChangeText={text => {
                setRePassword(text);
                setErrorRePassword('');
              }}
              style={{width: '90%', color: Colors.black}}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry={isRePassWord}
              placeholderTextColor={Colors.light.lightDark}
            />
            <TouchableOpacity
              onPress={() =>
                isRePassWord ? setIsRePassWord(false) : setIsRePassWord(true)
              }>
              {isRePassWord ? (
                <EyeOff strokeWidth={1.5} size={20} color={'#000'} />
              ) : (
                <Eye strokeWidth={1.5} size={20} color={'#000'} />
              )}
            </TouchableOpacity>
          </View>
          {!(errorRePassword === '') && (
            <Text style={styles.errorText}>{errorRePassword}</Text>
          )}
          <TouchableOpacity style={styles.buttonLogin} onPress={handleRegister}>
            <Text style={styles.textBtn}>
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>

          <View style={{alignItems: 'center', marginTop: 15}}>
            <TouchableOpacity
              //   onPress={() => {
              //     signInWithGoogle();
              //   }}
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
          <Text style={styles.textGray}>Đã đăng ký tài khoản?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SwitchAccount')}>
            <Text style={styles.text}> Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const RegisterStyle = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
  },
});
