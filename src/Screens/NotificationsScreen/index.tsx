import {getNotification} from '@services/notificationRedux/notificationSlice';
import {ItemNoti} from '@services/notificationRedux/notificationTypes';
import {AppDispatch, RootState} from '@services/store';
import React, {useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNotificationStyles} from '../../../src/StyleSheet/NotificationStyles';
import {ActivityIndicator} from 'react-native-paper';
import {markMyUnreadAsRead, resetStatus} from '@services/notificationRedux/notificationReducer';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { useTheme } from '../../../src/util/ThemeContext';

const Header: React.FC<{onBackPress: () => void}> = ({onBackPress}) => {
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
      <View style={styles.backIcon} />
      <View style={styles.backIcon} />
    </View>
  );
};

// Nhóm và sắp xếp thông báo
const groupNotificationsByDate = (notis: ItemNoti[]) => {
  const groups: {[key: string]: ItemNoti[]} = {};

  const today = new Date();
  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  notis.forEach(noti => {
    const createdAt = new Date(noti.createdAt);
    let key = '';

    if (isSameDay(createdAt, today)) {
      key = 'Hôm nay';
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (isSameDay(createdAt, yesterday)) {
        key = 'Hôm qua';
      } else {
        const dd = createdAt.getDate().toString().padStart(2, '0');
        const mm = (createdAt.getMonth() + 1).toString().padStart(2, '0');
        const yyyy = createdAt.getFullYear();
        key = `${dd}/${mm}/${yyyy}`;
      }
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(noti);
  });

  // Sắp xếp noti mới nhất trong mỗi nhóm
  Object.keys(groups).forEach(k => {
    groups[k].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  return groups;
};

export const NotificationsScreen = () => {
  const styles = useNotificationStyles();
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const {notifications, isSuccess} = useSelector(
    (state: RootState) => state.notification,
  );
  const userId = useSelector((state: RootState) => state.user.user?._id);

  useFocusEffect(
    useCallback(() => {
      // Khi vào màn hình
      dispatch(getNotification({}));

      // Khi thoát màn hình
      return () => {
        dispatch(markMyUnreadAsRead(userId));
      };
    }, [dispatch]),
  );

  const handlePress = (noti: ItemNoti) => {
    console.log('Pressed Noti:', noti);
    const type = noti.data?.type;
    switch (type) {
      case 'comment':
        if (noti.data?.postId) {
          navigation.navigate('PostDetailScreen', {postId: noti.data.postId});
        }
        break;
      case 'like':
        if (noti.data?.postId) {
          navigation.navigate('PostDetailScreen', {postId: noti.data.postId});
        }
        break;
      case 'unlike':
        if (noti.data?.postId) {
          navigation.navigate('PostDetailScreen', {postId: noti.data.postId});
        }
        break;
      case 'follow':
        navigation.navigate('ProfileComp', {userID: noti.data?.userId});
        break;
      case 'post':
        if (noti.data?.postId) {
          navigation.navigate('PostDetailScreen', {postId: noti.data.postId});
        }
        break;
      case 'story':
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBackPress={() => {
          navigation.goBack();
          dispatch(resetStatus()); // hoặc resetNotifications nếu có
        }}
      />

      {!isSuccess ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#888" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn không có thông báo nào</Text>
        </View>
      ) : (
        (() => {
          const grouped = groupNotificationsByDate(notifications);
          const sections = Object.keys(grouped).sort((a, b) => {
            if (a === 'Hôm nay') return -1;
            if (b === 'Hôm nay') return 1;
            if (a === 'Hôm qua') return -1;
            if (b === 'Hôm qua') return 1;

            const [dayA, monthA, yearA] = a.split('/').map(Number);
            const [dayB, monthB, yearB] = b.split('/').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);

            return dateB.getTime() - dateA.getTime();
          });

          return (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={{paddingBottom: 16}}>
              {sections.map(section => (
                <View key={section}>
                  <Text style={styles.sectionTitle}>{section}</Text>
                  {grouped[section].map(item => {
                    const receiverInfo = item.receiver.find(
                      r => r.userId === userId,
                    );
                    const isRead = receiverInfo?.isRead ?? false;

                    return (
                      <TouchableOpacity
                        key={item._id}
                        style={[
                          styles.notificationItem,
                          !isRead && {backgroundColor: theme === 'light' ? 'rgba(238, 246, 255, 1)' : 'rgba(255, 255, 255, 0.1)'},
                        ]}
                        onPress={() => handlePress(item)}>
                        <Image
                          style={styles.avatar}
                          source={require('../../../assets/icon/account.png')}
                        />
                        <View style={styles.textContainer}>
                          <Text
                            style={[
                              styles.contentText,
                              !isRead && {fontWeight: 'bold'},
                            ]}
                            numberOfLines={2}
                            ellipsizeMode="tail">
                            {item.title}
                          </Text>
                          <Text
                            style={styles.bodyText}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {item.body}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          );
        })()
      )}
    </SafeAreaView>
  );
};
