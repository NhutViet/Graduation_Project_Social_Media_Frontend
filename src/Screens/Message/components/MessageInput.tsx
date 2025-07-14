import {Colors} from '@assets/color/Colors';
import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Camera, Send, Mic, Image as ImageIcon, Plus} from 'lucide-react-native';
import {useTheme} from '../../../../src/util/ThemeContext';

const screenWidth = Dimensions.get('window').width - 20;

interface MessageInputProps {
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  pickImageAndSend: () => void;
  color: any;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  sendMessage,
  pickImageAndSend,
  // styles,
  // color,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
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
        style={[styles.input, {color: color.black}]}
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
          <TouchableOpacity>
            <Mic size={22} color={color.black} />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImageAndSend}>
            <ImageIcon size={22} color={color.black} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Plus size={22} color={color.black} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 10,
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 46,
    textAlignVertical: 'center',
  },
  blockCamera: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  rowContainer: {
    width: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 5,
  },
});
