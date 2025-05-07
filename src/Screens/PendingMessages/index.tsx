import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { useProfileEditingStyles } from '../../../src/StyleSheet/ProfileEditingStyles';
import MessageThumbnail, {
  MessageThumbnailProps,
} from '../../../components/MessageThumbnail';

export const PendingMessages = ({ navigation }: any) => {
  const styles = useProfileEditingStyles();
  const [activeTab, setActiveTab] = useState<'strangers' | 'mine'>('strangers');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  // Dummy data for strangers
  const strangersData: MessageThumbnailProps[] = [
    {
      id: 's1',
      username: 'alice99',
      message: 'Hey there! Loved your profile.',
      time: 'Just now',
      avatarUri: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 's2',
      username: 'bob_the_builder',
      message: 'Wanna collaborate on a project?',
      time: '12 min ago',
      avatarUri: 'https://i.pravatar.cc/150?img=2',
    },
  ];

  // Dummy data for personal requests
  const mineData: MessageThumbnailProps[] = strangersData.map(item => ({
    ...item,
    id: `m-${item.id}`,
    isMine: true,
  }));

  const dataToRender =
    activeTab === 'strangers' ? strangersData : mineData;

  const renderItem = ({ item }: { item: MessageThumbnailProps }) => (
    <MessageThumbnail
      {...item}
      selected={item.id === selectedId}
      onPress={() => setSelectedId(item.id)}
    />
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>jacob_w</Text>
        <TouchableOpacity>
          <Image
            source={require('../../../assets/icon/down.png')}
            style={styles.headerSmallIcon}
          />
        </TouchableOpacity>

        <View style={styles.headerRightIcons}>
          <TouchableOpacity>
            <Image
              source={require('../../../assets/icon/videoCamera.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../../assets/icon/newMessage.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabSwitch}>
        {(['strangers', 'mine'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() =>
              setActiveTab(tab === 'strangers' ? 'strangers' : 'mine')
            }
          >
            <Text
              style={[
                styles.tabText,
                activeTab !== tab && { color: styles.tabSelected.backgroundColor },
              ]}
            >
              {tab === 'strangers'
                ? "Strangers' messages"
                : 'My message requests'}
            </Text>
            <View
              style={[
                styles.tabIndicator,
                activeTab !== tab && { backgroundColor: styles.tabSelected.backgroundColor },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Image
          source={require('../../../assets/icon/search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={styles.tabSelected.backgroundColor}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={dataToRender.filter(item =>
          item.username.includes(searchText) ||
          item.message.includes(searchText)
        )}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
