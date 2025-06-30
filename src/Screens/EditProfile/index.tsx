import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useProfileEditingStyles} from './components/ProfileEditingStyles';
import {UserInfo} from './components/UserInfo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {fetchEditUser} from '../../../services/userRedux/userSlice';
import {ChevronLeft, SquarePen, Check} from 'lucide-react-native';
import {SEX, VN_PROVINCES} from './DataAddress/VN_PROVINCES';
import {uploadImageToR2} from '../../core/upload';
import {useUploadProgress} from '../../../services/UploadProgressManager';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {useTheme} from '../../../src/util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';

async function requestCameraPermission() {
  if (Platform.OS !== 'android') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Quyền truy cập Camera',
      message: 'Bạn cần cho phép ứng dụng sử dụng hình ảnh từ thiết bị',
      buttonNeutral: 'Hỏi lại sau',
      buttonNegative: 'Huỷ',
      buttonPositive: 'Đồng ý',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export const EditProfile = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user);
  const styles = useProfileEditingStyles();
  const dispatch = useDispatch<AppDispatch>();
  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress(); // Lấy các callback từ hook
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [email, setEmail] = useState(user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [gender, setGender] = useState(user?.gender);
  const [address, setAddress] = useState(user?.address);
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth);
  const [edit, setEdit] = useState(false);
  const [handleName, setHandleName] = useState(user?.handleName);
  const [profilePic, setProfilePic] = useState(user?.profilePic);
  const [modalVisible, setModalVisible] = useState(false);
  const {theme} = useTheme();
  const palette = Colors[theme];

  // Hàm upload ảnh và cập nhật profilePic
  const uploadProfilePic = async (uri: string) => {
    try {
      showUploadModal(uri, 'image'); // Hiển thị modal upload
      const publicUrl = await uploadImageToR2(uri, {
        showUploadModal,
        hideUploadModal,
        setProgress,
      });
      setProfilePic(publicUrl); // Cập nhật với URL từ Cloudflare
    } catch (error) {
      console.error('Upload profile picture failed:', error);
      GlobalAlertManager.show(
        'Lỗi',
        'Không thể upload ảnh đại diện. Vui lòng thử lại.',
      );
    } finally {
      hideUploadModal(); // Ẩn modal dù thành công hay thất bại
      setModalVisible(false); // Đóng modal
    }
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          await uploadProfilePic(uri);
        }
      }
    });
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    launchCamera({mediaType: 'photo', saveToPhotos: true}, async response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          await uploadProfilePic(uri);
        }
      }
    });
  };

  const handleSave = () => {
    dispatch(
      fetchEditUser({
        username,
        bio,
        email,
        phoneNumber,
        gender,
        address,
        dateOfBirth,
        handleName,
        profilePic,
      }),
    );
    GlobalAlertManager.show('Thông báo', 'Sửa thông tin của bạn thành công');
    setEdit(false);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => navigation.goBack()}>
          <ChevronLeft size={35} color={palette.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity
          onPress={edit ? handleSave : () => setEdit(true)}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.headerText, {color: '#3897F0'}]}>
            {edit ? 'Hoàn tất' : 'Sửa'}
          </Text>
          {edit ? (
            <Check size={20} color={'#3897F0'} />
          ) : (
            <SquarePen size={20} color={'#3897F0'} />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          <View style={styles.profileSection}>
            {profilePic && (
              <Image source={{uri: profilePic}} style={styles.avatar} />
            )}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              {edit && (
                <Text style={styles.changeText}>Thay đổi ảnh đại diện</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <UserInfo
              rows={[
                {
                  label: 'Tên người dùng',
                  value: username,
                  onChangeText: setUsername,
                  editable: edit,
                  type: 'text',
                },
                {
                  label: 'Tên tài khoản *',
                  value: handleName,
                  onChangeText: setHandleName,
                  editable: edit,
                  type: 'text',
                },
                {
                  label: 'Mô tả',
                  value: bio,
                  onChangeText: setBio,
                  editable: edit,
                  type: 'text',
                },
                {
                  label: 'Ngày sinh',
                  value: dateOfBirth,
                  onDateChange: setDateOfBirth,
                  editable: edit,
                  type: 'date',
                },
              ]}
            />

            <UserInfo
              title="Chuyển sang Professional Account"
              subtitle="Thông tin cá nhân"
              rows={[
                {
                  label: 'Email *',
                  value: email,
                  onChangeText: setEmail,
                  editable: false,
                  type: 'text',
                },
                {
                  label: 'Số điện thoại',
                  value: phoneNumber,
                  onChangeText: setPhoneNumber,
                  editable: edit,
                  type: 'text',
                },
                {
                  label: 'Giới tính',
                  value: gender,
                  onChangeText: setGender,
                  editable: edit,
                  type: 'dropdown',
                  options: SEX,
                },
                {
                  label: 'Địa chỉ',
                  value: address,
                  onChangeText: setAddress,
                  editable: edit,
                  type: 'dropdown',
                  options: VN_PROVINCES,
                },
              ]}
            />
          </View>

          <Modal visible={modalVisible} transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.btnModel} onPress={pickImage}>
                  <Text style={styles.textModel}>Chọn trong thư viện</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btnModel,
                    {
                      borderColor: '#ccc',
                      borderBottomWidth: 1,
                      borderTopWidth: 1,
                    },
                  ]}
                  onPress={takePhoto}>
                  <Text style={styles.textModel}>Chụp ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnModel}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.textModel}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
