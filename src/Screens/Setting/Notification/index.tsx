import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useNotificationSettingsStyles} from '../../../StyleSheet/NotificationSetingsStyles';
import {ArrowLeft} from 'lucide-react-native';
import {
  getMessaging,
  getToken,
  deleteToken,
} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';
import {useSelector, useDispatch} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {fetchEditUser} from '@services/userRedux/userSlice';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {ActivityIndicator} from 'react-native-paper';
import {useHeadAlert} from '../../../../components/Global/HeadAlertProvider';

export const Notifications = () => {
  const navigation: any = useNavigation();
  const styles = useNotificationSettingsStyles();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const {showAlert} = useHeadAlert();
  const [loading, setLoading] = useState(false);
  const [localNotified, setLocalNotified] = useState(
    user?.wantNotified ?? false,
  );

  useEffect(() => {
    setLocalNotified(user?.wantNotified ?? false);
  }, [user?.wantNotified]);

  const handleToggleNotification = async (value: boolean) => {
    setLoading(true);
    setLocalNotified(value);

    try {
      if (!user) return;

      const messaging = getMessaging(getApp());

      if (value) {
        const fcmToken = await getToken(messaging);
        dispatch(fetchEditUser({fcmToken, wantNotified: true}))
          .unwrap()
          .then(res => console.log('xong r nè: ', res));
        showAlert('Thành công', 'Bật thông báo thành công.');
      } else {
        await deleteToken(messaging);
        dispatch(fetchEditUser({fcmToken: '', wantNotified: false}))
          .unwrap()
          .then(res => console.log('xong r nè: ', res));
        showAlert('Thành công', 'Tắt thông báo thành công.');
      }
    } catch (error) {
      setLocalNotified(prev => !prev);
      GlobalAlertManager.show('Lỗi', 'Không thể thay đổi thông báo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color={styles.backIcon.tintColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông báo</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Chỉ một nút toggle duy nhất */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhận thông báo</Text>

          <View style={styles.optionRow}>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Nhận thông báo</Text>
              <Text style={styles.optionSubtitle}>
                Bật hoặc tắt tất cả thông báo từ ứng dụng.
              </Text>
            </View>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={styles.switchTrackActive.backgroundColor as string}
              />
            ) : (
              <Switch
                value={localNotified}
                onValueChange={handleToggleNotification}
                trackColor={{
                  false: styles.switchTrack.backgroundColor,
                  true: styles.switchTrackActive.backgroundColor,
                }}
                thumbColor={
                  localNotified
                    ? styles.switchThumbActive.backgroundColor
                    : styles.switchThumb.backgroundColor
                }
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
