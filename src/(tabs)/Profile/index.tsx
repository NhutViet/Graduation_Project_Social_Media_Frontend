import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View, Text, SafeAreaView, Image, ScrollView} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  PlusSquare,
  Menu,
  Grid,
  Lock,
  ChevronDown,
  Moon,
  Video,
  SquareUserRound,
} from 'lucide-react-native';
import {Styles} from '../../StyleSheet/Profile.Styles';
import {SwitchAccount} from '../../../components/SwitchAccount';
import {ViewMore} from '../../../components/ViewMore';
import ModalCreate, {ModalCreateRef} from './components/ModalCreate';
import {PostsView, ReelsView, TagsView} from './components/PostView.component';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {
  fetchFollowers,
  fetchFollowing,
} from '../../../services/relationRedux/relationSlice';
import {getPostsAndReelsOfUser} from '../../../services/postUserRedux/postUserSlice';
import ACNavigateModal, {
  ACNavigateRef,
} from '../../../src/Screens/AccountCenter/components/ACNavigateModal';
import {fetchTaggedPosts} from '@services/taggedPostRedux/taggedPostSlice';
import {FlashList} from '@shopify/flash-list';
import HighlightStoriesComponent from './components/HighlightStoriesComponent';
import {TaggedPost} from '@services/taggedPostRedux/taggedPostTypes';

const Profile = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const {styles} = Styles;
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user?.user?._id);
  const {followers, following} = useSelector(
    (state: RootState) => state.relation,
  );
  const {refreshToken} = useSelector((state: RootState) => state.user);
  const postState = useSelector((state: RootState) => state.postUser.posts);
  const PostsItem = postState && 'items' in postState ? postState.items : [];

  const reelsState = useSelector((state: RootState) => state.postUser.reels);
  const ReelsItem = reelsState && 'items' in reelsState ? reelsState.items : [];
  const {isSuccess} = useSelector((state: RootState) => state.postUser);
  const modalCreateRef = useRef<ModalCreateRef>(null);
  const [isSwitchAccountVisible, setSwitchAccountVisible] = useState(false);
  const handleUsernamePress = () => {
    setSwitchAccountVisible(true);
  };
  const acModalRef = useRef<ACNavigateRef>(null);

  const [isViewMoreVisible, setViewMoreVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      Promise.all([
        dispatch(fetchFollowers({userId: userId})),
        dispatch(fetchFollowing({userId: userId})),
        dispatch(fetchTaggedPosts(userId)),
      ]).catch(error => {
        console.error('Error fetching relations:', error);
      });
    }
  }, [dispatch, userId]);

  // These two State Functionals below is for handle the length of bio
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [viewMoreBio, setViewMoreBio] = useState<Boolean>(false);
  const handleLengthBio = (bioText?: string) => {
    const MAX_LINES = 4;
    if (!bioText) {
      return <Text style={[styles.bioText, {color: color.text}]} />;
    }

    return (
      <View>
        <Text
          numberOfLines={viewMoreBio ? undefined : MAX_LINES}
          ellipsizeMode="tail"
          onTextLayout={({nativeEvent}) => {
            setNeedsTruncation(nativeEvent.lines.length > MAX_LINES);
          }}
          style={[styles.bioText, {color: color.text}]}>
          {bioText}
        </Text>

        {needsTruncation && (
          <TouchableOpacity onPress={() => setViewMoreBio(!viewMoreBio)}>
            <Text style={{color: color.blue}}>
              {viewMoreBio ? 'Thu gọn' : 'Xem thêm'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const [activeTab, setActiveTab] = useState('grid');

  const renderHeader = () => (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <View style={styles.usernameContainer}>
          <Lock size={20} color={color.text} />
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
            onPress={() => modalCreateRef.current?.open()}>
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
            {user?.username}
          </Text>
          <View style={styles.modeContainer}>
            <Moon size={14} color={color.textSecondary} />
            <Text style={[styles.modeText, {color: color.textSecondary}]}>
              {' '}
              Ở chế độ im lặng
            </Text>
          </View>
          {handleLengthBio(user?.bio)}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.headerButton, {backgroundColor: color.gray}]}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.buttonText, {color: color.text}]}>
              Chỉnh sửa trang cá nhân
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, {backgroundColor: color.gray}]}
            onPress={() => navigation.navigate('QRCode')}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.buttonText, {color: color.text}]}>
              Chia sẻ trang cá nhân
            </Text>
          </TouchableOpacity>
        </View>
        {/* Highlight Stories Component */}
        {userId && (
          <HighlightStoriesComponent
            key={userId}
            userId={userId}
            isOwnProfile={true}
          />
        )}
        <ModalCreate
          ref={modalCreateRef}
          onSelect={(id: string) => {
            switch (id) {
              case 'reels':
                navigation.navigate('AddPost', {type: 'video'});
                break;
              case 'post':
                navigation.navigate('AddPost');
                break;
              case 'story':
                navigation.navigate('UpStory');
                break;
              case 'highlight':
                navigation.navigate('Archive');
                break;
              case 'live':
                navigation.navigate('LiveStreamSetup');
                break;
              case 'ai':
                navigation.navigate('CreateWithAI');
                break;
              default:
                break;
            }
          }}
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

  const taggedPosts = useSelector((state: RootState) => state.taggedPosts.data);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'grid':
        return isSuccess && PostsItem && PostsItem.length > 0 ? (
          <PostsView data={PostsItem} />
        ) : (
          <LoadingPlaceholder />
        );
      case 'reels':
        return isSuccess && ReelsItem && ReelsItem.length > 0 ? (
          <ReelsView data={ReelsItem} />
        ) : (
          <LoadingPlaceholder />
        );
      case 'tags':
        return isSuccess && taggedPosts && taggedPosts.length > 0 ? (
          <TagsView data={taggedPosts as TaggedPost[]} />
        ) : (
          <LoadingPlaceholder />
        );
      default:
        return <LoadingPlaceholder />;
    }
  };

  const LoadingPlaceholder = () => (
    <View style={[styles.content, styles.centerItem, {height: 200}]}>
      <Text style={[styles.textno, {color: color.text}]}>Đang tải...</Text>
    </View>
  );

  useFocusEffect(
    useCallback(() => {
      if (userId && refreshToken) {
        dispatch(getPostsAndReelsOfUser({refreshToken, userId: userId}));
      }
    }, [dispatch, refreshToken, userId]),
  );

  const handleAddAccountPress = () => {
    setSwitchAccountVisible(false);
    requestAnimationFrame(() => {
      acModalRef.current?.open();
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {renderHeader()}
        {renderTabBar()}
        {renderContent()}
      </ScrollView>
      <SwitchAccount
        visible={isSwitchAccountVisible}
        onClose={() => setSwitchAccountVisible(false)}
        navigation={navigation}
        onAddAccountPress={handleAddAccountPress}
      />
      <ViewMore
        visible={isViewMoreVisible}
        onClose={() => setViewMoreVisible(false)}
        postId="123456"
      />
      <ACNavigateModal ref={acModalRef} />
    </SafeAreaView>
  );
};

export default Profile;