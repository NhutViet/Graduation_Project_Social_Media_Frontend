import React, {useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {PostData} from '../../MockData/posts.mock';
import {highlights, HighlightItem} from '../../MockData/story.mock';
import {
  PlusSquare,
  Menu,
  Grid,
  UserSquare2,
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
import {
  PostsView,
  ReelsView,
  TaggedView,
} from './components/PostView.component';
import {useSelector} from 'react-redux';
import {RootState} from '../../../services/store';

const HEADER_HEIGHT = 400;

const Profile = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const {styles} = Styles;
  const user = useSelector((state: RootState) => state.user.user);

  const [visibleModalCreate, setVisibleModalCreate] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const [isSwitchAccountVisible, setSwitchAccountVisible] = useState(false);
  const handleUsernamePress = () => {
    setSwitchAccountVisible(true);
  };

  const [isViewMoreVisible, setViewMoreVisible] = useState(false);
  const handlePlusSquarePress = () => {
    setViewMoreVisible(true);
  };

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
  }, []);

  const handleUserPress = (user: any) => {
    console.log('Navigating to SeenStory with user:', user);
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

  const renderHeader = () => (
    <Animated.View
      style={{
        transform: [{translateY}],
        zIndex: 0.6,
      }}>
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
            <Image
              source={{
                uri: user?.profilePic,
              }}
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
              <Text style={[styles.statNumber, {color: color.text}]}>66</Text>
              <Text style={[styles.statLabel, {color: color.text}]}>bài viết</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('FollowersScreen')}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, {color: color.text}]}>
                  589
                </Text>
                <Text style={[styles.statLabel, {color: color.text}]}>
                  người theo dõi
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.naviate('FollowersScreen')}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, {color: color.text}]}>
                  526
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
            <Text style={[styles.modeText, {color: color.textSecondary}]}> {/* in quiet mode */}
              {' '}
              Ở chế độ lặng
            </Text>
          </View>
          <Text style={[styles.bioText, {color: color.text}]}>
            Xem mô tả của tôi ở
          </Text>
          <Text style={[styles.website, {color: color.blue}]}>
            dott.bio/pingenriquez
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.editButton, {backgroundColor: color.gray}]}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.buttonText, {color: color.text}]}>
              Chỉnh sửa trang cá nhân
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareButton, {backgroundColor: color.gray}]}
            onPress={() => navigation.navigate('QRCode')}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.buttonText, {color: color.text}]}>
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
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <ModalCreate
          visible={visibleModalCreate}
          onClose={() => setVisibleModalCreate(false)}
          onSelect={id => console.log('Selected:', id)}
        />
      </View>
    </Animated.View>
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
          activeTab === 'tagged' && styles.activeTab,
          {borderBottomColor: color.text},
        ]}
        onPress={() => setActiveTab('tagged')}>
        <UserSquare2
          color={activeTab === 'tagged' ? color.text : color.textSecondary}
          size={24}
        />
      </TouchableOpacity>
    </View>
  );

  const [activeTab, setActiveTab] = useState('grid');
  const renderContent = () => {
    switch (activeTab) {
      case 'grid':
        return <PostsView data={PostData} />;
      case 'reels':
        return <ReelsView data={PostData} />;
      case 'tagged':
        return <TaggedView data={PostData} />;
      default:
        return <PostsView data={PostData} />;
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}>
        {renderHeader()}
        {renderTabBar()}
        {renderContent()}
      </Animated.ScrollView>
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
