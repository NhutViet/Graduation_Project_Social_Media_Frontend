import React from 'react';
import {Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import {Message} from '../../../../services/messageRedux/messageType';

interface MessageItemProps {
  item: Message;
  index: number;
  userHandleName: string;
  chat: Message[];
  setSelectedImageUri: (uri: string | null) => void;
  linkPreviews: {[key: number]: any};
  styles: any;
  color: any;
}

const MessageItemComponent: React.FC<MessageItemProps> = ({
  item,
  index,
  userHandleName,
  chat,
  setSelectedImageUri,
  linkPreviews,
  styles,
  color,
}) => {
  const isMe = item.sender.handleName === userHandleName;
  const prevMsg = chat[index - 1];
  const showAvatar =
    !prevMsg || prevMsg.sender.handleName !== item.sender.handleName;

  return (
    <View
      style={[
        styles.containerMessage,
        {justifyContent: isMe ? 'flex-end' : 'flex-start'},
      ]}>
      {!isMe && showAvatar && (
        <TouchableOpacity style={[styles.blockAvatar, {marginRight: 10}]}>
          <Image source={{uri: item.sender.profilePic}} style={styles.avatar} />
        </TouchableOpacity>
      )}

      <View
        style={[styles.row, {alignItems: isMe ? 'flex-end' : 'flex-start'}]}>
        <TouchableOpacity activeOpacity={0.7}>
          <View
            style={[
              styles.message,
              {
                marginLeft: isMe || showAvatar ? 0 : 50,
                marginRight: isMe ? 0 : 40,
                backgroundColor: item.media
                  ? 'transparent'
                  : !isMe
                  ? color.backgroundSecondary
                  : !linkPreviews[index] && !item.media
                  ? '#00BFFF'
                  : color.backgroundSecondary,
                padding: item.media ? 0 : 10,
              },
            ]}>
            {item.media?.type == 'image' ? (
              <TouchableOpacity
                onPress={() => setSelectedImageUri(item.media?.url ?? null)}>
                <View
                  style={{
                    width: 150,
                    height: 200,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={{uri: item.media.url}}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <>
                {item.content
                  .split(/(\s+)/)
                  .filter(part => !/^https?:\/\/\S+$/i.test(part))
                  .join('') !== '' && (
                  <Text
                    style={{
                      color: color.text,
                      textAlign: linkPreviews[index] && 'right',
                      fontSize: 14,
                    }}>
                    {item.content
                      .split(/(\s+)/)
                      .filter(part => !/^https?:\/\/\S+$/i.test(part))
                      .join('')}
                  </Text>
                )}
                {linkPreviews[index] && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(linkPreviews[index].url)}
                    style={{
                      borderRadius: 8,
                      backgroundColor: color.backgroundSecondary,
                      marginTop: 5,
                      maxWidth: 200,
                    }}>
                    {linkPreviews[index].images?.length > 0 && (
                      <Image
                        source={{uri: linkPreviews[index].images[0]}}
                        style={{
                          width: '100%',
                          height: 140,
                          borderRadius: 6,
                          marginBottom: 6,
                        }}
                        resizeMode="cover"
                      />
                    )}
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: color.text,
                        fontSize: 14,
                        marginBottom: 4,
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {linkPreviews[index].title}
                    </Text>
                    {linkPreviews[index].description && (
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{color: 'gray', fontSize: 12}}>
                        {linkPreviews[index].description}
                      </Text>
                    )}
                    <Text
                      style={{color: '#007AFF', fontSize: 12, marginTop: 4}}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {linkPreviews[index].url}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageItemComponent;
