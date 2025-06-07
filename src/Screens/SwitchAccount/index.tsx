import {
  Alert,
  Image,
  Modal,
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

  //redux
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, isError, errorMessage, isSuccess} = useSelector(
    (state: RootState) => state.user,
  );

  const handleLogin = () => {
    if(email === '' || password === ''){
      if(email === '') setErrorEmail('Vui lòng nhập đầy đủ thông tin.');
      if(password === '') setErrorPassword('Vui lòng nhập đầy đủ thông tin.');
    }else if(!email.includes('.') || !email.includes('@')) {
      setErrorEmail('Email không đúng định dạng');
      setErrorPassword('');
    }else{
      setErrorEmail('');
      setErrorPassword('');
      dispatch(fetchLogin({email, password}));
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
      setErrorModal(true)
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

        if (exists) {
          dispatch(resetStatus());
          const loginAction = await dispatch(
            fetchLogin({email, password: tempPassword}),
          );

          if (!fetchLogin.fulfilled.match(loginAction)) {
            Alert.alert(
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
              Alert.alert('Đăng nhập thất bại sau khi đăng ký.');
            }
          } else {
            Alert.alert(registerAction.payload?.message || 'Đăng ký thất bại');
          }
        }
      } else {
        Alert.alert(
          checkEmailAction.payload?.message || 'Kiểm tra email thất bại',
        );
      }
    } catch (error: any) {
      console.log(
        'Google sign-in or backend auth error:',
        error.message || error,
      );
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
      <TouchableOpacity
        style={styles.btnBack}
        onPress={() => navigation.goBack()}>
        <Image
          style={SwitchStyles.iconBack}
          source={require('../../../assets/icon/left.png')}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../../assets/icon/logo.png')}
        />
        <View style={SwitchStyles.body}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={Colors.light.lightDark}
            style={SwitchStyles.input}
          />
          {!(errorEmail === '') && <Text style={styles.errorText}>{errorEmail}</Text>}
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mật khẩu"
            secureTextEntry={true}
            placeholderTextColor={Colors.light.lightDark}
            style={[SwitchStyles.input, {marginTop: 20,}]}
          />
          {!(errorPassword === '') && <Text style={styles.errorText}>{errorPassword}</Text>}
          <TouchableOpacity>
            <Text style={SwitchStyles.textForgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
            <Text style={styles.textBtn}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity>
              <Text style={SwitchStyles.textFb}>
                <Image source={require('../../../assets/icon/fb.png')} /> Đăng
                nhập bằng Facebook
              </Text>
            </TouchableOpacity>
            <Image
              style={{width: '100%'}}
              source={require('../../../assets/icon/seperator_or.png')}
            />
            <TouchableOpacity
              onPress={() => {
                signInWithGoogle();
              }}>
              <Text style={SwitchStyles.textGoogle}>
                <Image source={require('../../../assets/icon/gg.png')} /> Đăng
                nhập bằng Google
              </Text>
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
            <Text
              style={[
                styles.textNoti,
                {color: color.primary},
              ]}>Đăng nhập thành công
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
            <Text
              style={[
                styles.textNoti,
                {color: color.error},
              ]}>Đã có lỗi xảy ra
            </Text>
            {isError && <Text style={styles.textContent}>{errorMessage}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};
