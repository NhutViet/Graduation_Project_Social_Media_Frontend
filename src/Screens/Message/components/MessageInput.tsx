import {Colors} from '../../../../assets/color/Colors';
import React from 'react';
import {View, TouchableOpacity, Image, TextInput} from 'react-native';

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
        {backgroundColor: 'rgba(255, 255, 255, 0.6)', zIndex: 20},
      ]}>
      <TouchableOpacity style={styles.blockCamera}>
        <Image
          style={{tintColor: color.text, width: 20, height: 20}}
          source={require('../../../../assets/icon/camera.png')}
        />
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
          <Image
            style={{tintColor: color.text, width: 20, height: 20}}
            source={require('../../../../assets/icon/share.png')}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.blockIcon1}>
            {/* <Image
              style={styles.icon}
              source={require('../../../../assets/icon/microphone.png')}
            /> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.blockIcon1}
            onPress={pickImageAndSend}>
            {/* <Image
              style={styles.icon}
              source={require('../../../../assets/icon/picture.png')}
            /> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.blockIcon1}>
            <Image
              style={styles.icon}
              source={require('../../../../assets/icon/another.png')}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MessageInput;
