import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {Eye, EyeOff, Mail, Lock} from 'lucide-react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
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

  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.user);
  const {theme} = useTheme();
  const color = Colors[theme];

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
      setErrorPassword('Mật khẩu bao gồm tối thiểu 6 ký tự và không có ký tự đặc biệt.');
      valid = false;
    }else if (password.trim().length > 50){
      setErrorPassword('Mật khẩu vượt quá ký tự cho phép (50 ký tự).')
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
      GlobalAlertManager.show('Thành công', 'Đăng ký tài khoản thành công', () => {
        navigation.navigate('SwitchAccount');
      });
    } else {
      const msg = res.payload?.message || 'Đăng ký thất bại.';
      GlobalAlertManager.show('Thất bại', msg);
      dispatch(resetStatus());
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={[styles.root, {backgroundColor: color.background}]}>
        <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
          <ImageBackground
            source={require('../../../assets/icon/logo_loading.png')}
            style={styles.topIllustration}
            resizeMode="cover"
          />
        </View>

        <ScrollView style={styles.container}>
          <Text style={[styles.title, {color: color.text}]}>Đăng ký</Text>
          <Text style={[styles.subtitle, {color: color.text}]}>Tạo tài khoản bằng email</Text>

          <View style={[styles.inputRow, {backgroundColor: color.backgroundSecondary}]}>
            <Mail size={20} color={color.text} />
            <TextInput
              value={email}
              onChangeText={text => {
                setEmail(text);
                setErrorEmail('');
              }}
              placeholder="Email@gmail.com"
              placeholderTextColor={color.textSecondary}
              style={[styles.input, {color: color.text}]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errorEmail ? <Text style={{color: color.error, marginBottom: 8}}>{errorEmail}</Text> : null}

          <View style={[styles.inputRow, {backgroundColor: color.backgroundSecondary}]}>
            <Lock size={20} color={color.text} />
            <TextInput
              value={password}
              onChangeText={text => {
                setPassword(text);
                setErrorPassword('');
              }}
              placeholder="Mật khẩu"
              placeholderTextColor={color.textSecondary}
              style={[styles.input, {color: color.text}]}
              secureTextEntry={isPassWord}
            />
            <TouchableOpacity onPress={() => setIsPassWord(p => !p)}>
              {isPassWord ? (
                <EyeOff size={20} color={color.text} />
              ) : (
                <Eye size={20} color={color.text} />
              )}
            </TouchableOpacity>
          </View>
          {errorPassword ? <Text style={{color: color.error, marginBottom: 8}}>{errorPassword}</Text> : null}

          <View style={[styles.inputRow, {backgroundColor: color.backgroundSecondary}]}>
            <Lock size={20} color={color.text} />
            <TextInput
              value={rePassword}
              onChangeText={text => {
                setRePassword(text);
                setErrorRePassword('');
              }}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor={color.textSecondary}
              style={[styles.input, {color: color.text}]}
              secureTextEntry={isRePassWord}
            />
            <TouchableOpacity onPress={() => setIsRePassWord(p => !p)}>
              {isRePassWord ? (
                <EyeOff size={20} color={color.text} />
              ) : (
                <Eye size={20} color={color.text} />
              )}
            </TouchableOpacity>
          </View>
          {errorRePassword ? <Text style={{color: color.error, marginBottom: 8}}>{errorRePassword}</Text> : null}

          <TouchableOpacity activeOpacity={0.8} onPress={handleRegister}>
            <LinearGradient
              colors={['#005BEA', '#00E5FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.button}>
              <Text style={styles.buttonText}>{isLoading ? 'Đang xử lý...' : 'Đăng ký'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.textRow}>
            <Text style={{color: color.textSecondary}}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SwitchAccount')}>
              <Text style={{color: color.primary, fontWeight: '600'}}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, justifyContent: 'center'},
  topIllustration: {width: 100, height: 100},
  container: {padding: 24},
  title: {fontSize: 32, fontWeight: '700'},
  subtitle: {fontSize: 14, marginBottom: 24, marginTop: 5},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 1,
    height: 50,
    marginTop: 16,
    marginBottom: 5,
  },
  input: {flex: 1, marginLeft: 8, fontSize: 14},
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  buttonText: {color: '#FFF', fontSize: 16, fontWeight: '600'},
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});
