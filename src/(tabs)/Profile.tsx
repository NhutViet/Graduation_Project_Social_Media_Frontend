import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import {useTheme} from '../util/ThemeContext';
import {Colors} from '../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import styles, {itemSize} from '../StyleSheet/Profile.Styles';

const Profile = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];

  // Thêm state để quản lý tab hiện tại
  const [selectedTab, setSelectedTab] = useState('grid');

  // Mock data cho grid posts
  const gridPosts = [
    {id: '1', image: 'https://picsum.photos/300/300?random=1'},
    {id: '2', image: 'https://picsum.photos/300/300?random=2'},
    {id: '3', image: 'https://picsum.photos/300/300?random=3'},
    {id: '4', image: 'https://picsum.photos/300/300?random=4'},
    {id: '5', image: 'https://picsum.photos/300/300?random=5'},
    {id: '6', image: 'https://picsum.photos/300/300?random=6'},
    // Thêm nhiều posts khác nếu cần
  ];

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
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={require('../../assets/icon/post.png')}
                style={[styles.icon, {tintColor: color.text}]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
              <Image
                source={require('../../assets/icon/Menu.png')}
                style={[styles.icon, {tintColor: color.text}]}
              />
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
                  selectedTab === 'grid' && styles.activeTab,
                ]}
                onPress={() => setSelectedTab('grid')}>
                <Image
                  source={require('../../assets/icon/grid.png')}
                  style={[styles.tabIcon, {tintColor: color.text}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'tagged' && styles.activeTab,
                ]}
                onPress={() => setSelectedTab('tagged')}>
                <Image
                  source={require('../../assets/icon/tagged.png')}
                  style={[styles.tabIcon, {tintColor: color.text}]}
                />
              </TouchableOpacity>
            </View>

            {/* Grid View */}
            <FlatList
              data={gridPosts}
              numColumns={3}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    width: itemSize,
                    height: itemSize,
                    padding: 1,
                  }}>
                  <Image
                    source={{uri: item.image}}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
