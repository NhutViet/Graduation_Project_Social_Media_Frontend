import React from 'react';
import {View, Text, Switch, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';

export interface SwitchOption {
  id: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

export interface BottomSheetNotificationProps {
  title: string;
  options: SwitchOption[];
  onClose: () => void;
}

const BottomSheetNotification: React.FC<BottomSheetNotificationProps> = ({
  title,
  options,
  onClose,
}) => {
  const {theme} = useTheme();
  const palette = Colors[theme];

  return (
    <View style={[styles.container, {backgroundColor: palette.transparent}]}>
      <Text style={[styles.title, {color: palette.text}]}>{title}</Text>
      <View style={[styles.separator, {backgroundColor: palette.text}]} />

      {options.map((opt, idx) => (
        <View key={opt.id}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={[styles.label, {color: palette.text}]}>
                {opt.label}
              </Text>
              {opt.description && (
                <Text
                  style={[styles.description, {color: palette.textSecondary}]}>
                  {opt.description}
                </Text>
              )}
            </View>
            <Switch
              value={opt.value}
              onValueChange={opt.onValueChange}
              trackColor={{false: '#ccc', true: palette.primary}}
              thumbColor={opt.value ? palette.primary : '#fff'}
            />
          </View>
          {idx < options.length - 1 && (
            <View
              style={[styles.thickSeparator, {backgroundColor: palette.text}]}
            />
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.closeButton]}
        onPress={onClose}
        activeOpacity={0.7}>
        <Text style={[styles.closeText, {color: palette.primary}]}>Đóng</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomSheetNotification;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  thickSeparator: {
    height: 1,
    marginVertical: 8,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
