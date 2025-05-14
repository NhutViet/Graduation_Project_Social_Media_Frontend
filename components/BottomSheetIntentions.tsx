import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useBottomSheetStyles } from '../src/StyleSheet/BottomSheetStyles';
import { useTheme } from '../src/util/ThemeContext';
import { Colors } from '../assets/color/Colors';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

export interface IntentionOption {
  id: string;
  label: string;
  onPress: () => void;
}

export interface BottomSheetIntentionProps {
  title: string;
  subtitle: string;
  content: string;
  options: IntentionOption[];
  onClose: () => void;
}

const BottomSheetIntention: React.FC<BottomSheetIntentionProps> = ({
  title,
  subtitle,
  content,
  options,
  onClose,
}) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const styles = useBottomSheetStyles();

  const handlePress = (option: IntentionOption) => {
    option.onPress();
    onClose();
  };

  return (
    <View style={styles.intentionContainer}>
      <Text style={styles.intentionTitle}>
        {title}
      </Text>
      <View style={styles.intentionBorder} />
      <View style={styles.innerContainer}>
        <Text style={styles.intentionSubtitle}>
            {subtitle}
        </Text>
        <Text style={styles.intentionContent}>
            {content}
        </Text>

        {options.map((option, idx) => (
            <TouchableOpacity
            key={option.id}
            onPress={() => handlePress(option)}
            activeOpacity={0.7}
            >
            <Text style={[styles.intentionChoiceText, { color: palette.text }]}>  
                {option.label}
            </Text>
            {idx < options.length - 1 && (
                <View style={[ styles.intentionChoiceSpacing ]} />
            )}
            </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomSheetIntention;