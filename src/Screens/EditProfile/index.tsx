import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useProfileEditingStyles} from '../../../src/StyleSheet/ProfileEditingStyles';
import {UserInfo} from '../../../components/UserInfo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';

async function requestCameraPermission() {
  if (Platform.OS !== 'android') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Camera Access Required',
      message: 'This app needs to access your camera to take photos.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export const EditProfile = ({route}: any) => {
  const navigation = useNavigation();
  const styles = useProfileEditingStyles();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setAvatarUri(response.assets[0].uri ?? null);
      }
      setModalVisible(false);
    });
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.warn('Camera permission denied');
      return;
    }

    launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.error('Camera error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setAvatarUri(response.assets[0].uri ?? null);
      }
      setModalVisible(false);
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Hủy</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity>
          <Text style={[styles.headerText, {color: '#3897F0'}]}>Hoàn tất</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          <View style={styles.profileSection}>
            <Image
              source={
                avatarUri
                  ? {uri: avatarUri}
                  : require('../../../assets/icon/account.png')
              }
              style={styles.avatar}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.changeText}>Thay đổi ảnh đại diện</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <UserInfo
              rows={[
                {label: 'Tên người dùng', value: 'Jacob West'},
                {label: 'Tên tài khoản', value: '@jacob_w'},
                {label: 'Website', value: ''},
                {label: 'Mô tả', value: 'Digital goodies designer @pixsellz'},
              ]}
            />

            <UserInfo
              title="Chuyển sang Professional Account"
              subtitle="Thông tin cá nhân"
              rows={[
                {label: 'Email', value: 'jacob.west@gmail.com'},
                {label: 'Số điện thoại', value: '+1 202 555 0147'},
                {label: 'Giới tính', value: 'Male'},
              ]}
            />
          </View>

          <Modal visible={modalVisible} transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.btnModel} onPress={pickImage}>
                  <Text style={styles.textModel}>Chọn trong Gallery</Text>
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
