import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import NotificationItem, { Notification } from './NotificationItem';
import { useNotificationStyles } from '../src/StyleSheet/NotificationStyles';

interface NotificationSectionProps {
  title: string;
  notifications: Notification[];
}

const NotificationSection: React.FC<NotificationSectionProps> = ({ title, notifications }) => {
  const styles = useNotificationStyles();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        scrollEnabled={false}
      />
    </View>
  );
};

export default NotificationSection;

