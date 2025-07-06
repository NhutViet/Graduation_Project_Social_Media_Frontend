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
  onLongPress: (content: Message) => void;
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
  onLongPress,
}) => {
  const isMe = item.sender.handleName === userHandleName;
  const prevMsg = chat[index - 1];
  const showAvatar =
    !prevMsg || prevMsg.sender.handleName !== item.sender.handleName;

  /**
   * RenderAvatar if its a OtherUserMessage
   * and the first message or different from the previous sender
   */
  const renderAvatar = () =>
    !isMe && showAvatar ? (
      <TouchableOpacity style={[styles.blockAvatar, {marginRight: 10}]}>
        <Image source={{uri: item.sender.profilePic}} style={styles.avatar} />
      </TouchableOpacity>
    ) : null;

  const renderContent = () => {
    if (item.media?.type === 'image') {
      return (
        <TouchableOpacity
          onPress={() => setSelectedImageUri(item.media?.url ?? null)}
          onLongPress={() => onLongPress(item)}>
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
      );
    }

    if (item.media?.type === 'call') {
      return (
        <View
          style={{
            backgroundColor: '#E6F7FF',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            alignItems: 'center',
            minWidth: 100,
          }}>
          <Text style={{color: '#007AFF', fontWeight: '600', fontSize: 14}}>
            {item.content}
          </Text>
          {item.media.duration && (
            <Text
              style={{
                color: '#007AFF',
                fontSize: 12,
                marginTop: 4,
              }}>
              ⏱ {item.media.duration}
            </Text>
          )}
          <TouchableOpacity
            style={{
              marginTop: 8,
              backgroundColor: '#00BFFF',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              width: '90%',
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 13,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Gọi lại
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    const filteredText = item.content
      .split(/(\s+)/)
      .filter(part => !/^https?:\/\/\S+$/i.test(part))
      .join('');

    return (
      <>
        {filteredText !== '' && (
          <Text
            style={{
              color: color.text,
              textAlign: linkPreviews[index] && 'right',
              fontSize: 14,
            }}>
            {filteredText}
          </Text>
        )}
        {linkPreviews[index] && (
          <TouchableOpacity
            onPress={() => Linking.openURL(linkPreviews[index].url)}
            onLongPress={() => onLongPress?.(item)}
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
    );
  };

  const renderMessageBubble = () => (
    <TouchableOpacity
      activeOpacity={0.7}
      onLongPress={() => onLongPress?.(item)}>
      <View
        style={[
          styles.message,
          {
            maxWidth: '80%',
            marginLeft: isMe || showAvatar ? 0 : 50,
            marginRight: isMe ? 0 : 40,
            backgroundColor: item.media
              ? item.media.type === 'call'
                ? color.backgroundSecondary
                : 'transparent'
              : !isMe
              ? color.backgroundSecondary
              : !linkPreviews[index] && !item.media
              ? '#00BFFF'
              : color.backgroundSecondary,
            padding:
              item.media?.type === 'image' || item.media?.type === 'call'
                ? 0
                : 10,
          },
        ]}>
        {renderContent()}
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.containerMessage,
        {justifyContent: isMe ? 'flex-end' : 'flex-start'},
      ]}>
      {renderAvatar()}
      <View
        style={[styles.row, {alignItems: isMe ? 'flex-end' : 'flex-start'}]}>
        {renderMessageBubble()}
      </View>
    </View>
  );
};

export default MessageItemComponent;
