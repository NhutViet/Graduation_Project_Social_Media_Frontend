import React from 'react';
import {View, Text, FlatList} from 'react-native';
import NotificationItem from './NotificationItem';
import {useNotificationStyles} from '../src/StyleSheet/NotificationStyles';
import {Noti} from '@services/notificationRedux/notificationTypes';

interface NotificationSectionProps {
  title: string;
  notifications: Noti[];
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  notifications,
}) => {
  const styles = useNotificationStyles();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <NotificationItem notification={item} stackTime />
          )}
          scrollEnabled={false}
        />
      ) : (
        <Text style={[styles.sectionTitle, {fontWeight: '400'}]}>
          Không có thông báo nào.
        </Text>
      )}
    </View>
  );
};

export default NotificationSection;
