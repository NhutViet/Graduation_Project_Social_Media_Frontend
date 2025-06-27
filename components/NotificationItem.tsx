import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNotificationStyles } from '../src/StyleSheet/NotificationStyles';
import { Noti } from '@services/notificationRedux/notificationTypes';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; // Dùng tiếng Việt
import { CircleUserRound } from 'lucide-react-native';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface Props {
  notification: Noti;
  stackTime?: boolean;
}

const NotificationItem: React.FC<Props> = ({
  notification,
  stackTime = false,
}) => {
  const styles = useNotificationStyles();
  const navigation = useNavigation<any>();

  const mainActor = notification.actors[0]; // Chỉ lấy người đầu tiên
  const profilePic = mainActor?.profilePic;
  const username = mainActor?.username;

  const renderProfileImage = () => {
    const hasStoryRing = true; // Có thể điều chỉnh logic sau này
    const showProfileImage = !!profilePic;

    return hasStoryRing ? (
      <View>
        <LinearGradient
          colors={['#C13584', '#F77737', '#FFDC80']}
          style={styles.storyRing}
        >
          <View style={styles.imageIconContainer}>
            <View
              style={[
                styles.imageIcon,
                {
                  width: hasStoryRing ? 40 : 44,
                  height: hasStoryRing ? 40 : 44,
                  borderRadius: hasStoryRing ? 20 : 22,
                },
              ]}
            >
              {showProfileImage ? (
                <Image
                  style={styles.userIcon}
                  source={{ uri: profilePic }}
                />
              ) : (
                <CircleUserRound style={styles.userIcon} />
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    ) : (
      <View style={styles.imageIconContainer}>
        <View style={styles.imageIcon}>
          {showProfileImage ? (
            <Image
              style={styles.userIcon}
              source={{ uri: profilePic }}
            />
          ) : (
            <CircleUserRound style={styles.userIcon} />
          )}
        </View>
      </View>
    );
  };

  const formatTime = (isoTime: string) => {
    return dayjs(isoTime).fromNow();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() =>
          navigation.navigate('PostDetailScreen', { postId: notification.postId })
        }
      >
        {renderProfileImage()}
        <View style={styles.textContainer}>
          {stackTime ? (
            <>
              <Text
                numberOfLines={2}
                style={styles.contentText}
                ellipsizeMode="tail"
              >
                {notification.caption}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(notification.createdAt)}
              </Text>
            </>
          ) : (
            <Text numberOfLines={2} style={styles.contentText}>
              <Text style={{ fontWeight: 'bold' }}>{username}</Text>{' '}
              {notification.caption}
              <Text style={styles.timeText}> • {formatTime(notification.createdAt)}</Text>
            </Text>
          )}
        </View>

        {/* Các loại thông báo có thể có thêm hành động */}
        {notification.type === 'request' ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.actionButtonTextConfirm}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.actionButtonTextDelete}>Xóa</Text>
            </TouchableOpacity>
          </View>
        ) : notification.type === 'follow' ? (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonTextConfirm}>Theo dõi</Text>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default NotificationItem;
