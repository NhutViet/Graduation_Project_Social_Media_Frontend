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
import {useProfileEditingStyles} from '../../../src/StyleSheet/ProfileEditingStyles';
import {UserInfo} from '../../../components/UserInfo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../services/store';

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
  const [avatarUri, setAvatarUri] = useState<string | undefined>(
    user?.profilePic,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setAvatarUri(response.assets[0].uri);
      }
      setModalVisible(false);
    });
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setAvatarUri(response.assets[0].uri);
      }
      setModalVisible(false);
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Hủy bỏ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity>
          <Text style={[styles.headerText, {color: '#3897F0'}]}>Hoàn tất</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          <View style={styles.profileSection}>
            <Image source={{uri: avatarUri}} style={styles.avatar} />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.changeText}>Thay đổi ảnh đại diện</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <UserInfo
              rows={[
                {label: 'Tên người dùng', value: user?.username},
                {label: 'Tên tài khoản', value: user?.username},
                {label: 'Mô tả', value: user?.bio},
                {label: 'Ngày sinh', value: user?.dateOfBirth},
              ]}
            />

            <UserInfo
              title="Chuyển sang Professional Account"
              subtitle="Thông tin cá nhân"
              rows={[
                {label: 'Email', value: user?.email},
                {label: 'Số điện thoại', value: user?.phoneNumber},
                {label: 'Giới tính', value: user?.gender},
                {label: 'Địa chỉ', value: user?.address},
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
