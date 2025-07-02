import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginStyles from '../../StyleSheet/LoginStyles';
import {useState, useEffect} from 'react';
import SwitchAccountStyles from '../../StyleSheet/SwitchAccountStyles';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {fetchRegister} from '../../../services/userRedux/userSlice';
import {AppDispatch, RootState} from '../../../services/store';
import {resetStatus} from '../../../services/userRedux/userReducer';
import {Eye, EyeOff, ChevronLeft} from 'lucide-react-native';

export const Register = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showModal, setShowModal] = useState(false);
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

    await dispatch(fetchRegister({email, password}));
  };

  useEffect(() => {
    if (isSuccess || isError) {
      setShowModal(true);
      const time = setTimeout(() => {
        setShowModal(false);
        dispatch(resetStatus());

        if (isSuccess) {
          navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
        }
      }, 2000);
      return () => clearTimeout(time);
    }
  }, [isError, isSuccess]);

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
            <Text style={styles.textBtn}>Đăng ký</Text>
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
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <Text style={styles.textNoti}>Thông báo</Text>
            {isSuccess && (
              <Text style={styles.textContent}>
                Đăng ký tài khoản thành công!
              </Text>
            )}
            {isError && <Text style={styles.textContent}>{errorMessage}</Text>}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const RegisterStyle = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
  },
});
