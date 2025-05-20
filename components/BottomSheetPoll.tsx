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

  // Focus the newly added option input
  useEffect(() => {
    if (options.length) {
      const last = options[options.length - 1];
      optionRefs.current[last.id]?.focus();
    }
  }, [options]);

  const addOption = () => {
    setOptions(prev => [
      ...prev,
      { id: uuid.v4().toString(), value: '' },
    ]);
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
      <Text style={styles.intentionTitle}>Question</Text>
      <TextInput
        style={styles.textInput}
        value={question}
        onChangeText={setQuestion}
        placeholder="Type your question here"
        placeholderTextColor={palette.lightDark}
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />

      <Text style={[styles.intentionTitle, { marginTop: 0 }]}>Options</Text>
      {options.map((opt, idx) => (
        <TextInput
          key={opt.id}
          ref={ref => (optionRefs.current[opt.id] = ref)}
          style={styles.textInput}
          value={opt.value}
          onChangeText={text => handleOptionChange(opt.id, text)}
          placeholder={`Option ${idx + 1}`}
          placeholderTextColor={palette.lightDark}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
      ))}

      <TouchableOpacity onPress={addOption} activeOpacity={0.7}>
        <Text style={[styles.intentionChoiceText, { color: palette.primary }]}>
          + Add more options
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={0.7}
        style={{ marginTop: 24 }}
      >
        <Text style={[styles.intentionChoiceText, { textAlign: 'center', color: palette.blue }]}>Create Poll</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomSheetPoll;