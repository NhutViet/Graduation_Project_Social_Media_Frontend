import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import NotificationSection from '../../../components/NotificationSection';
import { useNotificationStyles } from '../../StyleSheet/NotificationStyles';
import { getAllNotification } from '@services/notificationRedux/notificationSlices';
import { Noti } from '@services/notificationRedux/notificationTypes';
import { AppDispatch, RootState } from '@services/store';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const Header: React.FC<{ onBackPress: () => void }> = ({ onBackPress }) => {
  const styles = useNotificationStyles();
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <ChevronLeft />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Thông báo</Text>
      <View style={styles.backIcon} />
      <View style={styles.backIcon} />
    </View>
  );
};

export const NotificationsScreen = ({ navigation }: any) => {
  const styles = useNotificationStyles();
  const dispatch = useDispatch<AppDispatch>();

  const { notifications, isLoading } = useSelector(
    (state: RootState) => state.notifications
  );
  const { refreshToken } = useSelector((state: RootState) => state.user);

  const handleBackPress = () => navigation?.goBack();

  useEffect(() => {
    dispatch(getAllNotification({ refreshToken }));
  }, [dispatch]);

  const groupedNotifications = {
    thisMonth: [] as Noti[],
    earlier: [] as Noti[],
    suggested: [] as Noti[],
  };

  // Phân loại theo type hoặc thời gian
  const now = new Date();
  notifications.forEach((noti) => {
    const createdAt = new Date(noti.createdAt);
    const diffInDays =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (noti.type === 'suggested' || noti.type === 'others') {
      groupedNotifications.suggested.push(noti);
    } else if (diffInDays <= 30) {
      groupedNotifications.thisMonth.push(noti);
    } else {
      groupedNotifications.earlier.push(noti);
    }
  });

  const hasRequests = notifications.some((n) => n.type === 'request');

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={handleBackPress} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* Yêu cầu theo dõi */}
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => navigation.navigate('FollowerRequests')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>👤</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.contentText}>Yêu cầu theo dõi</Text>
            <Text style={styles.timeText}>ark</Text>
          </View>

          {hasRequests && <View style={styles.specialDot} />}
          <ChevronRight />
        </TouchableOpacity>

        {isLoading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Đang tải...
          </Text>
        ) : (
          <>
            <NotificationSection
              title="Trong tháng này"
              notifications={groupedNotifications.thisMonth}
            />
            <NotificationSection
              title="Trước đó"
              notifications={groupedNotifications.earlier}
            />
            {/* <NotificationSection
              title="Đề xuất cho bạn"
              notifications={groupedNotifications.suggested}
            /> */}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
