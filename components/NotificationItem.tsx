import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNotificationStyles} from '../src/StyleSheet/NotificationStyles';
import {PlayCircle, Flag, Camera, User} from 'lucide-react-native';

interface Notification {
  id: string;
  imageIcon: string;
  hasStoryRing: boolean;
  content: string;
  time: string;
  actionType: string;
}

const NotificationItem: React.FC<{
  notification: Notification;
  stackTime?: boolean;
}> = ({notification, stackTime = false}) => {
  const {id, imageIcon, hasStoryRing, content, time, actionType} = notification;
  const styles = useNotificationStyles();

  const renderIcon = () => {
    switch (imageIcon) {
      case 'video':
        return (
          <View style={styles.iconContainer}>
            <PlayCircle size={22} color="#fff" />
          </View>
        );
      case 'flag':
        return (
          <View style={styles.iconContainer}>
            <Flag size={22} color="#fff" />
          </View>
        );
      case 'post':
        return (
          <View style={styles.iconContainer}>
            <Camera size={22} color="#fff" />
          </View>
        );
      default:
        // Profile image with optional story ring
        return hasStoryRing ? (
          <View>
            <LinearGradient
              colors={['#C13584', '#F77737', '#FFDC80']}
              style={styles.storyRing}>
              <View style={styles.imageIconContainer}>
                <View
                  style={[
                    styles.imageIcon,
                    {
                      width: hasStoryRing ? 40 : 44,
                      height: hasStoryRing ? 40 : 44,
                      borderRadius: hasStoryRing ? 20 : 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}>
                  <User size={22} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <View style={styles.imageIconContainer}>
            <View
              style={[
                styles.imageIcon,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <User size={22} color="#fff" />
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderIcon()}
        <View style={styles.textContainer}>
          {stackTime ? (
            <>
              <Text numberOfLines={2} style={styles.contentText}>
                {content}
              </Text>
              <Text style={[styles.timeText, {marginTop: 4}]}>{time}</Text>
            </>
          ) : (
            <Text numberOfLines={3} style={styles.contentText}>
              {content}
              <Text style={styles.timeText}> • {time}</Text>
            </Text>
          )}
        </View>
        {actionType === 'request' ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.actionButtonTextConfirm}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.actionButtonTextDelete}>Xóa</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonTextConfirm}>
              {actionType === 'confirm' ? 'Xác nhận' : 'Theo dõi'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default NotificationItem;
export type {Notification};
