import {
  Image,
  Modal,
  SafeAreaView,
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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../services/store';
import { fetchLogin } from '../../../services/userRedux/userSlice';
import { resetStatus } from '../../../services/userRedux/userReducer';

export const SwitchAccount = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = LoginStyles();
  const SwitchStyles = SwitchAccountStyles(theme);
  const [showModal, setShowModal] = useState(false);

  //redux
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, isError, errorMessage, user, isSuccess} = useSelector((state: RootState) => state.user);

  const handleLogin = () => {
    dispatch(fetchLogin({email, password}));
  };

  useEffect(() => {
    if(isSuccess || isError){
      setShowModal(true);
      const time = setTimeout(() => {
        setShowModal(false);
        dispatch(resetStatus());

        if(isSuccess){
          navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
        }

      }, 2000);
      return () => clearTimeout(time);
    }
  }, [isError, isSuccess]);


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
            placeholder="Mật khẩu"
            secureTextEntry={true}
            placeholderTextColor={Colors.light.lightDark}
            style={SwitchStyles.input}
          />
          <TouchableOpacity>
            <Text style={SwitchStyles.textForgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={handleLogin}>
            <Text style={styles.textBtn}>{isLoading ? "Đang xử lý..." : "Đăng nhập"}</Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity>
              <Text style={SwitchStyles.textFb}>
                <Image source={require('../../../assets/icon/fb.png')} /> Đăng nhập
                bằng Facebook
              </Text>
            </TouchableOpacity>
            <Image
              style={{width: '100%'}}
              source={require('../../../assets/icon/seperator_or.png')}
            />
            <TouchableOpacity>
              <Text style={SwitchStyles.textGoogle}>
                <Image source={require('../../../assets/icon/gg.png')} /> Đăng nhập
                bằng Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textGray}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity>
            <Text style={styles.text}> Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showModal} transparent animationType='fade'>
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            {isSuccess ? <Image source={require('../../../assets/icon/success.png')} style={[styles.iconNoti, {tintColor: color.primary}]}/> : <Image source={require('../../../assets/icon/danger.png')} style={[styles.iconNoti, {tintColor: color.error}]}/>}
            <Text style={[styles.textNoti, {color: isSuccess ? color.primary : color.error}]}>{isSuccess ? 'Đăng nhập thành công' : 'Đã có lỗi xảy ra'}</Text>
            {isSuccess && <Text style={styles.textContent}>Chào mừng bạn đã trở lại</Text>}
            {isError && <Text style={styles.textContent}>{errorMessage}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};
