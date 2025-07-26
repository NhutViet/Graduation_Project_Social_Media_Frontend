import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {Eye, EyeOff, ArrowLeft} from 'lucide-react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import LoginStyles from '../../StyleSheet/LoginStyles';
import SwitchAccountStyles from '../../StyleSheet/SwitchAccountStyles';
import {fetchRegister} from '../../../services/userRedux/userSlice';
import {resetStatus} from '../../../services/userRedux/userReducer';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {AppDispatch, RootState} from '../../../services/store';

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
  const {isLoading} = useSelector((state: RootState) => state.user);

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
    } else if (!/^[A-Za-z0-9]{6,}$/.test(password)) {
      setErrorPassword(
        'Mật khẩu bao gồm tối thiểu 6 ký tự và không có ký tự đặc biệt.',
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

    if (!valid) return;

    dispatch(resetStatus());
    const res = await dispatch(fetchRegister({email, password}));

    if (fetchRegister.fulfilled.match(res)) {
      GlobalAlertManager.show(
        'Thành công',
        'Đăng ký tài khoản thành công',
        () => {
          navigation.navigate('SwitchAccount');
        },
      );
    } else {
      const msg = res.payload?.message || 'Đăng ký thất bại.';
      GlobalAlertManager.show('Thất bại', msg);
      dispatch(resetStatus());
    }
  };

  const renderError = (error: string) =>
    error ? <Text style={styles.errorText}>{error}</Text> : null;

  return (
    <SafeAreaView style={styles.page}>
      <LinearGradient
        colors={['#FEB70B', '#C83753', '#A52AA3', '#0064E0', '#0064E0']}
        locations={[0, 0.24, 0.43, 0.65, 1]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.linear}
      />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{margin: 15}}>
        <ArrowLeft size={22} color="#000" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Image
          style={registerStyles.logo}
          source={require('../../../assets/icon/logo.png')}
        />

        <View style={SwitchStyles.body}>
          {/* Email Input */}
          <View style={stylesInput.inputRow}>
            <TextInput
              value={email}
              onChangeText={text => {
                setEmail(text);
                setErrorEmail('');
              }}
              placeholder="Email"
              placeholderTextColor={Colors.light.lightDark}
              style={stylesInput.inputText}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {renderError(errorEmail)}

          {/* Password */}
          <View style={stylesInput.inputRow}>
            <TextInput
              value={password}
              onChangeText={text => {
                setPassword(text);
                setErrorPassword('');
              }}
              placeholder="Mật khẩu"
              placeholderTextColor={Colors.light.lightDark}
              style={stylesInput.inputText}
              secureTextEntry={isPassWord}
            />
            <TouchableOpacity onPress={() => setIsPassWord(p => !p)}>
              {isPassWord ? (
                <EyeOff strokeWidth={1.5} size={20} color={'#000'} />
              ) : (
                <Eye strokeWidth={1.5} size={20} color={'#000'} />
              )}
            </TouchableOpacity>
          </View>
          {renderError(errorPassword)}

          {/* Re-enter Password */}
          <View style={stylesInput.inputRow}>
            <TextInput
              value={rePassword}
              onChangeText={text => {
                setRePassword(text);
                setErrorRePassword('');
              }}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor={Colors.light.lightDark}
              style={stylesInput.inputText}
              secureTextEntry={isRePassWord}
            />
            <TouchableOpacity onPress={() => setIsRePassWord(p => !p)}>
              {isRePassWord ? (
                <EyeOff strokeWidth={1.5} size={20} color={'#000'} />
              ) : (
                <Eye strokeWidth={1.5} size={20} color={'#000'} />
              )}
            </TouchableOpacity>
          </View>
          {renderError(errorRePassword)}

          {/* Register Button */}
          <TouchableOpacity style={styles.buttonLogin} onPress={handleRegister}>
            <Text style={styles.textBtn}>
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Switch to login */}
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

const registerStyles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
  },
});

const stylesInput = StyleSheet.create({
  inputRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    height: 48,
  },
  inputText: {
    width: '90%',
    color: Colors.black,
  },
});
