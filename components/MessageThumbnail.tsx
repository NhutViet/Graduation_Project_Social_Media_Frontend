import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Camera } from 'lucide-react-native';
import {useProfileEditingStyles} from '../src/Screens/EditProfile/components/ProfileEditingStyles';
import { CircleUserRound } from 'lucide-react-native';

export interface MessageThumbnailProps {
  id: string;
  username: string;
  message: string;
  time: string;
  avatarUri?: string;
  isMine?: boolean;
  selected?: boolean;
  onPress?: () => void;
}

const MessageThumbnail: React.FC<MessageThumbnailProps> = ({
  username,
  message,
  time,
  avatarUri,
  isMine = false,
  selected = false,
  onPress,
}) => {
  const styles = useProfileEditingStyles();
  const displayText = isMine ? `Bạn: ${message}` : message;
  // take up to 18 characters, then ellipsize manually if needed
  const snippet =
    displayText.length > 18
      ? displayText.slice(0, 18).trimEnd() + '…'
      : displayText;

  return (
    <TouchableOpacity style={styles.messageThumbnail} onPress={onPress}>
      {avatarUri ? 
        <Image
          source={
            {uri: avatarUri}
          }
          style={styles.messageAvatar}
        /> :
        <CircleUserRound size={50}/>
      }
      <View style={styles.messageTextContainer}>
        <Text
          style={styles.messageUsername}
          numberOfLines={1}
          ellipsizeMode="tail">
          {username}
        </Text>
        <Text
          style={[styles.messageSnippet]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {snippet} {time}
        </Text>
      </View>
      <Camera style={styles.messageIcon}/>
    </TouchableOpacity>
  );
};

export default MessageThumbnail;
