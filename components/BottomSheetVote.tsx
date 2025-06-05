import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useBottomSheetStyles } from '../src/StyleSheet/BottomSheetStyles';
import { useTheme } from '../src/util/ThemeContext';
import { Colors } from '../assets/color/Colors';

export interface BottomSheetVoteProps {
  question: string;
  options: string[];
  onClose: () => void;
  onSubmit: (selectedOptions: string[]) => void;
  onAddOption: () => void;
}

const BottomSheetVote: React.FC<BottomSheetVoteProps> = ({
  question,
  options,
  onClose,
  onSubmit,
  onAddOption,
}) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const styles = useBottomSheetStyles();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelect = (opt: string) => {
    setSelectedOptions(prev =>
      prev.includes(opt)
        ? prev.filter(item => item !== opt)
        : [...prev, opt]
    );
  };

  const submit = () => {
    onSubmit(selectedOptions);
    onClose();
  };

  const maxHeight = Dimensions.get('window').height * 0.5;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.sectionContainer}>
        {/* Title */}
        <Text style={styles.intentionTitle}>{question}</Text>

        {/* Options List */}
        <ScrollView
          style={{ maxHeight }}
          contentContainerStyle={{ paddingVertical: 8 }}
          keyboardShouldPersistTaps="always"
        >
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelect(opt)}
            >
              <View style={[
                styles.radioOuter,
                { borderColor: palette.primary }
              ]}>
                {selectedOptions.includes(opt) && (
                  <View style={[
                    styles.radioInner,
                    { backgroundColor: palette.primary }
                  ]} />
                )}
              </View>
              <Text style={[styles.optionText, { color: palette.text }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Add Option Row */}
          <TouchableOpacity
            style={styles.addRow}
            activeOpacity={0.7}
            onPress={onAddOption}
          >
            <Text style={[styles.optionText, { color: palette.primary }]}>+ Thêm các lựa chọn</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={submit}
          activeOpacity={0.7}
          style={{ marginTop: 24 }}
        >
          <Text style={[
            styles.intentionChoiceText,
            { textAlign: 'center', color: palette.text }
          ]}>
            Lưu bình chọn
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BottomSheetVote;