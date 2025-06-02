import {
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
} from '../../../services/userRedux/userSlice';
import {resetStatus} from '../../../services/userRedux/userReducer';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const SwitchAccount = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {theme} = useTheme();
  const styles = LoginStyles();
  const SwitchStyles = SwitchAccountStyles(theme);
  const [showModal, setShowModal] = useState(false);

  //redux
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, isError, errorMessage, user, isSuccess} = useSelector(
    (state: RootState) => state.user,
  );

  const handleLogin = () => {
    dispatch(fetchLogin({email, password}));
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

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '368528485101-ccrjeejqslg8t7uaokaduposs0c96qne.apps.googleusercontent.com',
    });
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      console.log('userInfo:', JSON.stringify(userInfo, null, 2));

      const idToken = userInfo.idToken || userInfo.data?.idToken;
      const email = userInfo.data.user.email;
      if (!idToken || !email) {
        console.log('❌ idToken or email is undefined');
        return;
      }

      const tempPassword = userInfo.data.user.id;
      const checkEmailAction = await dispatch(fetchCheckEmail({email}));

      // if (fetchCheckEmail.fulfilled.match(checkEmailAction)) {
      //   const {exists} = checkEmailAction.payload;

      //   if (exists) {
      //     await dispatch(fetchLogin({email, password: tempPassword}));
      //   } else {
          // const registerAction = await dispatch(
          //   fetchRegister({email, password: tempPassword}),
          // );
          // if (fetchRegister.fulfilled.match(registerAction)) {
          //   await dispatch(fetchLogin({email, password: tempPassword}));
          // } else {
          //   alert(registerAction.payload?.message || 'Register failed');
          //   return;
          // }
        // }
      // } else {
      //   console.log(checkEmailAction.payload?.message || 'Check email failed');
      //   return;
      // }

      // navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
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
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor={Colors.light.lightDark}
            style={SwitchStyles.input}
          />
          <TouchableOpacity>
            <Text style={SwitchStyles.textForgot}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
            <Text style={styles.textBtn}>
              {isLoading ? 'Is loging...' : 'Login'}
            </Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity>
              <Text style={SwitchStyles.textFb}>
                <Image source={require('../../../assets/icon/fb.png')} /> Log in
                with Facebook
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
                <Image source={require('../../../assets/icon/gg.png')} /> Log in
                with Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textGray}>Don't have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.text}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <Text style={styles.textNoti}>Notification</Text>
            {isSuccess && (
              <Text style={styles.textContent}>Login Successfully!!</Text>
            )}
            {isError && <Text style={styles.textContent}>{errorMessage}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};
