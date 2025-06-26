import {
  Alert,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {createStyles} from '../../../StyleSheet/Setting.Styles';
import {ChevronLeft} from 'lucide-react-native';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

export const Privacy = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const mColor = Colors[theme] || Colors;
  const styles = createStyles(theme);
  const [isPrivate, setIsPrivate] = useState(false);

  const handlePrivacyToogle = async () => {
    try {
      setIsPrivate(!isPrivate);
      GlobalAlertManager.show(
        'Thành công',
        `Chuyển sang chế độ ${!isPrivate ? 'riêng tư' : 'công khai'}`,
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
        <Text style={styles.headTitle}>Quyền riêng tư của tài khoản</Text>
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
              Tài khoản riêng tư
            </Text>
            <Switch
              value={isPrivate}
              onValueChange={handlePrivacyToogle}
              trackColor={{
                false: mColor.border,
                true: mColor.blue,
              }}
              thumbColor={mColor.white}
            />
          </View>
          <Text style={styles.privacyDescription}>
            Khi tài khoản của bạn ở chế độ riêng tư, chỉ những người bạn chấp
            thuận mới có thể xem ảnh và video của bạn. Những người theo dõi hiện
            tại của bạn sẽ không bị ảnh hưởng.{' '}
            <TouchableOpacity onPress={() => console.log('VIEW MORE')}>
              <Text style={styles.learnMore}>Tìm hiều thêm</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
