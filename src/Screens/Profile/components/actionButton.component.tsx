import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import {Theme} from '../../../util/ThemeContext';

interface ActionProps {
  onFollowPress: () => void;
  onMessagePress: () => void;
  onUnblockPress: () => void;
  theme: Theme;
  isFollowing?: boolean;
  isBlocked? : boolean;
}

const ActionButtons: React.FC<ActionProps> = ({
  onFollowPress,
  onMessagePress,
  onUnblockPress,
  theme,
  isFollowing: initialIsFollowing,
  isBlocked
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);
  
  return (
    <View style={styles.actionButtons}>
      {!isBlocked && (
        <TouchableOpacity style={[styles.followButton, isFollowing && styles.followingButton,]} onPress={onFollowPress}>
          <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText,]}>
            {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
          </Text>
        </TouchableOpacity>
      )}
      {isBlocked &&
      <TouchableOpacity style={styles.followButton} onPress={onUnblockPress}>
        <Text style={styles.followButtonText}>Bỏ chặn</Text>
      </TouchableOpacity>
      }
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
