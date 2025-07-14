// Updated hooks file (./hooks.ts)
import { API } from '@services/api';
import axiosInstance from '@services/axiosInstance';

export const PASSWORD_LENGTH = 6;
export const PASSWORD_SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;\':",./<>?`~';

export const handlePasswordChange = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> => {
  if (newPassword !== confirmPassword) {
    return { success: false, message: 'Mật khẩu mới và xác nhận mật khẩu không khớp' };
  }

  try {
    const response = await axiosInstance.patch(
      API.CHANGE_PASSWORD,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: { token: 'refresh' },
      }
    );

    // Handle API response format
    if (response.data.message === 'Failed') {
      return {
        success: false,
        message: response.data.error || 'Đổi mật khẩu thất bại',
      };
    }

    return {
      success: true,
      message: response.data?.message || 'Đổi mật khẩu thành công',
    };
  } catch (error: any) {
    console.warn('Error updating password:', error);
    return {
      success: false,
      message: error.response?.data?.error ||
              error.response?.data?.message ||
              'Đổi mật khẩu thất bại',
    };
  }
};
