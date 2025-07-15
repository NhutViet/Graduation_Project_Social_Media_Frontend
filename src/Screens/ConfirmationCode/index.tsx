import React, { useState, useRef, useEffect } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../util/ThemeContext';
import { ArrowLeft } from 'lucide-react-native';
import ForgotPasswordStyles from '../../StyleSheet/ForgotPasswordStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConfirmNewPassword,
  fetchInitForgotPassword,
} from '../../../services/userRedux/userSlice';
import { 
  resetConfirmStatus,
  resetForgotStatus 
} from '../../../services/userRedux/userReducer';
import { RootState, AppDispatch } from '../../../services/store';
import { Colors } from '../../../assets/color/Colors';
import LoadingModal from '../../../components/Global/LoadingModal';
import { GlobalAlertManager } from '../../../components/Global/AlertModal';

export const ConfirmationCode = ({ navigation, route }: any) => {
  const { email, password, token: initialToken } = route.params;
  const [currentToken, setCurrentToken] = useState<string>(initialToken);
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const {
    isLoadingConfirm,
    isLoadingForgot,
  } = useSelector((state: RootState) => state.user);

  const { theme } = useTheme();
  const color = Colors[theme];
  const styles = ForgotPasswordStyles(theme);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    dispatch(resetConfirmStatus());
    dispatch(resetForgotStatus());
    inputRefs.current[0]?.focus();
  }, [dispatch]);

  const handleCodeChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;
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
      const result = await dispatch(
        fetchConfirmNewPassword({ token: currentToken, code: fullCode })
      ).unwrap();
      GlobalAlertManager.show(
        'Thành công',
        'Mật khẩu đã được đặt lại thành công.',
        () => {
          navigation.navigate('SwitchAccount', {
            email,
            newPassword: result.newPassword,
          });
        }
      );
    } catch (err: any) {
      GlobalAlertManager.show('Lỗi!', err.message);
    }
  };

  const handleResendCode = async () => {
    try {
      const result = await dispatch(
        fetchInitForgotPassword({ email, newPassword: password })
      ).unwrap();
      setCurrentToken(result.token);
      GlobalAlertManager.show('Gửi lại mã', 'Mã xác nhận đã được gửi lại');
    } catch (err: any) {
      GlobalAlertManager.show('Lỗi!', err.message);
    }
  };

  const isFormValid = code.every((digit) => digit !== '');

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
          <Text style={styles.title}>Xác nhận mã</Text>
          <Text style={styles.subtitle}>
            Nhập mã xác nhận 6 chữ số được gửi đến email của bạn
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : undefined,
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus={true}
              />
            ))}
          </View>

          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResendCode}
            disabled={isLoadingForgot}
          >
            <Text style={styles.resendText}>
              Không nhận được mã? <Text style={styles.resendLink}>Gửi lại</Text>
            </Text>  
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonLogin, !isFormValid && styles.disabledButton]}
            onPress={handleConfirmCode}
            disabled={!isFormValid || isLoadingConfirm}
          >
            <Text style={[styles.textBtn, !isFormValid && styles.disabledText]}>
              Xác nhận
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {(isLoadingConfirm || isLoadingForgot) && (
        <View style={styles.loadingOverlay}>
          <LoadingModal withBackdrop={false} />
        </View>
      )}
    </View>
  );
};