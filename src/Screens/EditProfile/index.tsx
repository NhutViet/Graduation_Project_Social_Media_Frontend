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

export const EditProfile = ({route, navigation}: any) => {
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
        <TouchableOpacity>
          <Text style={styles.headerText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity>
          <Text style={[styles.headerText, {color: '#3897F0'}]}>Done</Text>
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
              <Text style={styles.changeText}>Change Profile Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <UserInfo
              rows={[
                {label: 'Username', value: 'Jacob West'},
                {label: 'Handle', value: '@jacob_w'},
                {label: 'Website', value: ''},
                {label: 'Bio', value: 'Digital goodies designer @pixsellz'},
              ]}
            />

            <UserInfo
              title="Switch to Professional Account"
              subtitle="Private Information"
              rows={[
                {label: 'Email', value: 'jacob.west@gmail.com'},
                {label: 'Phone', value: '+1 202 555 0147'},
                {label: 'Gender', value: 'Male'},
              ]}
            />
          </View>

          <Modal visible={modalVisible} transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.btnModel} onPress={pickImage}>
                  <Text style={styles.textModel}>Pick from Gallery</Text>
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
                  <Text style={styles.textModel}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnModel}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.textModel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
