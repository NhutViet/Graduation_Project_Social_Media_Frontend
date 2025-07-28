import React, { useState, useRef, useEffect } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../util/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConfirmForgotPassword, fetchInitForgotPassword } from '../../../services/userRedux/userSlice';
import { resetConfirmStatus, resetForgotStatus } from '../../../services/userRedux/userReducer';
import { RootState, AppDispatch } from '../../../services/store';
import { Colors } from '../../../assets/color/Colors';
import LoadingModal from '../../../components/Global/LoadingModal';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';

export const ConfirmationCode = ({ navigation, route }: any) => {
  const { identifier, mode, token: initialToken } = route.params;
  const [currentToken, setCurrentToken] = useState<string>(initialToken);
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { isLoadingConfirm, isLoadingForgot } = useSelector((state: RootState) => state.user);

  const { theme } = useTheme();
  const color = Colors[theme];
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    dispatch(resetConfirmStatus());
    dispatch(resetForgotStatus());
    inputRefs.current[0]?.focus();
  }, [dispatch]);

  const handleCodeChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      const newCode = [...code];
      if (!code[index] && index > 0) {
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      } else {
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handleConfirmCode = async () => {
    setErrorMessage('');
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Vui lòng nhập đầy đủ mã xác nhận');
      return;
    }

    try {
      const result = await dispatch(fetchConfirmForgotPassword({ token: currentToken, code: fullCode })).unwrap();
      navigation.navigate('NewPasswordReset', {
        identifier,
        mode,
        refreshToken: result.refreshToken,
      });
    } catch (err: any) {
      GlobalAlertManager.show('Lỗi!', err.message);
    }
  };

  const handleResendCode = async () => {
    try {
      const args = mode === 'email'
        ? { email: identifier }
        : { phone: identifier };
      const result = await dispatch(fetchInitForgotPassword(args)).unwrap();
      setCurrentToken(result.token);
      // Clear the code inputs when resending
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      GlobalAlertManager.show('Gửi lại mã', 'Mã xác nhận đã được gửi lại');
    } catch (err: any) {
      GlobalAlertManager.show('Lỗi!', err.message);
    }
  };

  const isFormValid = code.every((digit) => digit !== '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.background }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
        <Image
          source={require('../../../assets/icon/logo_loading.png')}
          style={{ width: 100, height: 100 }}
          resizeMode="cover"
        />
      </View>
      <ScrollView style={{ padding: 24 }}>

        <Text style={{ fontSize: 32, fontWeight: '700', marginTop: 24, color: color.text }}>
          Xác nhận mã
        </Text>
        <Text style={{ fontSize: 14, color: color.textSecondary, marginTop: 4 }}>
          Nhập mã xác nhận 6 chữ số được gửi đến {mode === 'email' ? 'email' : 'số điện thoại'} của bạn
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 32, marginBottom: 16 }}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: color.border || '#ccc',
                backgroundColor: color.backgroundSecondary || '#f0f0f0',
                color: color.text,
                fontSize: 18,
                textAlign: 'center',
              }}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        {errorMessage !== '' && (
          <Text style={{ color: color.error, marginBottom: 12 }}>{errorMessage}</Text>
        )}

        <TouchableOpacity onPress={handleResendCode} disabled={isLoadingForgot}>
          <Text style={{ textAlign: 'center', color: color.primary }}>
            Không nhận được mã? <Text style={{ fontWeight: '600' }}>Gửi lại</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 48,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 24,
            backgroundColor: color.primary,
            opacity: (!isFormValid || isLoadingConfirm) ? 0.5 : 1
          }}
          onPress={handleConfirmCode}
          disabled={!isFormValid || isLoadingConfirm}
        >
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>Xác nhận</Text>
        </TouchableOpacity>
      </ScrollView>

      {(isLoadingConfirm || isLoadingForgot) && (
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