import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../util/ThemeContext';
import {Colors} from '../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import styles, {itemSize} from '../StyleSheet/Profile.Styles';
import {FlashList} from '@shopify/flash-list';
import {PostData} from '../mockData/posts.mock';
import {PlusSquare, Menu, Grid, UserSquare2} from 'lucide-react-native';
import CommentSection from '../../components/CommentSection';

const Profile = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];

  // Thêm state để quản lý tab hiện tại
  const [selectedTab, setSelectedTab] = useState('grid');

  // Mock data cho grid posts
  const gridPosts = PostData;

  const [showComments, setShowComments] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const toggleComments = () => {
    if (showComments) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowComments(false));
    } else {
      setShowComments(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.username, {color: color.text}]}>
            pingenriquez
          </Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleComments}>
              <PlusSquare color={color.text} size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
              <Menu color={color.text} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: 'https://miro.medium.com/v2/resize:fit:512/format:webp/1*cWqak8OijbTerY420wRgNQ.png',
              }}
              resizeMode="cover"
              style={styles.profileImage}
            />

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, {color: color.text}]}>66</Text>
                <Text style={[styles.statLabel, {color: color.text}]}>
                  posts
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, {color: color.text}]}>
                  589
                </Text>
                <Text style={[styles.statLabel, {color: color.text}]}>
                  followers
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, {color: color.text}]}>
                  526
                </Text>
                <Text style={[styles.statLabel, {color: color.text}]}>
                  following
                </Text>
              </View>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            <Text style={[styles.displayName, {color: color.text}]}>
              Ping Enriquez
            </Text>
            <Text style={[styles.bioText, {color: color.text}]}>
              In quiet mode
            </Text>
            <Text style={[styles.bioLink, {color: color.text}]}>
              dott.bio/pingenriquez
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={[styles.buttonText, {color: color.text}]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={[styles.buttonText, {color: color.text}]}>
                Share Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Grid Posts */}
          <View style={styles.postsSection}>
            {/* Tab Buttons */}
            <View style={styles.tabButtons}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'grid' && [
                    styles.activeTab,
                    {borderTopColor: color.text},
                  ],
                ]}
                onPress={() => setSelectedTab('grid')}>
                <Grid color={color.text} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'tagged' && [
                    styles.activeTab,
                    {borderTopColor: color.text},
                  ],
                ]}
                onPress={() => setSelectedTab('tagged')}>
                <UserSquare2 color={color.text} size={24} />
              </TouchableOpacity>
            </View>
          </View>
          <FlashList
            data={gridPosts}
            numColumns={3}
            estimatedItemSize={itemSize}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </ScrollView>
      </View>

      {showComments && (
        <Animated.View
          style={[
            modalStyles.commentsContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Dimensions.get('window').height, 0],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            style={modalStyles.modalOverlay}
            activeOpacity={1}
            onPress={toggleComments}>
            <View style={{backgroundColor: color.background}}>
              <CommentSection />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const renderItem = ({item}: {item: {id: string; image: string}}) => (
  <TouchableOpacity style={styles.tabLabel}>
    <View style={styles.imageContainer}>
      <Image
        source={{uri: item.image}}
        style={styles.tabLabelImage}
        resizeMode="cover"
      />
    </View>
  </TouchableOpacity>
);

// Đổi tên biến styles mới thành modalStyles
const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  commentsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Dimensions.get('window').height * 0.8,
  },
});
