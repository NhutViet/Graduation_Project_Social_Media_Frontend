import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNotificationStyles } from '../src/StyleSheet/NotificationStyles';
import { Noti } from '@services/notificationRedux/notificationTypes';

interface Props {
  notification: Noti;
  stackTime?: boolean;
}

const NotificationItem: React.FC<Props> = ({ notification, stackTime = false }) => {
  const styles = useNotificationStyles();
  const { type, isRead, createdAt, actors, caption } = notification;

  const mainActor = actors[0]; // Hiện tại chỉ lấy 1 người đầu
  const profilePic = mainActor?.profilePic;
  const username = mainActor?.username;

  const renderProfileImage = () => {
    return (
      <View>
        <LinearGradient
          colors={['#C13584', '#F77737', '#FFDC80']}
          style={styles.storyRing}
        >
          <View style={styles.imageIconContainer}>
            <View style={styles.imageIcon}>
              <Image
                style={styles.userIcon}
                source={
                  profilePic
                    ? { uri: profilePic }
                    : require('../assets/icon/account.png')
                }
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const formatTime = (isoTime: string) => {
    const created = new Date(isoTime);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần`;
    return `${Math.floor(diffDays / 30)} tháng`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.contentContainer}>
        {renderProfileImage()}
        <View style={styles.textContainer}>
          {stackTime ? (
            <>
              <Text numberOfLines={2} style={styles.contentText} ellipsizeMode='tail'>
                {caption}
              </Text>
              <Text style={[styles.timeText]}>
                {formatTime(createdAt)}
              </Text>
            </>
          ) : (
            <Text numberOfLines={2} style={styles.contentText}>
              <Text style={{ fontWeight: 'bold' }}>{username}</Text>{' '}
              {caption}
              <Text style={styles.timeText}> • {formatTime(createdAt)}</Text>
            </Text>
          )}
        </View>

        {/* Tùy loại hành động có thể hiện thêm nút */}
        {type === 'request' ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.actionButtonTextConfirm}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.actionButtonTextDelete}>Xóa</Text>
            </TouchableOpacity>
          </View>
        ) : type === 'follow' ? (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonTextConfirm}>Theo dõi</Text>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default NotificationItem;
