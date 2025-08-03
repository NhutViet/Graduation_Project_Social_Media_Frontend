import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../../src/util/ThemeContext';
import { Colors } from '@assets/color/Colors';
import { Send } from 'lucide-react-native';

// Thêm prop onSend để gọi ra ngoài
interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const color = Colors[theme];

  // Khi nhấn gửi
  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    onSend(text);
    setMessage('');
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>  
      <TextInput
        style={[styles.input, { color: color.text, backgroundColor: color.backgroundSecondary }]}
        placeholder="Nhập tin nhắn..."
        placeholderTextColor={color.textSecondary}
        value={message}
        onChangeText={setMessage}
        maxLength={500}
      />
      {message.trim().length > 0 && (
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Send size={22} color={color.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 46,
    paddingHorizontal: 15,
    paddingVertical: 8,
    lineHeight: 20,
    borderRadius: 30,
    textAlignVertical: 'center',
  },
  sendBtn: {
    padding: 10,
  },
});
