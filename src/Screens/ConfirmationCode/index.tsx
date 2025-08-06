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
import { fetchVerifyCodeForgotPassword, fetchSendCodeForgotPassword } from '../../../services/userRedux/userSlice';
import { resetVerifyCodeStatus, resetSendCodeStatus } from '../../../services/userRedux/userReducer';
import { RootState, AppDispatch } from '../../../services/store';
import { Colors } from '../../../assets/color/Colors';
import LoadingModal from '../../../components/Global/LoadingModal';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';

export const ConfirmationCode = ({ navigation, route }: any) => {
  const { email, phoneNumber, token: initialToken, hasPhoneNumber } = route.params;
  const [currentToken, setCurrentToken] = useState<string>(initialToken);
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { 
    isLoadingVerifyCode, 
    isLoadingSendCode,
    verifyCodeMessage,
    sendCodeMessage
  } = useSelector((state: RootState) => state.user);

  const { theme } = useTheme();
  const color = Colors[theme];
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    dispatch(resetVerifyCodeStatus());
    dispatch(resetSendCodeStatus());
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

  const handleVerifyCode = async () => {
    setErrorMessage('');
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setErrorMessage('Vui lòng nhập đầy đủ mã xác nhận 6 chữ số');
      return;
    }

    try {
      const result = await dispatch(fetchVerifyCodeForgotPassword({ 
        token: currentToken, 
        code: fullCode 
      })).unwrap();
      
      // Navigate to password reset screen
      navigation.navigate('NewPasswordReset', {
        email,
        phoneNumber,
        refreshToken: result.refreshToken,
      });
    } catch (error: any) {
      GlobalAlertManager.show('Lỗi!', error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      // Prepare the payload based on whether user has phone number
      const payload = hasPhoneNumber 
        ? { email } 
        : { email, phoneNumber };
      
      const result = await dispatch(fetchSendCodeForgotPassword(payload)).unwrap();
      setCurrentToken(result.token);
      
      // Clear the code inputs when resending
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      GlobalAlertManager.show('Gửi lại mã', 'Mã xác nhận đã được gửi lại');
    } catch (error: any) {
      GlobalAlertManager.show('Lỗi!', error.message);
    }
  };

  const isFormValid = code.every((digit) => digit !== '');
  const isLoading = isLoadingVerifyCode || isLoadingSendCode;

  // Display identifier for user reference
  const displayIdentifier = hasPhoneNumber ? email : (phoneNumber || email);
  const identifierType = hasPhoneNumber ? 'email' : 'số điện thoại';

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
        <Text style={{ 
          fontSize: 32, 
          fontWeight: '700', 
          marginTop: 24, 
          color: color.text 
        }}>
          Xác nhận mã
        </Text>
        
        <Text style={{ 
          fontSize: 14, 
          color: color.textSecondary, 
          marginTop: 4,
          marginBottom: 8
        }}>
          Nhập mã xác nhận 6 chữ số được gửi đến số điện thoại của bạn
        </Text>

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          marginTop: 16, 
          marginBottom: 16 
        }}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: digit ? color.primary : (color.border || '#ccc'),
                backgroundColor: color.backgroundSecondary || '#f0f0f0',
                color: color.text,
                fontSize: 18,
                textAlign: 'center',
                fontWeight: '600',
              }}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {errorMessage !== '' && (
          <Text style={{ color: color.error, marginBottom: 12 }}>
            {errorMessage}
          </Text>
        )}

        <TouchableOpacity 
          onPress={handleResendCode} 
          disabled={isLoadingSendCode}
          style={{ marginBottom: 24 }}
        >
          <Text style={{ 
            textAlign: 'center', 
            color: isLoadingSendCode ? color.textSecondary : color.primary,
            fontSize: 14
          }}>
            Không nhận được mã? <Text style={{ fontWeight: '600' }}>Gửi lại</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 48,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.primary,
            opacity: (!isFormValid || isLoading) ? 0.5 : 1,
            marginBottom: 16
          }}
          onPress={handleVerifyCode}
          disabled={!isFormValid || isLoading}
        >
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
            Xác nhận
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: color.primary, textAlign: 'center' }}>
            Quay lại
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
          zIndex: 1000
        }}>
          <LoadingModal withBackdrop={true} />
        </View>
      )}
    </SafeAreaView>
  );
};
