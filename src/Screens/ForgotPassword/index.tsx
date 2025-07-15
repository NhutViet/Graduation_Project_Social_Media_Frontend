// ForgotPassword/index.tsx
import React, { useState, useEffect } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../util/ThemeContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import ForgotPasswordStyles from '../../StyleSheet/ForgotPasswordStyles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInitForgotPassword } from '../../../services/userRedux/userSlice';
import { resetForgotStatus } from '../../../services/userRedux/userReducer';
import { RootState, AppDispatch } from '../../../services/store';
import { Colors } from '../../../assets/color/Colors';
import LoadingModal from '../../../components/Global/LoadingModal';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';

export const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const {
    isLoadingForgot,
    isErrorForgot,
    forgotMessage,
  } = useSelector((state: RootState) => state.user);

  const { theme } = useTheme();
  const color = Colors[theme];
  const styles = ForgotPasswordStyles(theme);
  const [isPassWord, setIsPassWord] = useState(true);

  useEffect(() => {
    dispatch(resetForgotStatus());
  }, [dispatch]);

  const handleResetPassword = async () => {
    // Clear existing errors
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

    try {
      const result = await dispatch(
        fetchInitForgotPassword({ email, newPassword: password })
      ).unwrap();

      navigation.navigate('ConfirmationCode', {
        email,
        password,
        token: result.token,
      });
    } catch (err: any) {
      // Display API error
      GlobalAlertManager.show('Lỗi!', err.message)
    }
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <View style={styles.page}>
      <LinearGradient
        colors={['#FEB70B', '#C83753', '#A52AA3', '#0064E0', '#0064E0']}
        locations={[0, 0.24, 0.43, 0.65, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.linear}
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft strokeWidth={1.5} size={24} color={color.black} />
          </TouchableOpacity>
          <Image
            style={styles.logo}
            source={require('../../../assets/icon/logo.png')}
          />
          <View style={styles.placeholder} />
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>Đặt lại mật khẩu</Text>
          <Text style={styles.subtitle}>
            Nhập email và mật khẩu mới của bạn
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={Colors.light.lightDark}
            style={[styles.input, { marginBottom: 5 }]}
          />
          {errorEmail !== '' && (
            <Text style={styles.errorText}>{errorEmail}</Text>
          )}

          <View style={[styles.input, styles.passwordContainer]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.passwordInput}
              placeholder="Mật khẩu mới"
              secureTextEntry={isPassWord}
              placeholderTextColor={Colors.light.lightDark}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsPassWord(!isPassWord)}
            >
              {isPassWord ? (
                <EyeOff strokeWidth={1.5} size={20} color={'#000'} />
              ) : (
                <Eye strokeWidth={1.5} size={20} color={'#000'} />
              )}
            </TouchableOpacity>
          </View>

          {errorPassword !== '' && (
            <Text style={styles.errorText}>{errorPassword}</Text>
          )}

          {isErrorForgot && (
            <Text style={styles.errorText}>{forgotMessage}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.buttonLogin,
              { marginVertical: 20 },
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleResetPassword}
            disabled={!isFormValid || isLoadingForgot}
          >
            <Text
              style={[
                styles.textBtn,
                !isFormValid && styles.disabledText,
              ]}
            >
              Xác nhận
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {isLoadingForgot && (
        <View style={styles.loadingOverlay}>
          <LoadingModal withBackdrop={false} />
        </View>
      )}
    </View>
  );
};