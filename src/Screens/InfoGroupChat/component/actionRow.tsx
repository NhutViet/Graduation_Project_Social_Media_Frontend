import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LucideProps } from 'lucide-react-native';
import { Colors } from '@assets/color/Colors';

interface ActionItem {
  Icon: React.FC<LucideProps>;
  text: string;
  onPress: () => void;
}

interface ActionRowProps {
  actions: ActionItem[];
  theme: 'light' | 'dark';
}

export const ActionRow = memo(({ actions, theme }: ActionRowProps) => {
  const color = Colors[theme];
  return (
    <View style={styles.actionRow}>
      {actions.map(({ Icon, text, onPress }) => (
        <TouchableOpacity key={text} style={styles.actionItem} onPress={onPress}>
          <Icon size={20} color={color.text} />
          <Text style={[styles.actionText, { color: color.text }]}>{text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
});
