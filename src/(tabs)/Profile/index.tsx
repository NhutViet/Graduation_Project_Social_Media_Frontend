import React, {useState, useRef, useCallback} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {PostData} from '../../MockData/posts.mock';
import {highlights} from '../../MockData/story.mock';
import {CommentSection} from '../../../components/CommentSection';
import {SwitchAccount} from '../../../components/SwitchAccount';
import {
  PlusSquare,
  Menu,
  Grid,
  UserSquare2,
  Lock,
  ChevronDown,
  Share2,
  Moon,
} from 'lucide-react-native';
import {Styles} from '../../StyleSheet/Profile.Styles';
import {ViewMore} from '../../../components/ViewMore';

interface PostItem {
  id: string;
  image: string;
}

const Profile = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [selectedTab, setSelectedTab] = useState('grid');
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [isMoreVisible, setIsMoreVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isSwitchAccountVisible, setIsSwitchAccountVisible] = useState(false);

  const handlePresentModalPress = useCallback(() => {
    setIsMoreVisible(true);
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseModal = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsMoreVisible(false);
  }, []);

  const handleOpenSwitchAccount = () => {
    setIsSwitchAccountVisible(true);
  };

  const handleCloseSwitchAccount = () => {
    setIsSwitchAccountVisible(false);
  };

  const windowWidth = Dimensions.get('window').width;
  const itemSize = windowWidth / 3;
  const {styles} = Styles;

  const renderItem = ({item}: {item: PostItem}) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image
        source={{uri: item.image}}
        style={[
          styles.gridImage,
          {
            width: itemSize - 2,
            height: itemSize - 2,
          },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.header}>
        <View style={styles.usernameContainer}>
          <Lock size={16} color={color.text} />
          <TouchableOpacity onPress={handleOpenSwitchAccount}>
            <Text style={[styles.username, {color: color.text}]}>
              pingenriquez
            </Text>
          </TouchableOpacity>
          <ChevronDown size={16} color={color.text} />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setIsCommentVisible(!isCommentVisible);
            }}>
            <PlusSquare color={color.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Setting')}>
            <Menu color={color.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://www.smartsight.in/wp-content/uploads/2019/10/golang-1200x900.png',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.addStoryButton}>
              <Text style={styles.addStoryIcon}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: color.text}]}>66</Text>
              <Text style={[styles.statLabel, {color: color.text}]}>posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: color.text}]}>589</Text>
              <Text style={[styles.statLabel, {color: color.text}]}>
                followers
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: color.text}]}>526</Text>
              <Text style={[styles.statLabel, {color: color.text}]}>
                following
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={[styles.displayName, {color: color.text}]}>
            Ping Enriquez
          </Text>
          <View style={styles.modeContainer}>
            <Moon size={14} color={color.textSecondary} />
            <Text style={[styles.modeText, {color: color.textSecondary}]}>
              {' '}
              In quiet mode
            </Text>
          </View>
          <Text style={[styles.bioText, {color: color.text}]}>
            Bio written here
          </Text>
          <Text style={[styles.website, {color: color.blue}]}>
            dott.bio/pingenriquez
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.editButton, {backgroundColor: color.gray}]}
            onPress={handlePresentModalPress}>
            <Text style={[styles.buttonText, {color: color.text}]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareButton, {backgroundColor: color.gray}]}>
            <Text style={[styles.buttonText, {color: color.text}]}>
              Share Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, {backgroundColor: color.gray}]}>
            <Share2 size={18} color={color.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.highlightsContainer}>
          {highlights.map(highlight => (
            <View key={highlight.id} style={styles.highlightItem}>
              <View style={styles.highlightImageContainer}>
                <Image
                  source={{uri: highlight.image}}
                  style={styles.highlightImage}
                />
              </View>
              <Text style={[styles.highlightText, {color: color.text}]}>
                {highlight.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'grid' && styles.activeTab,
              {
                borderBottomColor:
                  selectedTab === 'grid' ? color.text : 'transparent',
              },
            ]}
            onPress={() => setSelectedTab('grid')}>
            <Grid color={color.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'tagged' && styles.activeTab,
              {
                borderBottomColor:
                  selectedTab === 'tagged' ? color.text : 'transparent',
              },
            ]}
            onPress={() => setSelectedTab('tagged')}>
            <UserSquare2 color={color.text} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.postsContainer}>
          <FlashList
            data={PostData}
            numColumns={3}
            estimatedItemSize={itemSize}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      {isCommentVisible && <CommentSection />}
      <ViewMore
        visible={isMoreVisible}
        onClose={handleCloseModal}
        postId="profile"
      />
      <SwitchAccount
        visible={isSwitchAccountVisible}
        onClose={handleCloseSwitchAccount}
      />
    </SafeAreaView>
  );
};

export default Profile;
