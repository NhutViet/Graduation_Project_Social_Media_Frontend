import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {ChevronLeft, Grid, Lock, Video, Ellipsis} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {UserMock} from '../src/MockData/user.mock';
import {highlights} from '../src/MockData/story.mock';
import {PostData} from '../src/MockData/posts.mock';

const ProfileComp = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const [isPrivate, setIsPrivate] = useState(UserMock.isPrivate);
  const togglePrivacy = async () => {
    setIsPrivate(prevState => !prevState);
  };

  const [isFollowing, setIsFollowing] = useState(false);
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? 'Unfollowed' : 'Followed',
      isFollowing
        ? 'You have unfollowed this user.'
        : 'You have followed this user.',
    );
  };

  const renderPrivateContent = () => {
    return (
      <View style={styles.privateContainer}>
        <View style={styles.lockIconContainer}>
          <Lock size={50} color={Colors[theme].text} />
        </View>
        <Text style={styles.privateTitle}>This account is private</Text>
        <Text style={styles.privateDescription}>
          Follow this account to see their photos and videos.
        </Text>
      </View>
    );
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
          <Text style={styles.headTitle}>{UserMock.handleName}</Text>
          <View style={styles.SectionRight}>
            <TouchableOpacity>
              {/* onPress={() => navigation.goBack()}> */}
              <Ellipsis size={24} color={Colors[theme].text} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Header Info */}
        <View style={styles.header}>
          <Image source={{uri: UserMock.avatar}} style={styles.profileImage} />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>330</Text>
              <Text style={styles.statLabel}>posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>54K</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>266</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bioContainer}>
          <Text style={styles.username}>Mama S Bake House</Text>
          <Text style={styles.bioText}>Oubao Enterprise (SA0585438-P)</Text>
          <Text style={styles.bioText}>
            Find us @ Night Market from Monday to Sunday
          </Text>
          <Text style={styles.bioText}>5pm- 10pm</Text>
          <Text style={styles.bioText}>
            Dms : slow response (order at least a day in advance)
          </Text>
        </View>

        {/* Action Buttons */}
        {isPrivate === false ? (
          <View style={{paddingHorizontal: 12, marginBottom: 12}}>
            <TouchableOpacity
              style={styles.followButton}
              onPress={togglePrivacy}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.followButton}
              onPress={togglePrivacy}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Story Highlights */}
        {isPrivate === false ? (
          <View />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.highlightsContainer}>
            {highlights.map((highlight: any) => (
              <View key={highlight.id} style={styles.highlightItem}>
                <View style={styles.highlightCircle}>
                  <Image
                    source={{uri: highlight.image}}
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.highlightTitle}>{highlight.title}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Posts Grid/Video Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.tab}>
            <Grid size={26} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Video size={26} />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {/* Grid items will be added here */}
        </View>
        {isPrivate === false ? (
          renderPrivateContent()
        ) : (
          <View style={styles.postsGrid} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileComp;

const createStyles = (theme: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      color: theme.text,
    },
    statLabel: {
      fontSize: 13,
      color: Colors.textSecondary,
    },
    bioContainer: {
      padding: 15,
    },
    username: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    bioText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.text,
    },
    actionButtons: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      marginBottom: 12,
      gap: 8,
    },
    followButton: {
      flex: 1,
      backgroundColor: Colors.primary,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    followButtonText: {
      color: Colors.white,
      fontWeight: '600',
    },
    messageButton: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
    },
    messageButtonText: {
      color: theme.text,
      fontWeight: '600',
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
      color: theme.text,
    },
    tabsContainer: {
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
      borderColor: theme.text,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    privateTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    privateDescription: {
      fontSize: 14,
      color: theme.textSecondary,
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
      color: theme.text,
    },
    seeAllText: {
      color: Colors.blue,
      fontSize: 14,
    },
    activeTab: {
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
    },
    headTitle: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontSize: 20,
      fontWeight: '500',
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
  });
};
