import {SafeAreaView, Switch, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {createStyles} from '../../../StyleSheet/Setting.Styles';
import {ChevronLeft} from 'lucide-react-native';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

export const ShowActivity = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const mColor = Colors[theme] || Colors;
  const styles = createStyles(theme);
  const [isActive, setIsActive] = useState(false);

  const handleShowActivityToogle = async () => {
    try {
      setIsActive(!isActive);
      GlobalAlertManager.show(
        'Thành công',
        `Chuyển sang chế độ ${!isActive ? 'online' : 'offline'}`,
      );
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ChevronLeft size={30} color={mColor.text} />
        </TouchableOpacity>
        <Text style={styles.headTitle}>Hiện trạng thái hoạt động</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.content}>
        <View
          style={[
            styles.privacyContainer,
            {backgroundColor: mColor.background},
          ]}>
          <View style={styles.privacyHeader}>
            <Text style={[styles.privacyTitle, {color: mColor.text}]}>
              Hiện trạng thái hoạt động
            </Text>
            <Switch
              value={isActive}
              onValueChange={handleShowActivityToogle}
              trackColor={{
                false: mColor.border,
                true: mColor.blue,
              }}
              thumbColor={mColor.white}
            />
          </View>
          <Text style={styles.privacyDescription}>
            Cho phép các tài khoản bạn theo dõi và bất kỳ ai bạn nhắn tin xem
            thời gian bạn hoạt động lần cuối hoặc hiện đang hoạt động trên ứng
            dụng Instagram. Khi tắt tùy chọn này, bạn sẽ không thể xem trạng
            thái hoạt động của các tài khoản khác.
            <Text style={styles.learnMore}>Tìm hiểu thêm.{'\n'}</Text>
            {'\n'}
            <Text style={styles.privacyDescription}>
              Bạn vẫn có thể sử dụng ứng dụng khi trang thái hoạt động đang
              tắt..
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
