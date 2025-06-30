import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import MessageBoxStyles from '../../StyleSheet/MessageBoxStyles';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {fetchMyRooms} from '../../../services/roomRedux/roomSlice';
import ItemNewMessage from '../NewMessage/component/itemNewMessage';
import Story from '../../(tabs)/Home/components/Story';
import {handleUserPress} from '../../(tabs)/Home/util';
import {fetchFollowingStories} from '../../../services/StoryRedux/StorySlice';
import {
  checkStorySeenInStorage,
  clearExpiredSeenStories,
} from '../../../services/storage/storage';

export const MessageBox = (props: any) => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = MessageBoxStyles(theme);
  const {onBack} = props;
  const dispatch = useDispatch<AppDispatch>();
  const {rooms} = useSelector((state: RootState) => state.rooms);
  const [seenMap, setSeenMap] = useState<Record<string, boolean>>({});
  const followingUsers = useSelector(
    (state: RootState) => state.stories.followingUsers,
  );
  const user = useSelector((state: RootState) => state.user?.user);
  const storyDetails = useSelector(
    (state: RootState) => state.stories.storyDetails,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    dispatch(fetchFollowingStories({page: 1}));
    clearExpiredSeenStories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchMyRooms());
    }, [dispatch]),
  );

  useEffect(() => {
    const syncSeenStories = async () => {
      const map: Record<string, boolean> = {};
      for (const user of followingUsers) {
        for (const storyId of user.stories) {
          const createdAt = storyDetails.find(
            s => s._id === storyId,
          )?.createdAt;
          if (!createdAt) continue;
          const seen = await checkStorySeenInStorage(storyId, createdAt);
          map[storyId] = seen;
        }
      }
      setSeenMap(map);
    };

    if (followingUsers.length && storyDetails.length) {
      syncSeenStories();
    }
  }, [followingUsers, storyDetails]);

  const filteredRooms = rooms.filter(room => {
    const otherUsers = room.user_ids.filter(u => u._id !== user?._id);
    const nameChat =
      room.name?.trim().length > 0
        ? room.name
        : otherUsers[0]?.handleName || '';

    return nameChat.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerBlock}>
          <TouchableOpacity
            style={styles.iconBlock}
            onPress={() => {
              navigation.goBack();
              onBack && onBack();
            }}>
            <Image
              source={require('../../../assets/icon/left.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{user?.handleName}</Text>
        </View>
        <View style={styles.headerBlock}>
          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/new_mess.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBlock}>
          <View style={styles.iconBlock}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/search.png')}
            />
          </View>
          <TextInput
            ref={searchInputRef}
            placeholder="Tìm kiếm đoạn hội thoại"
            placeholderTextColor={color.text}
            style={[
              styles.searchInput,
              {paddingRight: searchQuery.length > 0 ? 40 : 0},
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}>
              <Image
                style={styles.clearIcon}
                source={require('../../../assets/icon/closer.png')}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.storiesContainer}>
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 10}}>
            {followingUsers
              .filter(item => {
                const isCurrentUser = item._id === user?._id;
                const hasStory = item.stories?.length > 0;

                return isCurrentUser || hasStory;
              })
              .map(item => {
                const isCurrentUser = item._id === user?._id;
                const story = storyDetails.find(
                  s => s._id === item.stories?.[0],
                );
                const viewedByUsers = (story as any)?.viewedByUsers || [];
                const isSeen =
                  viewedByUsers.includes(user?.handleName) ||
                  seenMap[item.stories?.[0]] === true;

                return (
                  <Story
                    key={item._id}
                    name={isCurrentUser ? 'Tin của tôi' : item.handleName}
                    image={item?.profilePic}
                    status={item.stories.length > 0 ? 1 : 0}
                    hasStory={item.stories.length > 0}
                    isSeen={isSeen}
                    isCurrentUser={isCurrentUser}
                    func={() =>
                      handleUserPress(
                        item,
                        dispatch,
                        navigation,
                        storyDetails,
                        user,
                      )
                    }
                  />
                );
              })}
          </ScrollView>
        </View>
      </View>

      {/* Messages Header */}
      <View style={styles.messagesHeader}>
        <Text style={styles.messagesHeaderTitle}>Tin nhắn</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PendingMessages', {
              handleName: user?.handleName,
            })
          }>
          <Text style={styles.messagesHeaderSubtitle}>Tin nhắn chờ xử lý</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <View style={styles.messagesListContainer}>
        <FlashList
          data={filteredRooms}
          renderItem={({item}) => {
            const filteredUsers = item.user_ids.filter(
              u => u._id !== user?._id,
            );

            const user1 = filteredUsers[0];
            const user2 = filteredUsers[1];

            const nameChat =
              item.name?.trim().length > 0
                ? item.name
                : user1?.handleName || 'Không xác định';

            return (
              <ItemNewMessage
                roomId={item._id}
                nameChat={nameChat}
                latestMessage={item?.latestMessage}
                img1={user1?.profilePic || ''}
                img2={user2?.profilePic || ''}
              />
            );
          }}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};
