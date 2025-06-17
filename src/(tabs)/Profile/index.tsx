/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Image,
  // Animated,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {highlights, HighlightItem} from '../../MockData/story.mock';
import {
  PlusSquare,
  Menu,
  Grid,
  Lock,
  ChevronDown,
  Share2,
  Moon,
  Video,
} from 'lucide-react-native';
import {Styles} from '../../StyleSheet/Profile.Styles';
import {SwitchAccount} from '../../../components/SwitchAccount';
import {ViewMore} from '../../../components/ViewMore';
import ModalCreate from './components/ModalCreate';
import {PostsView} from './components/PostView.component';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {
  fetchFollowers,
  fetchFollowing,
} from '../../../services/relationRedux/relationSlice';
import {
  getPostsOfUser,
  getReelsOfUser,
} from '../../../services/postUserRedux/postUserSlice';

const Profile = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const {styles} = Styles;
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch<AppDispatch>();
  const userID = useSelector((state: RootState) => state.user?.user?._id);
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

  const renderStories = ({item}: {item: HighlightItem}) => (
    <TouchableOpacity
      key={item.id}
      style={styles.highlightItem}
      onPress={() => handleUserPress(item)}>
      <View style={styles.highlightImageContainer}>
        <Image source={{uri: item.image}} style={styles.highlightImage} />
      </View>
      <Text style={[styles.highlightText, {color: color.text}]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  // data mẫu
  const [dataUser, setDataUser] = useState([
    {
      id: 1,
      name: 'user1',
      image:
        'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
      status: 1,
    },
    {
      id: 2,
      name: 'user2',
      image:
        'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
      status: 1,
    },
    {
      id: 3,
      name: 'user3',
      image:
        'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
      status: 0,
    },
    {
      id: 4,
      name: 'user4',
      image:
        'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
      status: 0,
    },
  ]);

  useEffect(() => {
    if (userID) {
      // gọi 2 api followers, following
      Promise.all([
        dispatch(fetchFollowers({userID})),
        dispatch(fetchFollowing({userID})),
      ]).catch(error => {
        console.error('Error fetching relations:', error);
      });
    }
  }, [dispatch, userID]);

  useEffect(() => {
    const exists = dataUser.some(user => user.name === 'Tin của tôi');
    if (!exists) {
      const newUser = {
        id: Date.now(),
        name: 'Tin của tôi',
        image:
          'https://i.pinimg.com/736x/07/03/c7/0703c771ceecfd6142ce0ca726c056e7.jpg',
        status: 1,
      };
      setDataUser([newUser, ...dataUser]);
    }
  }, [dataUser]);

  const handleUserPress = (user: any) => {
    // Cập nhật status của user được nhấn thành 0
    setDataUser(prevData =>
      prevData.map(item => (item.id === user.id ? {...item, status: 0} : item)),
    );
    // Điều hướng đến SeenStoryOwner
    if (user.id === '1') {
      navigation.navigate('EditHighlightStory');
    } else {
      navigation.navigate('SeenStoryOwner', {selectedItem: user});
    }
  };

  const [activeTab, setActiveTab] = useState('grid');

  const renderHeader = () => (
    <View>
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

      <View>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            {user?.profilePic && (
              <Image
                source={{
                  uri: user?.profilePic,
                }}
                style={styles.avatar}
              />
            )}
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
                  {followers.length}
                </Text>
                <Text style={[styles.statLabel, {color: color.text}]}>
                  người theo dõi
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, {color: color.text}]}>
                  {following.length}
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

        <View style={styles.highlightsContainer}>
          <FlashList
            horizontal
            data={highlights}
            renderItem={({item}) => renderStories({item})}
            estimatedItemSize={50}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
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
    </View>
  );

  useEffect(() => {
    // Lần đầu tiên: gọi cả hai API
    dispatch(getPostsOfUser({refreshToken}));
    dispatch(getReelsOfUser({refreshToken}));
  }, [dispatch, refreshToken]);

  useEffect(() => {
    if (activeTab === 'grid') {
      dispatch(getPostsOfUser({refreshToken}));
    } else if (activeTab === 'reels') {
      dispatch(getReelsOfUser({refreshToken}));
    }
  }, [activeTab, dispatch, refreshToken]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <FlashList
        data={activeTab === 'grid' ? PostsItem : ReelsItem}
        renderItem={({item}) => <PostsView data={[item]} />}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderTabBar()}
          </>
        }
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        numColumns={3}
        keyboardShouldPersistTaps="handled"
      />
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
