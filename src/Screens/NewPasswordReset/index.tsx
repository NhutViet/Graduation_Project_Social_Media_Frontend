import React, { useState, useEffect } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../util/ThemeContext';
import { Eye, EyeOff } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditUser } from '../../../services/userRedux/userSlice';
import { resetStatus, resetForgotStatus, resetConfirmStatus } from '../../../services/userRedux/userReducer';
import { RootState, AppDispatch } from '../../../services/store';
import { Colors } from '../../../assets/color/Colors';
import LoadingModal from '../../../components/Global/LoadingModal';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';

export const NewPasswordReset = ({ navigation, route }: any) => {
  const { identifier, mode, refreshToken } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isSuccess, isError, errorMessage } = useSelector((state: RootState) => state.user);

  const { theme } = useTheme();
  const color = Colors[theme];
  const [isPassWord, setIsPassWord] = useState(true);
  const [isConfirmPassWord, setIsConfirmPassWord] = useState(true);

  useEffect(() => {
    dispatch(resetStatus(), resetConfirmStatus(), resetForgotStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      GlobalAlertManager.show('Thành công', 'Mật khẩu đã được đặt lại thành công.', () => {
        navigation.navigate('SwitchAccount');
      });
    }
  }, [isSuccess, navigation, identifier, mode, password]);

  const handleResetPassword = async () => {
    setErrorPassword('');
    setErrorConfirmPassword('');
    let valid = true;

    if (!password) {
      setErrorPassword('Vui lòng nhập mật khẩu mới.');
      valid = false;
    } else if (password.length < 6) {
      setErrorPassword('Mật khẩu phải có ít nhất 6 ký tự.');
      valid = false;
    }

    if (!confirmPassword) {
      setErrorConfirmPassword('Vui lòng xác nhận mật khẩu.');
      valid = false;
    } else if (password !== confirmPassword) {
      setErrorConfirmPassword('Mật khẩu xác nhận không khớp.');
      valid = false;
    }

    if (!valid) return;
    console.log('[NewPasswordReset] submitting new password:', password);

    try {
      const result = await dispatch(fetchEditUser({ password })).unwrap();
      console.log('[NewPasswordReset] fetchEditUser result:', result);
    } catch (err: any) {
      console.log('[NewPasswordReset] fetchEditUser error:', err);
      GlobalAlertManager.show('Lỗi!', err.message || errorMessage);
    }
  };

  const isFormValid = password.trim() !== '' && confirmPassword.trim() !== '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.background }}>
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
          <Image
            style={{ width: 100, height: 100 }}
            source={require('../../../assets/icon/logo_loading.png')}
            resizeMode="cover"
          />
        </View>

        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <Text style={{ fontSize: 32, fontWeight: '700', color: color.text, marginTop: 20 }}>
            Đặt mật khẩu mới
          </Text>
          <Text style={{ fontSize: 14, color: color.textSecondary, marginBottom: 24, marginTop: 5 }}>
            Nhập mật khẩu mới cho tài khoản {mode === 'email' ? 'email' : 'số điện thoại'} của bạn
          </Text>

          <View style={{ backgroundColor: color.backgroundSecondary, borderRadius: 8, paddingHorizontal: 12, height: 50, flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={{ flex: 1, color: color.text }}
              placeholder="Mật khẩu mới"
              secureTextEntry={isPassWord}
              placeholderTextColor={color.textSecondary}
            />
            <TouchableOpacity onPress={() => setIsPassWord(!isPassWord)}>
              {isPassWord ? (
                <EyeOff strokeWidth={1.5} size={20} color={color.text} />
              ) : (
                <Eye strokeWidth={1.5} size={20} color={color.text} />
              )}
            </TouchableOpacity>
          </View>
          {errorPassword && <Text style={{ color: color.error, marginBottom: 8 }}>{errorPassword}</Text>}

          <View style={{ backgroundColor: color.backgroundSecondary, borderRadius: 8, paddingHorizontal: 12, height: 50, flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={{ flex: 1, color: color.text }}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry={isConfirmPassWord}
              placeholderTextColor={color.textSecondary}
            />
            <TouchableOpacity onPress={() => setIsConfirmPassWord(!isConfirmPassWord)}>
              {isConfirmPassWord ? (
                <EyeOff strokeWidth={1.5} size={20} color={color.text} />
              ) : (
                <Eye strokeWidth={1.5} size={20} color={color.text} />
              )}
            </TouchableOpacity>
          </View>
          {errorConfirmPassword && <Text style={{ color: color.error, marginBottom: 8 }}>{errorConfirmPassword}</Text>}

          {isError && <Text style={{ color: color.error, marginBottom: 8 }}>{errorMessage}</Text>}

          <TouchableOpacity
            activeOpacity={0.8}
            style={{ 
              height: 48, 
              borderRadius: 8, 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginTop: 24, 
              marginBottom: 24, 
              opacity: !isFormValid ? 0.5 : 1 
            }}
            onPress={handleResetPassword}
            disabled={!isFormValid || isLoading}
          >
            <LinearGradient
              colors={['#005BEA', '#00E5FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: '100%' }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Đặt lại mật khẩu</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isLoading && (
        <View style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <LoadingModal withBackdrop={true} />
        </View>
        )}
    </SafeAreaView>
  );
};