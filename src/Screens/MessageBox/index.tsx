import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
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
import {useStoryPrefetch} from '../../(tabs)/Home/hook/useStoryPrefetch';
import {
  ArrowLeft,
  MessageSquarePlus,
  Search,
  XCircle,
} from 'lucide-react-native';
import LoadingModal from '../../../components/Global/LoadingModal';

export const MessageBox = (props: any) => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = MessageBoxStyles(theme);
  const {onBack} = props;
  const dispatch = useDispatch<AppDispatch>();
  const {rooms, loading} = useSelector((state: RootState) => state.rooms);
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
  const [refreshing, setRefreshing] = useState(false);
  const [visibleStoryCount, setVisibleStoryCount] = useState(5);
  const STORIES_LOAD_BATCH = 5;
  const [isLoadingMoreStories, setIsLoadingMoreStories] = useState(false);

  const {prefetchStoryData, getCachedStoryData, clearExpiredCache} =
    useStoryPrefetch();

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMyRooms());
    setRefreshing(false);
  };

  const processedStories = React.useMemo(() => {
    return [
      ...followingUsers.filter(
        item => item._id === user?._id || item.handleName === user?.handleName,
      ),
      ...followingUsers
        .filter(
          item =>
            item._id !== user?._id && item.handleName !== user?.handleName,
        )
        .sort(
          (a, b) =>
            (b.stories?.length > 0 ? 1 : 0) - (a.stories?.length > 0 ? 1 : 0),
        ),
    ];
  }, [followingUsers, user?._id, user?.handleName]);

  const visibleStories = React.useMemo(() => {
    return processedStories.slice(0, visibleStoryCount);
  }, [processedStories, visibleStoryCount]);

  const handleStoryScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
      const currentIndex = Math.floor(contentOffset.x / 70); // Assuming each story item is ~70px wide

      // ✅ Load more when user reaches 3rd item from the end of visible stories
      const triggerPoint = Math.max(0, visibleStoryCount - 3);

      if (
        currentIndex >= triggerPoint &&
        visibleStoryCount < processedStories.length &&
        !isLoadingMoreStories
      ) {
        setIsLoadingMoreStories(true);
        const newCount = Math.min(
          visibleStoryCount + STORIES_LOAD_BATCH,
          processedStories.length,
        );
        setTimeout(() => {
          setVisibleStoryCount(newCount);
          setIsLoadingMoreStories(false);
        }, 300);
      }
    },
    [visibleStoryCount, processedStories.length, isLoadingMoreStories],
  );

  const prefetchStoriesForVisibleUsers = useCallback(async () => {
    const usersToPreload = visibleStories.filter(u => u.stories?.length > 0);
    const priorityUsers = usersToPreload.slice(
      0,
      Math.min(5, usersToPreload.length),
    );
    for (const user of priorityUsers) {
      if (user.stories?.length > 0) {
        try {
          await prefetchStoryData(user._id, user.stories);
        } catch (error) {
          console.log('Error prefetching stories for user:', user.handleName);
        }
      }
    }
  }, [visibleStories, prefetchStoryData]);

  useEffect(() => {
    if (visibleStories.length > 0 && storyDetails.length > 0) {
      setTimeout(prefetchStoriesForVisibleUsers, 500);
    }
  }, [
    visibleStories.length,
    storyDetails.length,
    prefetchStoriesForVisibleUsers,
  ]);

  useEffect(() => {
    if (followingUsers.length > 0) {
      const currentProcessedLength = processedStories.length;
      if (visibleStoryCount > currentProcessedLength) {
        setVisibleStoryCount(Math.min(5, currentProcessedLength));
      }
    }
  }, [followingUsers.length, processedStories.length, visibleStoryCount]);

  useEffect(() => {
    dispatch(fetchFollowingStories({page: 1}));
    clearExpiredSeenStories();
    clearExpiredCache();
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
          const story = storyDetails.find(s => s._id === storyId);
          const createdAt = story?.createdAt;
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

  useEffect(() => {
    const forceRefresh = () => {
      setSeenMap((prev: Record<string, boolean>) => ({...prev}));
    };
    const timeoutId = setTimeout(forceRefresh, 100);
    return () => clearTimeout(timeoutId);
  }, [storyDetails]);

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
            onPress={() => {
              navigation.goBack();
              onBack && onBack();
            }}>
            <ArrowLeft size={22} color={color.text} />
          </TouchableOpacity>
          <Text style={styles.name}>{user?.handleName}</Text>
        </View>
        <View style={styles.headerBlock}>
          <TouchableOpacity>
            <MessageSquarePlus size={22} color={color.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBlock}>
          <View style={{marginLeft: 10}}>
            <Search size={22} color={color.text} />
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
              <XCircle size={20} color={color.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.storiesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 10}}
          onScroll={handleStoryScroll}
          scrollEventThrottle={16}>
          {visibleStories.map(item => {
            const isCurrentUser = item._id === user?._id;
            const story = storyDetails.find(s => s._id === item.stories?.[0]);
            const viewedByUsers = (story as any)?.viewedByUsers || [];
            const isSeen =
              viewedByUsers.includes(user?.handleName) ||
              seenMap[item.stories?.[0]] === true;
            const hasStory = item.stories?.length > 0;
            return (
              <Story
                key={item._id}
                name={isCurrentUser ? 'Tin của tôi' : item.handleName}
                image={item?.profilePic}
                hasStory={hasStory}
                isSeen={isSeen}
                isCurrentUser={isCurrentUser}
                func={() => {
                  if (hasStory) {
                    handleUserPress(
                      item,
                      dispatch,
                      navigation,
                      storyDetails,
                      user,
                      followingUsers,
                      undefined,
                      getCachedStoryData,
                    );
                  } else {
                    if (isCurrentUser) {
                      navigation.navigate('UpStory');
                    } else {
                      navigation.navigate('ProfileComp', {
                        userID: item._id,
                        handlename: item.handleName,
                      });
                    }
                  }
                }}
              />
            );
          })}
          {isLoadingMoreStories &&
            visibleStoryCount < processedStories.length && (
              <View
                style={{
                  width: 70,
                  height: 70,
                  marginHorizontal: 8,
                  borderRadius: 35,
                  backgroundColor: color.background,
                  borderWidth: 2,
                  borderColor: color.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <LoadingModal />
              </View>
            )}
          {!isLoadingMoreStories &&
            visibleStoryCount < processedStories.length &&
            visibleStories.length > 0 && (
              <View
                style={{
                  width: 70,
                  height: 70,
                  marginHorizontal: 8,
                  borderRadius: 35,
                  backgroundColor: color.backgroundSecondary,
                  borderWidth: 2,
                  borderColor: color.border,
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: color.textSecondary,
                    fontSize: 16,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  +{processedStories.length - visibleStoryCount}
                </Text>
              </View>
            )}
        </ScrollView>
      </View>

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

      <View style={styles.messagesListContainer}>
        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <LoadingModal />
          </View>
        ) : (
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
                  type={item.type}
                />
              );
            }}
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};
