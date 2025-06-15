import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import MessageThumbnail, {
  MessageThumbnailProps,
} from '../../../components/MessageThumbnail';
import {useProfileEditingStyles} from '../../../src/StyleSheet/ProfileEditingStyles';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Navigation/AppNavigation';

const rooms = ['room1', 'room2'];

type RoomSelectorProp = StackNavigationProp<
  RootStackParamList,
  'PendingMessages'
>;

export const PendingMessages: React.FC = () => {
  const styles = useProfileEditingStyles();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const nav = useNavigation<RoomSelectorProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'PendingMessages'>>();
  const handleName = route.params?.handleName;

  const enterRoom = (room: string) => nav.navigate('MessageScreen', {room});

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
  const mineData: MessageThumbnailProps[] = strangersData.map(item => ({
    ...item,
    id: `m-${item.id}`,
    isMine: true,
  }));

  const filtered = (data: MessageThumbnailProps[]) =>
    data.filter(
      item =>
        item.username.includes(searchText) || item.message.includes(searchText),
    );

  const renderList = (data: MessageThumbnailProps[]) => (
    <FlatList
      data={filtered(data)}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <MessageThumbnail {...item} onPress={() => enterRoom(rooms[0])} />
      )}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={() => (
        <View style={styles.searchContainer}>
          <Image
            source={require('../../../assets/icon/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor={styles.tabSelected.backgroundColor}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      )}
    />
  );

  const renderStrangers = () => renderList(strangersData);
  const renderMine = () => renderList(mineData);

  const renderScene = SceneMap({
    strangers: renderStrangers,
    mine: renderMine,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={{backgroundColor: styles.screen.backgroundColor}}
      tabStyle={{flex: 1}}
      indicatorStyle={{
        backgroundColor: styles.tabIndicator.backgroundColor,
        height: styles.tabIndicator.height,
      }}
      renderLabel={({route, focused}) => (
        <Text
          style={[
            styles.tabText,
            {
              color: focused
                ? styles.tabIndicator.backgroundColor
                : styles.tabText.color,
            },
          ]}>
          {route.key === 'strangers'
            ? 'Tin nhắn từ người lạ'
            : 'Yêu cầu tin nhắn của tôi'}
        </Text>
      )}
      pressColor="transparent"
    />
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>{handleName}</Text>
        <TouchableOpacity>
          <Image
            source={require('../../../assets/icon/down.png')}
            style={styles.headerSmallIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={{marginRight: 16}}>
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

      <TabView
        navigationState={{index, routes: [{key: 'strangers'}, {key: 'mine'}]}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default PendingMessages;
