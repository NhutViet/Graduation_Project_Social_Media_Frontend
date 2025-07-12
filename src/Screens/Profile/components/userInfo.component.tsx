import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Theme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {UserIcon} from 'lucide-react-native';

interface UserInfoProps {
  name: string;
  followers: number;
  following: number;
  // posts: {id: string; image: string}[];
  posts: number;
  avatar?: string;
  bio?: string;
  theme: Theme;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  followers,
  following,
  posts,
  avatar,
  bio,
  theme,
  onFollowersPress,
  onFollowingPress,
}) => {
  const navigation: any = useNavigation();
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
        {avatar ? (
          <Image source={{uri: avatar}} style={styles.profileImage} />
        ) : (
          <UserIcon size={80} color={color.text} />
        )}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, {color: color.text}]}>
              {posts}
            </Text>
            <Text style={styles.statLabel}>bài viết</Text>
          </View>
          <TouchableOpacity onPress={onFollowersPress} style={styles.statItem}>
            <Text style={[styles.statNumber, {color: color.text}]}>
              {formatFollowers(followers)}
            </Text>
            <Text style={styles.statLabel}>người theo dõi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onFollowingPress} style={styles.statItem}>
            <Text style={[styles.statNumber, {color: color.text}]}>
              {following}
            </Text>
            <Text style={styles.statLabel}>đang theo dõi</Text>
          </TouchableOpacity>
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
