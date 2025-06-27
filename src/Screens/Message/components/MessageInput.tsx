import {Colors} from '../../../../assets/color/Colors';
import React from 'react';
import {View, TouchableOpacity, Image, TextInput} from 'react-native';
import {
  Camera,
  Send,
  Mic,
  Image as ImageIcon,
  CirclePlus,
} from 'lucide-react-native'

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
  const iconSize = 20
  const iconColor = color.text
  return (
    <View
      style={[
        styles.inputContainer,
        {backgroundColor: 'rgba(255, 255, 255, 0.6)', zIndex: 20},
      ]}>
      <TouchableOpacity style={styles.blockCamera}>
        <Camera size={iconSize} color={iconColor} strokeWidth={2} />
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
          <Send size={iconSize} color={iconColor} strokeWidth={2} />
        </TouchableOpacity>
      ) : (
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.blockIcon1}>
            <Mic size={iconSize} color={iconColor} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.blockIcon1}
            onPress={pickImageAndSend}>
            <ImageIcon size={iconSize} color={iconColor} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.blockIcon1}>
             <CirclePlus size={iconSize} color={iconColor} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MessageInput;
