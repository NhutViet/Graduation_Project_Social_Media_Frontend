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
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInitForgotPassword } from '../../../services/userRedux/userSlice';
import { resetForgotStatus } from '../../../services/userRedux/userReducer';
import { RootState, AppDispatch } from '../../../services/store';
import { Colors } from '../../../assets/color/Colors';
import LoadingModal from '../../../components/Global/LoadingModal';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';

export const ForgotPassword = ({ navigation }: any) => {
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { isLoadingForgot, isErrorForgot, forgotMessage } = useSelector((state: RootState) => state.user);

  const { theme } = useTheme();
  const color = Colors[theme];

  useEffect(() => {
    dispatch(resetForgotStatus());
  }, [dispatch]);

  const handleSendCode = async () => {
    setErrorEmail('');
    setErrorPhone('');
    let valid = true;

    if (mode === 'email') {
      if (!email) {
        setErrorEmail('Vui lòng nhập email.');
        valid = false;
      } else if (!email.includes('@') || !email.includes('.')) {
        setErrorEmail('Email không đúng định dạng.');
        valid = false;
      }
    } else {
      const vnPhoneRe = /^0\d{8,9}$/;
      if (!phone) {
        setErrorPhone('Vui lòng nhập số điện thoại.');
        valid = false;
      } else if (!vnPhoneRe.test(phone)) {
        setErrorPhone('Số điện thoại không hợp lệ.');
        valid = false;
      }
    }

    if (!valid) return;

    try {
      const args = mode === 'email' ? { email } : { phone };
      const result = await dispatch(fetchInitForgotPassword(args)).unwrap();
      navigation.navigate('ConfirmationCode', {
        identifier: mode === 'email' ? email : phone,
        mode,
        token: result.token,
      });
    } catch (err: any) {
      GlobalAlertManager.show('Lỗi!', err.message);
    }
  };

  const isFormValid = mode === 'email' ? email.trim() !== '' : phone.trim() !== '';

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

          <Text style={{ fontSize: 32, fontWeight: '700', color: color.text, marginTop: 20 }}>Đặt lại mật khẩu</Text>
          <Text style={{ fontSize: 14, color: color.textSecondary, marginBottom: 24, marginTop: 5 }}>
            {mode === 'email' 
              ? 'Nhập email để nhận mã xác nhận đặt lại mật khẩu' 
              : 'Nhập số điện thoại để nhận mã xác nhận đặt lại mật khẩu'
            }
          </Text>

          <View style={{ backgroundColor: color.backgroundSecondary, borderRadius: 8, paddingHorizontal: 12, height: 50, flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <TextInput
              value={mode === 'email' ? email : phone}
              onChangeText={mode === 'email' ? setEmail : setPhone}
              placeholder={mode === 'email' ? 'Email' : 'Số điện thoại'}
              placeholderTextColor={color.textSecondary}
              keyboardType={mode === 'email' ? 'email-address' : 'phone-pad'}
              style={{ flex: 1, color: color.text }}
            />
          </View>
          {errorEmail && <Text style={{ color: color.error, marginBottom: 8 }}>{errorEmail}</Text>}
          {errorPhone && <Text style={{ color: color.error, marginBottom: 8 }}>{errorPhone}</Text>}

          {isErrorForgot && <Text style={{ color: color.error, marginBottom: 8 }}>{forgotMessage}</Text>}

          <TouchableOpacity
            activeOpacity={0.8}
            style={{ height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24, marginBottom: 24, opacity: !isFormValid ? 0.5 : 1 }}
            onPress={handleSendCode}
            disabled={!isFormValid || isLoadingForgot}
          >
            <LinearGradient
              colors={['#005BEA', '#00E5FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: '100%' }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Gửi mã xác nhận</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode(mode === 'email' ? 'phone' : 'email')}>
            <Text style={{ color: color.primary, textAlign: 'center' }}>
              {mode === 'email' ? 'Chuyển sang xác nhận qua số điện thoại' : 'Chuyển sang xác nhận qua email'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isLoadingForgot && (
        <View style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}>
          <LoadingModal withBackdrop={true} />
        </View>
      )}
    </SafeAreaView>
  );
};
