import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useBottomSheetStyles } from '../src/StyleSheet/BottomSheetStyles';
import { useTheme } from '../src/util/ThemeContext';
import { Colors } from '../assets/color/Colors';

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
}) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const styles = useBottomSheetStyles();

  return (
    <View style={[styles.ns_container, { backgroundColor: palette.background }]}>  
      <Text style={[styles.ns_title, { color: palette.text }]}>{title}</Text>
      <View style={[styles.ns_separator, { backgroundColor: palette.lightDark }]} />

      {options.map((opt, idx) => (
        <View key={opt.id}>
          <View style={styles.ns_choiceRow}>
            <View style={styles.ns_choiceTextContainer}>
              <Text style={[styles.ns_choiceLabel, { color: palette.text }]}>  
                {opt.label}
              </Text>
              {opt.description ? (
                <Text style={[styles.ns_choiceDescription, { color: palette.lightDark }]}>  
                  {opt.description}
                </Text>
              ) : null}
            </View>
            <Switch
              style={styles.ns_switch}
              value={opt.value}
              onValueChange={opt.onValueChange}
            />
          </View>
          {idx === 1 && (
            <View style={[styles.ns_thickSeparator, { backgroundColor: palette.lightDark }]} />
          )}
        </View>
      ))}
    </View>
  );
};

export default BottomSheetNotification;