import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import { ChevronLeft, Video, Info } from 'lucide-react-native';

interface MessageHeaderProps {
  user1?: any;
  user2?: any;
  room?: any;
  navigation: any;
  handleGoBack: () => void;
  handleCall: () => void;
  styles: any;
  color: any;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  user1,
  user2,
  room,
  navigation,
  handleGoBack,
  handleCall,
  styles,
  color,
}) => {
  return (
    <View
      style={[
        styles.header,
        {backgroundColor: 'rgba(255, 255, 255, 0.6)'},
      ]}>
      <View style={styles.rowContainer2}>
        <TouchableOpacity style={styles.blockIcon} onPress={handleGoBack}>
          <ChevronLeft style={styles.icon} size={24} color={Colors.black} strokeWidth={2}/>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.imgContainer,
            {
              overflow:
                user1?.profilePic && !user2?.profilePic ? 'hidden' : undefined,
            },
          ]}
          onPress={() => {
            if (user1?.profilePic && user2?.profilePic) {
              navigation.navigate('InforGroupChat', {
                roomId: room?._id,
                img1: user1?.profilePic,
                img2: user2?.profilePic,
              });
            } else {
              navigation.navigate('InfoUser', {
                roomId: room?._id,
                img1: user1?.profilePic,
                nameChat: user1?.handleName,
              });
            }
          }}>
          {user2?.profilePic && (
            <>
              <Image
                style={styles.iconW}
                source={{uri: user1?.profilePic}}
              />
              <Image
                style={[
                  styles.iconF,
                  {
                    borderColor: Colors.white,
                    backgroundColor: color.backgroundSecondary,
                  },
                ]}
                source={{uri: user2?.profilePic}}
              />
            </>
          )}
          {!user2?.profilePic && user1?.profilePic && (
            <Image style={styles.img} source={{uri: user1?.profilePic}} />
          )}
        </TouchableOpacity>

        <Text
          style={{color: Colors.black, fontSize: 16}}
          numberOfLines={1}>
          {room?.name?.trim() || user1?.handleName || 'No name'}
        </Text>
      </View>

      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.blockIcon}
          onPress={handleCall}>
          <Video style={styles.icon} size={24} color={Colors.black} strokeWidth={2}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.blockIcon}>
          <Info style={styles.icon} size={24} color={Colors.black} strokeWidth={2}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageHeader;