import {Colors} from '@assets/color/Colors';
import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Camera, Send, Image as ImageIcon} from 'lucide-react-native';
import {useTheme} from '../../../../src/util/ThemeContext';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width - 20;

interface MessageInputProps {
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  pickImageAndSend: () => void;
  roomId: string;
  handleChangeText: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  sendMessage,
  pickImageAndSend,
  roomId,
  handleChangeText,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation<any>();
  return (
    <View
      style={[
        styles.inputContainer,
        {backgroundColor: color.backgroundSecondary, zIndex: 10},
      ]}>
      <TouchableOpacity
        style={styles.blockCamera}
        onPress={() => navigation.navigate('CameraScreen', {roomId})}>
        <Camera size={22} color={color.text} />
      </TouchableOpacity>

      <TextInput
        value={message}
        onChangeText={handleChangeText}
        placeholder="Soạn tin nhắn..."
        placeholderTextColor={color.text}
        style={[styles.input, {color: color.text}]}
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
          <TouchableOpacity onPress={pickImageAndSend}>
            <ImageIcon size={22} color={color.text} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 5,
  },
});
