import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import {Theme} from '../../../util/ThemeContext';

interface ActionProps {
  onFollowPress: () => void;
  onMessagePress: () => void;
  theme: Theme;
}

const ActionButtons: React.FC<ActionProps> = ({
  onFollowPress,
  onMessagePress,
  theme,
}) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.followButton} onPress={onFollowPress}>
        <Text style={styles.followButtonText}>Theo dõi</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.messageButton} onPress={onMessagePress}>
        <Text style={[styles.messageButtonText, {color: Colors[theme].text}]}>
          Tin nhắn
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
});

export default ActionButtons;
