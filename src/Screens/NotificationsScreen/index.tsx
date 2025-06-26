import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import NotificationSection from '../../../components/NotificationSection';
import {useNotificationStyles} from '../../StyleSheet/NotificationStyles';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

// Mock data for notifications
const notificationData = {
  thisMonth: [
    {
      id: '1',
      imageIcon: 'account',
      hasStoryRing: true,
      content: 'John Doe started following you. You might know them.',
      time: '2d',
      actionType: 'follow',
    },
    {
      id: '2',
      imageIcon: 'post',
      hasStoryRing: false,
      content: 'Your post received 25 likes and 5 comments.',
      time: '5d',
      actionType: 'post',
    },
    {
      id: '3',
      imageIcon: 'video',
      hasStoryRing: false,
      content: 'Sarah Smith started a live video. Watch it before it ends!',
      time: '1w',
      actionType: 'friends',
    },
  ],
  earlier: [
    {
      id: '4',
      imageIcon: 'profile',
      hasStoryRing: true,
      content: 'Alex Johnson commented on your photo: "Amazing shot!"',
      time: '2w',
      actionType: 'post',
    },
    {
      id: '5',
      imageIcon: 'flag',
      hasStoryRing: false,
      content:
        'Your report has been reviewed. Thank you for keeping our community safe.',
      time: '3w',
      actionType: 'flag',
    },
    {
      id: '6',
      imageIcon: 'profile',
      hasStoryRing: true,
      content: 'Emma Wilson and 15 others liked your photo.',
      time: '3w',
      actionType: 'post',
    },
  ],
  suggested: [
    {
      id: '7',
      imageIcon: 'profile',
      hasStoryRing: true,
      content: 'Mark Davis is on the platform. Do you know them?',
      time: '1d',
      actionType: 'others',
    },
    {
      id: '8',
      imageIcon: 'profile',
      hasStoryRing: true,
      content: 'Jessica White started following your friend. Follow them back?',
      time: '3d',
      actionType: 'follow',
    },
    {
      id: '9',
      imageIcon: 'profile',
      hasStoryRing: true,
      content: 'Based on your interests, you might like to follow Mike Brown.',
      time: '1w',
      actionType: 'follow',
    },
  ],
};

const Header: React.FC<{onBackPress: () => void}> = ({onBackPress}) => {
  const styles = useNotificationStyles();
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <ChevronLeft/>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Thông báo</Text>
      <View style={styles.backIcon}/>
      <View style={styles.backIcon}/>
    </View>
  );
};

export const NotificationsScreen = ({navigation}: any) => {
  const styles = useNotificationStyles();
  const handleBackPress = () => navigation?.goBack();

  // Demo hasRequests flag
  const username = 'ark';
  const hasRequests = true;

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={handleBackPress} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{paddingBottom: 16}}>
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => navigation.navigate('FollowerRequests')}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>👤</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.contentText}>Yêu cầu theo dõi</Text>
            <Text style={styles.timeText}>{username}</Text>
          </View>

          {hasRequests && <View style={styles.specialDot} />}

          <ChevronRight/>
        </TouchableOpacity>

        <NotificationSection
          title="Trong tháng này"
          notifications={notificationData.thisMonth}
        />
        <NotificationSection
          title="Trước đó"
          notifications={notificationData.earlier}
        />
        <NotificationSection
          title="Đề xuất cho bạn"
          notifications={notificationData.suggested}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
