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
import { useDispatch, useSelector } from 'react-redux';
import { fetchCheckEmailForgotPassword, fetchSendCodeForgotPassword } from '../../../services/userRedux/userSlice';
import { resetCheckEmailStatus, resetSendCodeStatus } from '../../../services/userRedux/userReducer';
import { RootState, AppDispatch } from '../../../services/store';
import { Colors } from '../../../assets/color/Colors';
import LoadingModal from '../../../components/Global/LoadingModal';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';

export const CheckEmail = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { 
    isLoadingCheckEmail, 
    isErrorCheckEmail, 
    checkEmailMessage,
    hasPhoneNumber,
    isLoadingSendCode,
    isErrorSendCode,
    sendCodeMessage,
    forgotPasswordToken
  } = useSelector((state: RootState) => state.user);

  const { theme } = useTheme();
  const color = Colors[theme];

  useEffect(() => {
    // Reset all states when component mounts
    dispatch(resetCheckEmailStatus());
    dispatch(resetSendCodeStatus());
  }, [dispatch]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheckEmail = async () => {
    setErrorEmail('');
    
    if (!email.trim()) {
      setErrorEmail('Vui lòng nhập email.');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorEmail('Email không đúng định dạng.');
      return;
    }

    try {
      const result = await dispatch(fetchCheckEmailForgotPassword({ email })).unwrap();
      
      // if user has phone number, automatically send code and go to verification
      if (result.hasPhoneNumber) {
        try {
          const sendCodeResult = await dispatch(fetchSendCodeForgotPassword({ email })).unwrap();
          
          navigation.navigate('ConfirmationCode', {
            email,
            token: sendCodeResult.token,
            hasPhoneNumber: true,
          });
        } catch (sendCodeError: any) {
          GlobalAlertManager.show('Lỗi!', sendCodeError.message);
        }
      } else {
        // otherwise user needs to provide phone number, navigate to phone input screen
        navigation.navigate('ForgotPassword', {
          email,
          hasPhoneNumber: false,
        });
      }
    } catch (error: any) {
      GlobalAlertManager.show('Lỗi!', error.message);
    }
  };

  const isFormValid = email.trim() !== '' && validateEmail(email);
  const isLoading = isLoadingCheckEmail || isLoadingSendCode;

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
          <Text style={{ 
            fontSize: 32, 
            fontWeight: '700', 
            color: color.text, 
            marginTop: 20 
          }}>
            Đặt lại mật khẩu
          </Text>
          
          <Text style={{ 
            fontSize: 14, 
            color: color.textSecondary, 
            marginBottom: 24, 
            marginTop: 5 
          }}>
            Nhập email đã đăng ký để bắt đầu quá trình đặt lại mật khẩu
          </Text>

          <View style={{ 
            backgroundColor: color.backgroundSecondary, 
            borderRadius: 8, 
            paddingHorizontal: 12, 
            height: 50, 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: 15 
          }}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={color.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ flex: 1, color: color.text }}
            />
          </View>
          
          {errorEmail && (
            <Text style={{ color: color.error, marginBottom: 8 }}>
              {errorEmail}
            </Text>
          )}

          {isErrorCheckEmail && (
            <Text style={{ color: color.error, marginBottom: 8 }}>
              {checkEmailMessage}
            </Text>
          )}

          {isErrorSendCode && (
            <Text style={{ color: color.error, marginBottom: 8 }}>
              {sendCodeMessage}
            </Text>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            style={{ 
              height: 48, 
              borderRadius: 8, 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginTop: 24, 
              marginBottom: 24, 
              opacity: !isFormValid || isLoading ? 0.5 : 1 
            }}
            onPress={handleCheckEmail}
            disabled={!isFormValid || isLoading}
          >
            <LinearGradient
              colors={['#005BEA', '#00E5FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ 
                height: 48, 
                borderRadius: 8, 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%' 
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                Tiếp tục
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: color.primary, textAlign: 'center' }}>
              Quay lại đăng nhập
            </Text>
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