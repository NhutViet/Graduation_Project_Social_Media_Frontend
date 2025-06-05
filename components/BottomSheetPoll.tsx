import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useBottomSheetStyles } from '../src/StyleSheet/BottomSheetStyles';
import { useTheme } from '../src/util/ThemeContext';
import { Colors } from '../assets/color/Colors';
import uuid from 'react-native-uuid';

export interface BottomSheetPollProps {
  onClose: () => void;
  onSubmit: (question: string, options: string[]) => void;
}

interface PollOption {
  id: string;
  value: string;
}

const BottomSheetPoll: React.FC<BottomSheetPollProps> = ({ onClose, onSubmit }) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const styles = useBottomSheetStyles();

  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<PollOption[]>([]);

  // Keep refs to focus new inputs
  const optionRefs = useRef<Record<string, TextInput | null>>({});
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // Only focus newly added options
  useEffect(() => {
    if (lastAddedId && optionRefs.current[lastAddedId]) {
      optionRefs.current[lastAddedId]?.focus();
      setLastAddedId(null); // Reset after focusing
    }
  }, [lastAddedId]);

  // // Focus the newly added option input
  // useEffect(() => {
  //   if (options.length) {
  //     const last = options[options.length - 1];
  //     optionRefs.current[last.id]?.focus();
  //   }
  // }, [options]);

  const addOption = () => {
    const newId = uuid.v4().toString();
    setOptions(prev => [
      ...prev,
      { id: newId, value: '' },
    ]);
    setLastAddedId(newId); 
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(prev =>
      prev.map(opt =>
        opt.id === id
          ? { ...opt, value: text }
          : opt
      )
    );
  };

  const handleSubmit = () => {
    const filledOptions = options.map(o => o.value).filter(v => v.trim() !== '');
    onSubmit(question.trim(), filledOptions);
    onClose();
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.intentionTitle}>Câu hỏi</Text>
      <TextInput
        style={styles.textInput}
        value={question}
        onChangeText={setQuestion}
        placeholder="Nhập câu hỏi của bạn tại đây"
        placeholderTextColor={palette.lightDark}
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />

      <Text style={[styles.intentionTitle, { marginTop: 0 }]}>Các lựa chọn</Text>
      {options.map((opt, idx) => (
        <TextInput
          key={opt.id}
          ref={ref => (optionRefs.current[opt.id] = ref)}
          style={styles.textInput}
          value={opt.value}
          onChangeText={text => handleOptionChange(opt.id, text)}
          placeholder={`Lựa chọn ${idx + 1}`}
          placeholderTextColor={palette.lightDark}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
      ))}

      <TouchableOpacity onPress={addOption} activeOpacity={0.7}>
        <Text style={[styles.intentionChoiceText, { color: palette.primary }]}>
          + Thêm lựa chọn khác
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={0.7}
        style={{ marginTop: 24 }}
      >
        <Text style={[styles.intentionChoiceText, { textAlign: 'center', color: palette.blue }]}>Tạo bình chọn</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomSheetPoll;