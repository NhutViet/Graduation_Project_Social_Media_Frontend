import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Theme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

interface UserInfoProps {
  name: string;
  followers: number;
  following: number;
  posts: {id: string; image: string}[];
  avatar: string;
  bio?: string;
  theme: Theme;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  followers,
  following,
  posts,
  avatar,
  bio,
  theme,
}) => {
  const color = Colors[theme];
  const formatFollowers = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <View>
      <View style={styles.header}>
        <Image source={{uri: avatar}} style={styles.profileImage} />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, {color: color.text}]}>
              {posts.length}
            </Text>
            <Text style={styles.statLabel}>bài viết</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, {color: color.text}]}>
              {formatFollowers(followers)}
            </Text>
            <Text style={styles.statLabel}>người theo dõi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, {color: color.text}]}>
              {following}
            </Text>
            <Text style={styles.statLabel}>đang theo dõi</Text>
          </View>
        </View>
      </View>
      <View style={styles.bioContainer}>
        <Text style={[styles.username, {color: color.text}]}>{name}</Text>
        <Text style={[styles.bioText, {color: color.text}]}>{bio}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 12,
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
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bioContainer: {
    padding: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default UserInfo;
