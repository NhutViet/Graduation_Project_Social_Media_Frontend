import React, {useCallback, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {
  PlusSquare,
  Menu,
  Grid,
  Lock,
  ChevronDown,
  Share2,
  Moon,
  Video,
  SquareUserRound,
} from 'lucide-react-native';
import {Styles} from '../../StyleSheet/Profile.Styles';
import {SwitchAccount} from '../../../components/SwitchAccount';
import {ViewMore} from '../../../components/ViewMore';
import ModalCreate from './components/ModalCreate';
import {PostsView, ReelsView, TagsView} from './components/PostView.component';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {
  fetchFollowers,
  fetchFollowing,
} from '../../../services/relationRedux/relationSlice';
import {getPostsAndReelsOfUser} from '../../../services/postUserRedux/postUserSlice';
import {fetchReels} from '@services/reelRedux/reelSlice';
import {fetchHighlightStory} from '@services/StoryRedux/StorySlice';
import {handleHighlightPress} from '../Home/util';
import {Story} from '@services/StoryRedux/StoryType';

const Profile = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const {styles} = Styles;
  const user = useSelector((state: RootState) => state.user.user);
  const {highlightStories, loading} = useSelector(
    (state: RootState) => state.stories || {},
  );
  const storyDetails = useSelector(
    (state: RootState) => state.stories.storyDetails,
  );
  const initializedRef = useRef(false);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user?.user?._id);
  const {followers, following} = useSelector(
    (state: RootState) => state.relation,
  );

  const {refreshToken} = useSelector((state: RootState) => state.user);
  const {items: PostsItem}: any | null = useSelector(
    (state: RootState) => state.postUser.posts,
  );
  const {items: ReelsItem}: any | null = useSelector(
    (state: RootState) => state.postUser.reels,
  );
  const {isSuccess} = useSelector((state: RootState) => state.postUser);

  const [visibleModalCreate, setVisibleModalCreate] = useState(false);

  const [isSwitchAccountVisible, setSwitchAccountVisible] = useState(false);
  const handleUsernamePress = () => {
    setSwitchAccountVisible(true);
  };

  const [isViewMoreVisible, setViewMoreVisible] = useState(false);

  const renderStories = ({item}: {item: Story}) => (
    <TouchableOpacity
      key={item._id}
      style={styles.highlightItem}
      onPress={() =>
        handleHighlightPress(item, dispatch, navigation, user, true)
      }>
      <View style={styles.highlightImageContainer}>
        <Image
          source={
            item?.thumbnail
              ? {uri: item.thumbnail}
              : {
                  uri: 'https://i.pinimg.com/736x/6d/71/c3/6d71c3a702199277c03ea4be15200bb4.jpg',
                }
          }
          style={styles.highlightImage}
        />
      </View>
      <Text style={[styles.highlightText, {color: color.text}]}>
        {item.collectionName}
      </Text>
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(fetchHighlightStory({userId}));
        dispatch(fetchFollowers({userId: userId}));
        dispatch(fetchFollowing({userId: userId}));
        dispatch(getPostsAndReelsOfUser({refreshToken, userId}));
      }
    }, [userId]),
  );

  // useEffect(() => {
  //   if (userId) {
  //     Promise.all([
  // dispatch(fetchFollowers({userId: userId})),
  // dispatch(fetchFollowing({userId: userId})),
  //     ]).catch(error => {
  //       console.error('Error fetching relations:', error);
  //     });
  //   }
  // }, [dispatch, userId]);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (!initializedRef.current && userId) {
  //       initializedRef.current = true;
  //       dispatch(getPostsAndReelsOfUser({refreshToken, userId}));
  //     }
  //   }, [dispatch, refreshToken, userId]),
  // );

  const [activeTab, setActiveTab] = useState('grid');

  const renderHeader = () => (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <View style={styles.usernameContainer}>
          <Lock size={16} color={color.text} />
          <TouchableOpacity onPress={handleUsernamePress}>
            <Text style={[styles.username, {color: color.text}]}>
              {user?.handleName}
            </Text>
          </TouchableOpacity>
          <ChevronDown size={16} color={color.text} />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setVisibleModalCreate(true)}>
            <PlusSquare color={color.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Setting')}>
            <Menu color={color.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flex: 1}}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.profilePic
                  ? {uri: user.profilePic}
                  : {
                      uri: 'https://i.pinimg.com/736x/09/80/62/098062ede8791dc791c3110250d2a413.jpg',
                    }
              }
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.addStoryButton}
              onPress={() => {
                navigation.navigate('UpStory');
              }}>
              <Text style={styles.addStoryIcon}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: color.text}]}>
                {isSuccess && (PostsItem?.length || ReelsItem?.length)
                  ? PostsItem?.length + ReelsItem?.length
                  : 0}
              </Text>
              <Text style={[styles.statLabel, {color: color.text}]}>
                bài viết
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('FollowersScreen')}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, {color: color.text}]}>
                  {followers?.length ? followers?.length : 0}
                </Text>
                <Text style={[styles.statLabel, {color: color.text}]}>
                  người theo dõi
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FollowersScreen', {
                  screen: 'FollowingTab',
                })
              }>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, {color: color.text}]}>
                  {following?.length ? following?.length : 0}
                </Text>
                <Text style={[styles.statLabel, {color: color.text}]}>
                  đang theo dõi
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={[styles.displayName, {color: color.text}]}>
            {user?.handleName}
          </Text>
          <View style={styles.modeContainer}>
            <Moon size={14} color={color.textSecondary} />
            <Text style={[styles.modeText, {color: color.textSecondary}]}>
              {' '}
              {/* in quiet mode */} Ở chế độ lặng
            </Text>
          </View>
          <Text style={[styles.bioText, {color: color.text}]}>{user?.bio}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.editButton, {backgroundColor: color.gray}]}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.buttonText, {color: color.text}]}>
              Chỉnh sửa trang cá nhân
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareButton, {backgroundColor: color.gray}]}
            onPress={() => navigation.navigate('QRCode')}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.buttonText, {color: color.text}]}>
              Chia sẻ trang cá nhân
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, {backgroundColor: color.gray}]}
            onPress={() => navigation.navigate('Swipe')}>
            <Share2 size={18} color={color.text} />
          </TouchableOpacity>
        </View>
        {/* Highlight stories */}
        <View style={styles.highlightsContainer}>
          {loading ? (
            <Text style={{color: color.text}}>Đang tải highlights...</Text>
          ) : Array.isArray(highlightStories) && highlightStories.length > 0 ? (
            <FlashList
              horizontal
              data={highlightStories}
              renderItem={({item}) => renderStories({item})}
              estimatedItemSize={90}
              keyExtractor={item => item._id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingVertical: 5}}
            />
          ) : (
            <Text style={{color: color.text}}>
              Không có highlight stories nào
            </Text>
          )}
        </View>
        <ModalCreate
          visible={visibleModalCreate}
          onClose={() => setVisibleModalCreate(false)}
          onSelect={id => console.log('Selected:', id)}
        />
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={[styles.tabBar, {backgroundColor: color.background}]}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'grid' && styles.activeTab,
          {borderBottomColor: color.text},
        ]}
        onPress={() => setActiveTab('grid')}>
        <Grid
          color={activeTab === 'grid' ? color.text : color.textSecondary}
          size={24}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'reels' && styles.activeTab,
          {borderBottomColor: color.text},
        ]}
        onPress={() => setActiveTab('reels')}>
        <Video
          color={activeTab === 'reels' ? color.text : color.textSecondary}
          size={24}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'tags' && styles.activeTab,
          {borderBottomColor: color.text},
        ]}
        onPress={() => setActiveTab('tags')}>
        <SquareUserRound
          color={activeTab === 'tags' ? color.text : color.textSecondary}
          size={24}
        />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'grid':
        return isSuccess && PostsItem ? (
          <PostsView data={PostsItem} />
        ) : (
          <LoadingPlaceholder />
        );
      case 'reels':
        return isSuccess && ReelsItem ? (
          <ReelsView data={ReelsItem} />
        ) : (
          <LoadingPlaceholder />
        );
      case 'tags':
        return isSuccess && PostsItem ? (
          <TagsView data={PostsItem} />
        ) : (
          <LoadingPlaceholder />
        );
      default:
        return <LoadingPlaceholder />;
    }
  };

  const LoadingPlaceholder = () => (
    <View style={[styles.content, styles.centerItem, {height: 50}]}>
      <Text style={styles.textno}>Đang tải...</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <ScrollView>
        {renderHeader()}
        {renderTabBar()}
        {renderContent()}
      </ScrollView>
      <SwitchAccount
        visible={isSwitchAccountVisible}
        onClose={() => setSwitchAccountVisible(false)}
      />
      <ViewMore
        visible={isViewMoreVisible}
        onClose={() => setViewMoreVisible(false)}
        postId="123456"
      />
    </SafeAreaView>
  );
};

export default Profile;
