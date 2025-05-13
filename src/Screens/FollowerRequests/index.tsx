import React, {useState} from 'react';
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
import NotificationItem, {
  Notification,
} from '../../../components/NotificationItem';
import {useNotificationStyles} from '../../StyleSheet/NotificationStyles';

const mockRequests: Notification[] = Array.from({length: 10}).map((_, i) => ({
  id: `req${i + 1}`,
  imageIcon: 'default',
  hasStoryRing: false,
  content: `User ${i + 1}`,
  time: `@user${i + 1}`,
  actionType: 'request',
}));

const mockRecommended: Notification[] = Array.from({length: 10}).map(
  (_, i) => ({
    id: `req${i + 11}`,
    imageIcon: 'default',
    hasStoryRing: false,
    content: `User ${i + 11}`,
    time: `@user${i + 11}`,
    actionType: 'confirm',
  }),
);

const Header: React.FC<{ navigation: any }> = ({ navigation }) => {
  const styles = useNotificationStyles();
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image 
          style={styles.backIcon}
          source={require('../../../assets/icon/left.png')}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Follower requests</Text>
      <Text style={styles.headerManageText}>Manage</Text>
    </View>
  );
};

export const FollowerRequests: React.FC<{navigation: any}> = ({navigation}) => {
  const styles = useNotificationStyles();
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false); 

  const displayed = showAll ? mockRequests : mockRequests.slice(0, 5);
  const moreCount = mockRequests.length - (showAll ? mockRequests.length : 5);

  const handleViewMore = () => {
    setShowAll(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{paddingBottom: 16}}>
        <View style={styles.searchBar}>
          <Image style={styles.searchIcon} source={require('../../../assets/icon/search.png')} />
          <TextInput
            style={styles.searchPlaceholderText}
            placeholder="Search"
            placeholderTextColor={styles.searchPlaceholderText.color}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={displayed}
          keyExtractor={item => item.id}
          renderItem={({item}) => ( <NotificationItem notification={item} stackTime /> )}
          scrollEnabled={false}
        />

        {moreCount > 0 && (
          <TouchableOpacity onPress={handleViewMore}>
            <Text style={styles.moreText}>View {moreCount} more requests</Text>
          </TouchableOpacity>
        )}

        <NotificationSection
          title="Recommended for you"
          notifications={mockRecommended}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
