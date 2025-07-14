import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@assets/color/Colors';
import { useTheme } from '../../../util/ThemeContext';
import { X, Eye, EyeOff } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@services/store';
import { handlePasswordChange, PASSWORD_LENGTH, PASSWORD_SPECIAL_CHARS } from './hooks';
import { GlobalAlertManager } from '../../../../components/Global/AlertModal';

interface ChangePasswordProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  isVisible,
  onClose,
}) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const currentUser = useSelector((state: RootState) => state.user.user);

  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 16,
      paddingLeft: 16,
    },
    topTitle: {
      fontSize: 18,
      color: colors.text,
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 14,
    },
    content: {
      padding: 16,
    },
    description: {
      color: colors.text,
      fontSize: 14,
      marginBottom: 24,
      lineHeight: 20,
    },
    section: {
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuIcon: {
      marginRight: 16,
    },
    passwordInput: {
      flex: 1,
      color: colors.text,
      paddingLeft: 10,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: 4,
      textAlign: 'center',
    },
    confirmButton: {
      backgroundColor: colors.blue,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    confirmButtonText: {
      color: colors.background,
      fontWeight: '600',
      fontSize: 18,
      marginLeft: 8,
    },
    loadingIndicator: {
      marginRight: 8,
    },
  }), [colors]);

  const onPasswordChange = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const result = await handlePasswordChange(
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      GlobalAlertManager.show('Thông báo', 'Đổi mật khẩu thành công');
      onClose();
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  }, [currentPassword, newPassword, confirmPassword, onClose]);

  const renderPasswordInput = useCallback((
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    show: boolean,
    toggleShowPassword: () => void
  ) => {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={1}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder={label}
          placeholderTextColor={colors.text}
          secureTextEntry={!show}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TouchableOpacity onPress={toggleShowPassword}>
          {show ? (
            <Eye size={20} color={colors.text} />
          ) : (
            <EyeOff size={20} color={colors.text} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }, [styles, colors, isLoading]);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} disabled={isLoading}>
            <X size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.topTitle}>
            {currentUser?.username} • Cirla
          </Text>
          <Text style={styles.title}>Đổi mật khẩu</Text>
          <Text style={styles.description}>
            Yêu cầu mật khẩu của bạn bao gồm ít nhất {PASSWORD_LENGTH} ký tự bao gồm:
            {'\n'} - Một chữ in hoa (A-Z)
            {'\n'} - Một chữ thường (a-z)
            {'\n'} - Một số (0-9)
            {'\n'} - Một ký tự đặc biệt ({PASSWORD_SPECIAL_CHARS})
          </Text>

          <View style={styles.section}>
            {renderPasswordInput(
              'Mật khẩu hiện tại',
              currentPassword,
              setCurrentPassword,
              showCurrentPassword,
              () => setShowCurrentPassword(!showCurrentPassword)
            )}
            {renderPasswordInput(
              'Mật khẩu mới',
              newPassword,
              setNewPassword,
              showConfirmPassword,
              () => setShowConfirmPassword(!showConfirmPassword)
            )}
            {renderPasswordInput(
              'Xác nhận mật khẩu mới',
              confirmPassword,
              setConfirmPassword,
              showConfirmPassword,
              () => setShowConfirmPassword(!showConfirmPassword)
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              (isLoading || confirmPassword === '') && { opacity: 0.3 },
            ]}
            onPress={onPasswordChange}
            disabled={isLoading || confirmPassword === ''}
          >
            {isLoading && (
              <ActivityIndicator
                style={styles.loadingIndicator}
                color={colors.background}
                size="small"
              />
            )}
            <Text style={styles.confirmButtonText}>
              {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ChangePassword);
