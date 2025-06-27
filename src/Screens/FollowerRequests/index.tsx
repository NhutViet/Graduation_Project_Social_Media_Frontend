// screens/FollowerRequests.tsx

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import NotificationSection from '../../../components/NotificationSection';
import NotificationItem from '../../../components/NotificationItem';
import { Noti } from '@services/notificationRedux/notificationTypes';
import { useNotificationStyles } from '../../StyleSheet/NotificationStyles';
import { ChevronLeft } from 'lucide-react-native';

const mockUser = {
  id: 'u1',
  username: 'demo_user',
  handleName: 'Demo User',
  profilePic: '', // URL ảnh nếu có
};

const mockRequests: Noti[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `req${i + 1}`,
  type: 'request',
  isRead: false,
  createdAt: new Date().toISOString(),
  caption: `đã gửi yêu cầu theo dõi bạn.`,
  actors: [{
    id: `u${i + 1}`,
    username: `user${i + 1}`,
    handleName: `Người dùng ${i + 1}`,
    profilePic: '',
  }],
  extraCount: 0,
  postId: '',
}));

const mockRecommended: Noti[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `rec${i + 1}`,
  type: 'follow',
  isRead: false,
  createdAt: new Date().toISOString(),
  caption: `có thể bạn quen.`,
  actors: [{
    id: `u${i + 11}`,
    username: `user${i + 11}`,
    handleName: `Người dùng ${i + 11}`,
    profilePic: '',
  }],
  extraCount: 0,
  postId: '',
}));

const Header: React.FC<{ navigation: any }> = ({ navigation }) => {
  const styles = useNotificationStyles();
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ChevronLeft/>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Yêu cầu theo dõi</Text>
      <Text style={styles.headerManageText}>Quản lý</Text>
    </View>
  );
};

export const FollowerRequests: React.FC<{ navigation: any }> = ({ navigation }) => {
  const styles = useNotificationStyles();
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  const displayed = (showAll ? mockRequests : mockRequests.slice(0, 5)).filter(Boolean);
  const moreCount = mockRequests.length - (showAll ? mockRequests.length : 5);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={styles.searchBar}>
          <Image
            style={styles.searchIcon}
            source={require('../../../assets/icon/search.png')}
          />
          <TextInput
            style={styles.searchPlaceholderText}
            placeholder="Tìm kiếm"
            placeholderTextColor={styles.searchPlaceholderText.color}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={displayed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => item ? <NotificationItem notification={item} stackTime /> : null}
          scrollEnabled={false}
        />

        {moreCount > 0 && (
          <TouchableOpacity onPress={() => setShowAll(true)}>
            <Text style={styles.moreText}>Xem thêm {moreCount} yêu cầu</Text>
          </TouchableOpacity>
        )}

        <NotificationSection
          title="Được đề xuất cho bạn"
          notifications={mockRecommended}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
