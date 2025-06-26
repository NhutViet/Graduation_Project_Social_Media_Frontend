import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/ThemeContext';
import { useNotificationSettingsStyles } from '../../../StyleSheet/NotificationSetingsStyles';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react-native';

export const Notifications = () => {
  const { theme } = useTheme();
  const navigation: any = useNavigation();
  const styles = useNotificationSettingsStyles();
  const [pauseAll, setPauseAll] = useState(false);

  // options that have detailed screens
  const detailedOptions = [
    'Người theo dõi và đang theo dõi',
    'Cuộc gọi',
    'Ngày sinh',
  ];

  const simpleOptions = [
    'Bài đăng, tin và bình luận',
    'Tin nhắn',
    'Sự kiện trực tiếp và reels',
    'Từ hệ thống',
  ];

  const handleOptionPress = (option: string) => {
    if (detailedOptions.includes(option)) {
      navigation.navigate('NotificationOption', {
        optionKey: option,
        title: option,
      });
    }
  };

  const renderNotificationOption = (title: string, subtitle?: string, hasSwitch?: boolean) => {
    return (
      <TouchableOpacity
        key={title}
        style={styles.optionRow}
        disabled={hasSwitch}
        onPress={hasSwitch ? undefined : () => handleOptionPress(title)}
      >
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.optionSubtitle}>{subtitle}</Text>
          )}
        </View>
        {hasSwitch ? (
          <Switch
            value={pauseAll}
            onValueChange={setPauseAll}
            trackColor={{ false: styles.switchTrack.backgroundColor, true: styles.switchTrackActive.backgroundColor }}
            thumbColor={pauseAll ? styles.switchThumbActive.backgroundColor : styles.switchThumb.backgroundColor}
          />
        ) : (
          <ChevronRight color={styles.rightIcon.tintColor}/>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft color={styles.backIcon.tintColor}/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông báo</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Notification Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bellIconContainer}>
            <Bell color={styles.bellIcon.tintColor}/>
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerText}>
              Bật thông báo từ cài đặt thiết bị của bạn để xem các cập nhật trên màn hình khóa.
            </Text>
            <Text style={styles.bannerLink}>Chuyển đến cài đặt thiết bị</Text>
          </View>
        </View>

        {/* Push Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhận thông báo</Text>
          
          {renderNotificationOption(
            'Tạm dừng tất cả',
            'tạm thời dừng các thông báo',
            true
          )}
          
          {renderNotificationOption(
            'Chế độ ngủ',
            'Tự động tắt tiếng thông báo khi đã tối hoặc khi bạn cần tập trung.'
          )}
          
          {[...detailedOptions, ...simpleOptions].map(option => renderNotificationOption(option))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
