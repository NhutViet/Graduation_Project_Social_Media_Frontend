import { getAllNotification } from "@services/notificationRedux/notificationSlices";
import { Noti } from "@services/notificationRedux/notificationTypes";
import { AppDispatch, RootState } from "@services/store";
import NotificationSection from "../../../components/NotificationSection";
import { useEffect } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNotificationStyles } from "../../../src/StyleSheet/NotificationStyles";

const Header: React.FC<{ onBackPress: () => void }> = ({ onBackPress }) => {
  const styles = useNotificationStyles();
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Image
          style={styles.backIcon}
          source={require('../../../assets/icon/left.png')}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Thông báo</Text>
      {/* Placeholder để cân layout */}
      <View style={styles.backIcon} />
      <View style={styles.backIcon} />
    </View>
  );
};

export const NotificationsScreen = ({navigation}: any) => {
  const styles = useNotificationStyles();
  const dispatch = useDispatch<AppDispatch>();

  const { notifications, isLoading } = useSelector(
    (state: RootState) => state.notifications,
  );
  const {refreshToken} = useSelector((state: RootState) => state.user)

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
  notifications.forEach(noti => {
    const createdAt = new Date(noti.createdAt);
    const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (noti.type === 'suggested' || noti.type === 'others') {
      groupedNotifications.suggested.push(noti);
    } else if (diffInDays <= 30) {
      groupedNotifications.thisMonth.push(noti);
    } else {
      groupedNotifications.earlier.push(noti);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={handleBackPress} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{paddingBottom: 16}}>

        {/* Yêu cầu theo dõi */}
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => navigation.navigate('FollowerRequests')}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>👤</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.contentText}>Yêu cầu theo dõi</Text>
            <Text style={styles.timeText}>ark</Text>
          </View>

          <View style={styles.specialDot} />
          <Image
            style={styles.backIcon}
            source={require('../../../assets/icon/right.png')}
          />
        </TouchableOpacity>

        {isLoading ? (
          <Text style={{textAlign: 'center', marginTop: 20}}>Đang tải...</Text>
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
            <NotificationSection
              title="Đề xuất cho bạn"
              notifications={groupedNotifications.suggested}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
