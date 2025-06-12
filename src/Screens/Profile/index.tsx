import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import {
  ChevronLeft,
  Lock,
  Ellipsis,
  Grid,
  UserSquare2,
  Video,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {UserMock} from '../../MockData/user.mock';
import {highlights} from '../../MockData/story.mock';
import {PostData} from '../../MockData/posts.mock';
import StoryComponent from './components/story.component';
import ActionButtons from './components/actionButton.component';
import UserInfo from './components/userInfo.component';
import {FlashList} from '@shopify/flash-list';
import {Styles} from '../../StyleSheet/Profile.Styles';
import { Modalize } from "react-native-modalize";
import { Portal } from 'react-native-portalize';
import OptionModal from "./components/optionModal"
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {
  fetchFollowers,
  fetchFollowing,
} from '../../../services/relationRedux/relationSlice';
import { getPublicProfile } from '../../../services/userRedux/userSlice';
import { clearPublicProfile } from '../../../services/userRedux/userReducer';

const ProfileComp = ({route}: any) => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const userID: string = route.params?.userID;
  const modalOptionRef = useRef<Modalize>(null);

  const openOptionModal = () => {
    modalOptionRef.current?.open();
  };

  const closeOptionModal = () => {
    modalOptionRef.current?.close();
  };
  
  const [isPrivate, setIsPrivate] = useState(UserMock.isPrivate);
  const togglePrivacy = useCallback(() => {
    setIsPrivate(prevState => !prevState);
  }, []);

  const [isFollowing, setIsFollowing] = useState(false);
  const toggleFollow = useCallback(() => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? 'Bỏ theo dõi' : 'Đã theo dõi',
      isFollowing
        ? 'Bạn đã bỏ theo dõi người dùng này.'
        : 'Bạn đã theo dõi người dùng này.',
    );
  }, [isFollowing]);

  const dispatch = useDispatch<AppDispatch>();
  const {followers, following, loading, error} = useSelector(
    (state: RootState) => state.relation,
  );
  const {
    publicProfile,
    isLoadingPublicProfile,
    isSuccessPublicProfile,
    isErrorPublicProfile,
    errorMessagePublicProfile
  } = useSelector((state: RootState) => state.user);

  const [isBlock, setIsBlock] = useState(false);

  useEffect(() => {
    if (userID) {
      // Clear previous profile data
      dispatch(clearPublicProfile());
      
      // Fetch new profile data
      Promise.all([
        dispatch(getPublicProfile({userId: userID})),
        dispatch(fetchFollowers({userID})),
        dispatch(fetchFollowing({userID})),
      ]).catch(error => {
        console.error('Error fetching data:', error);
      });
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearPublicProfile());
    };
  }, [dispatch, userID]);

   // Update following state when public profile is loaded
  useEffect(() => {
    if (publicProfile) {
      setIsFollowing(publicProfile.userFollowing);
      setIsBlock(publicProfile.userBlocked);
    }
  }, [publicProfile]);

  const renderPrivateContent = () => {
    return (
      <View style={styles.privateContainer}>
        <View style={styles.lockIconContainer}>
          <Lock size={50} color={Colors[theme].text} />
        </View>
        <Text style={styles.privateTitle}>Đây là tài khoản riêng tư</Text>
        <Text style={styles.privateDescription}>
          Theo dõi tài khoản này để thấy ảnh và video của họ.
        </Text>
      </View>
    );
  };

  const [activeTab, setActiveTab] = useState('grid');
  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[Styles.styles.gridItem, {backgroundColor: '#f0f0f0'}]}>
      <Image
        source={{uri: item.image}}
        style={[
          Styles.styles.gridImage,
          {
            width: Styles.itemSize - 2,
            height: Styles.itemSize - 2,
            borderRadius: 1,
          },
        ]}
      />
      {activeTab !== 'grid' && (
        <View style={styles.overlayStyle}>
          {activeTab === 'reels' && <Video color="white" size={20} />}
          {activeTab === 'tagged' && <UserSquare2 color="white" size={20} />}
        </View>
      )}
    </TouchableOpacity>
  );
  const renderTabContent = () => {
    if (!isPrivate) {
      return renderPrivateContent();
    }
    return (
      <FlashList
        data={PostData}
        numColumns={3}
        estimatedItemSize={Styles.itemSize}
        scrollEnabled={true}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        extraData={activeTab}
        contentContainerStyle={{paddingBottom: 20}}
      />
    );
  };

  // Show loading indicator while fetching profile
    if (isLoadingPublicProfile) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.Header}>
            <TouchableOpacity
              style={{alignItems: 'center', paddingRight: 12}}
              onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color={Colors[theme].text} />
            </TouchableOpacity>
            <Text style={styles.headTitle}>Profile</Text>
            <View style={styles.SectionRight}>
              <TouchableOpacity>
                <Ellipsis size={24} color={Colors[theme].text} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        </SafeAreaView>
      );
    }

    // Show error message if failed to load profile
    if (isErrorPublicProfile) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.Header}>
            <TouchableOpacity
              style={{alignItems: 'center', paddingRight: 12}}
              onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color={Colors[theme].text} />
            </TouchableOpacity>
            <Text style={styles.headTitle}>Profile</Text>
            <View style={styles.SectionRight}>
              <TouchableOpacity>
                <Ellipsis size={24} color={Colors[theme].text} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessagePublicProfile}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => dispatch(getPublicProfile({userId: userID}))}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

  // Use public profile data if available, otherwise fall back to mock data
  const profileData = publicProfile || {
    handleName: UserMock.handleName,
    username: UserMock.name,
    bio: UserMock.bio,
    profilePic: UserMock.avatar,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={{alignItems: 'center', paddingRight: 12}}
            onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color={Colors[theme].text} />
          </TouchableOpacity>
          <Text style={styles.headTitle}>{profileData.handleName}</Text>
          <View style={styles.SectionRight}>
            <TouchableOpacity onPress={openOptionModal}>
              <Ellipsis size={24} color={Colors[theme].text} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Header Info */}
        <View>
          <UserInfo
            name={profileData.username}
            followers={followers.length}
            following={following.length}
            posts={UserMock.posts}
            avatar={profileData.profilePic}
            bio={profileData.bio}
            theme={theme}
          />
        </View>
        {/* Action Buttons */}
        <ActionButtons
          onFollowPress={toggleFollow}
          onMessagePress={togglePrivacy}
          theme={theme}
        />
        {/* Story Highlights */}
        {!isBlock && (
          <StoryComponent isPrivate={isPrivate} highlights={highlights} />
        )}
        {/* Posts Grid/Video Tabs */}
        {!isBlock && (
          <>
            <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              disabled={!isPrivate}
              onPress={() => {
                setActiveTab('grid');
              }}
              style={[
                styles.tab,
                activeTab === 'grid' && styles.activeTab,
                !isPrivate && {opacity: 0.5},
              ]}>
              <Grid
                size={26}
                color={
                  activeTab === 'grid' ? Colors[theme].text : Colors.textSecondary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!isPrivate}
              onPress={() => {
                setActiveTab('reels');
              }}
              style={[
                styles.tab,
                activeTab === 'reels' && styles.activeTab,
                !isPrivate && {opacity: 0.5},
              ]}>
              <Video
                size={26}
                color={
                  activeTab === 'reels'
                    ? Colors[theme].text
                    : Colors.textSecondary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!isPrivate}
              onPress={() => {
                setActiveTab('tagged');
              }}
              style={[
                styles.tab,
                activeTab === 'tagged' && styles.activeTab,
                !isPrivate && {opacity: 0.5},
              ]}>
              <UserSquare2
                size={26}
                color={
                  activeTab === 'tagged'
                    ? Colors[theme].text
                    : Colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>
          {/* Posts Grid */}
          {renderTabContent()}
          </>
        )}

        <Portal>
          <OptionModal 
          ref={modalOptionRef} 
          userID={userID} 
          isBlock={isBlock} 
          onBlockChange={(newState) => setIsBlock(newState)}
          />
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileComp;

export const createStyles = (theme: 'light' | 'dark') => {
  const color = Colors[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    header: {
      flexDirection: 'row',
      padding: 15,
      alignItems: 'center',
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    statsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginLeft: 20,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      color: color.text,
    },
    statLabel: {
      fontSize: 13,
      color: Colors.textSecondary,
    },
    actionButtons: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      marginBottom: 12,
      gap: 8,
    },
    highlightsContainer: {
      padding: 15,
    },
    highlightItem: {
      alignItems: 'center',
      marginRight: 15,
    },
    highlightCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    highlightImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    highlightTitle: {
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
      color: color.text,
    },
    tabsContainer: {
      flex: 1,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: Colors.border,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      padding: 10,
    },
    postsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    privateContainer: {
      alignItems: 'center',
      padding: 20,
      marginTop: 40,
    },
    lockIconContainer: {
      width: 80,
      height: 80,
      borderWidth: 2,
      borderColor: color.text,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    privateTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: color.text,
      marginBottom: 10,
    },
    privateDescription: {
      fontSize: 14,
      color: color.textSecondary,
      textAlign: 'center',
    },
    linkText: {
      color: Colors.blue,
      fontSize: 14,
    },
    suggestedSection: {
      padding: 15,
    },
    suggestedHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    suggestedTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: color.text,
    },
    seeAllText: {
      color: Colors.blue,
      fontSize: 14,
    },
    activeTab: {
      borderBottomWidth: 1,
      borderBottomColor: color.text,
    },
    headTitle: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontSize: 20,
      fontWeight: '500',
      color: color.text,
    },
    Header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
    },
    SectionRight: {
      flex: 1,
      paddingRight: 12,
      alignItems: 'flex-end',
    },
    overlayStyle: {
      position: 'absolute' as const,
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 4,
      padding: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: color.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: Colors.white,
      fontWeight: '600',
    },
  });
};
