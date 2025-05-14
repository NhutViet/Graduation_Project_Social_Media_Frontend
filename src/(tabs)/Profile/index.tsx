import React, {useRef, useState} from 'react';
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
  Tag,
} from 'lucide-react-native';
import {Styles} from '../../StyleSheet/Profile.Styles';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SwitchAccount} from '../../../components/SwitchAccount';
import {ViewMore} from '../../../components/ViewMore';

const HEADER_HEIGHT = 400;

const Tab = createMaterialTopTabNavigator();

const PostsView = ({data}: {data: any[]}) => {
  return (
    <FlashList
      data={data}
      numColumns={3}
      estimatedItemSize={Styles.itemSize}
      scrollEnabled={true}
      renderItem={({item}) => (
        <TouchableOpacity style={Styles.styles.gridItem}>
          <Image
            source={{uri: item.image}}
            style={[
              Styles.styles.gridImage,
              {width: Styles.itemSize - 2, height: Styles.itemSize - 2},
            ]}
          />
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};
const ReelsView = ({data}: {data: any[]}) => {
  return (
    <FlashList
      data={data}
      numColumns={3}
      estimatedItemSize={Styles.itemSize}
      scrollEnabled={true}
      renderItem={({item}) => (
        <TouchableOpacity style={Styles.styles.gridItem}>
          <Image
            source={{uri: item.image}}
            style={[
              Styles.styles.gridImage,
              {width: Styles.itemSize - 2, height: Styles.itemSize - 2},
            ]}
          />
          <View style={Styles.styles.reelOverlay}>
            <Video color="white" size={20} />
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};
const TaggedView = ({data}: {data: any[]}) => {
  return (
    <FlashList
      data={data}
      numColumns={3}
      estimatedItemSize={Styles.itemSize}
      scrollEnabled={true}
      renderItem={({item}) => (
        <TouchableOpacity style={Styles.styles.gridItem}>
          <Image
            source={{uri: item.image}}
            style={[
              Styles.styles.gridImage,
              {width: Styles.itemSize - 2, height: Styles.itemSize - 2},
            ]}
          />
          <View style={Styles.styles.tagOverlay}>
            <Tag color="white" size={20} />
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};

const Profile = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const {styles} = Styles;

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
    <View key={item.id} style={styles.highlightItem}>
      <View style={styles.highlightImageContainer}>
        <Image source={{uri: item.image}} style={styles.highlightImage} />
      </View>
      <Text style={[styles.highlightText, {color: color.text}]}>
        {item.title}
      </Text>
    </View>
  );

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
              pingenriquez
            </Text>
          </TouchableOpacity>
          <ChevronDown size={16} color={color.text} />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handlePlusSquarePress}>
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
            <TouchableOpacity
              onPress={() => navigation.navigate('FollowersScreen')}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, {color: color.text}]}>
                  589
                </Text>
                <Text style={[styles.statLabel, {color: color.text}]}>
                  followers
                </Text>
              </View>
            </TouchableOpacity>
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
            onPress={() => setCommentVisible(true)}>
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
            style={[styles.optionButton, {backgroundColor: color.gray}]} onPress={() => navigation.navigate('Swipe')}>
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
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}>
        {renderHeader()}

        <View style={{height: 800}}>
          <Tab.Navigator
            screenOptions={{
              tabBarIndicatorStyle: {
                backgroundColor: color.text,
              },
              tabBarShowLabel: false,
              tabBarShowIcon: true,
              tabBarStyle: {
                elevation: 0,
                shadowOpacity: 0,
                backgroundColor: color.background,
              },
            }}>
            <Tab.Screen
              name="Grid"
              options={{
                tabBarIcon: ({focused}) => (
                  <Grid
                    color={focused ? color.text : color.textSecondary}
                    size={24}
                  />
                ),
              }}
              children={() => <PostsView data={PostData} />}
            />
            <Tab.Screen
              name="Reels"
              options={{
                tabBarIcon: ({focused}) => (
                  <Video
                    color={focused ? color.text : color.textSecondary}
                    size={24}
                  />
                ),
              }}
              children={() => <ReelsView data={PostData} />}
            />
            <Tab.Screen
              name="Tagged"
              options={{
                tabBarIcon: ({focused}) => (
                  <UserSquare2
                    color={focused ? color.text : color.textSecondary}
                    size={24}
                  />
                ),
              }}
              children={() => <TaggedView data={PostData} />}
            />
          </Tab.Navigator>
        </View>
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
