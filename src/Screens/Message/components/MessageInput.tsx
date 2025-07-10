import {Colors} from '@assets/color/Colors';
import React from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
import {Camera, Send, Mic, Image as ImageIcon, Plus} from 'lucide-react-native';

interface MessageInputProps {
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  pickImageAndSend: () => void;
  styles: any;
  color: any;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  sendMessage,
  pickImageAndSend,
  styles,
  color,
}) => {
  return (
    <View
      style={[
        styles.inputContainer,
        {backgroundColor: color.bgInputText, zIndex: 10},
      ]}>
      <TouchableOpacity style={styles.blockCamera}>
        <Camera size={22} color={color.black} />
      </TouchableOpacity>

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Soạn tin nhắn..."
        placeholderTextColor={Colors.black}
        style={styles.input}
        multiline={true}
        returnKeyType="default"
        blurOnSubmit={false}
      />

      {message.trim().length > 0 ? (
        <TouchableOpacity style={styles.blockCamera} onPress={sendMessage}>
          <Send size={22} color={color.black} />
        </TouchableOpacity>
      ) : (
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.blockIcon1}>
            <Mic size={22} color={color.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.blockIcon1}
            onPress={pickImageAndSend}>
            <ImageIcon size={22} color={color.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.blockIcon1}>
            <Plus size={22} color={color.black} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MessageInput;
