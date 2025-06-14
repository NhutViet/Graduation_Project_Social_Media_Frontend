import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useBottomSheetStyles } from '../src/StyleSheet/BottomSheetStyles';
import { useTheme } from '../src/util/ThemeContext';
import { Colors } from '../assets/color/Colors';

export interface IntentionOptionConfig {
  id: string;
  label: string;
}

export interface BottomSheetIntentionsProps {
  title: string;
  subtitle: string;
  content: string;
  options: IntentionOptionConfig[];
  onSelect: (id: string) => void;
}

const BottomSheetIntentions: React.FC<BottomSheetIntentionsProps> = ({
  title,
  subtitle,
  content,
  options,
  onSelect,
}) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const styles = useBottomSheetStyles();

  const handlePress = (id: string) => {
    onSelect(id);
  };

  return (
    <View style={styles.intentionContainer}>
      <Text style={styles.intentionTitle}>{title}</Text>
      <View style={styles.intentionBorder} />
      <View style={styles.innerContainer}>
        <Text style={styles.intentionSubtitle}>{subtitle}</Text>
        <Text style={styles.intentionContent}>{content}</Text>

        {options.map((opt, idx) => (
          <React.Fragment key={opt.id}>
            <TouchableOpacity
              onPress={() => handlePress(opt.id)}
              activeOpacity={0.7}>
              <Text style={[
                styles.intentionChoiceText,
                { color: palette.text }
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
            {idx < options.length - 1 && (
              <View style={styles.intentionChoiceSpacing} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default React.memo(BottomSheetIntentions);