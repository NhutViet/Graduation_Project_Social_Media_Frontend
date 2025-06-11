import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import {Theme} from '../../../util/ThemeContext';

interface ActionProps {
  onFollowPress: () => void;
  onMessagePress: () => void;
  theme: Theme;
  isFollowing?: boolean;
}

const ActionButtons: React.FC<ActionProps> = ({
  onFollowPress,
  onMessagePress,
  theme,
  isFollowing = false,
}) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={[styles.followButton, isFollowing && styles.followingButton]} onPress={onFollowPress}>
        <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>{isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.messageButton} onPress={onMessagePress}>
        <Text style={[styles.messageButtonText, {color: Colors[theme].text}]}>
          Nhắn tin
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
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
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageButtonText: {
    fontWeight: '600',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  followingButtonText: {
    color: Colors.textSecondary,
  },
});

export default ActionButtons;
