import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Message} from '../../../../services/messageRedux/messageType';
import {useTheme} from '../../../../src/util/ThemeContext';
import {Colors} from '@assets/color/Colors';

interface MessageItemProps {
  roomId: string;
  item: Message;
  index: number;
  userHandleName: string;
  chat: Message[];
  setSelectedImageUri: (uri: string | null) => void;
  linkPreviews: {[key: number]: any};
  onLongPress: (content: Message) => void;
}

const MessageItemComponent: React.FC<MessageItemProps> = ({
  item,
  index,
  userHandleName,
  chat,
  setSelectedImageUri,
  linkPreviews,
  onLongPress,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
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
    // Nếu có ảnh và có text thì hiển thị ảnh trước, text sau
    if (item.media?.type === 'image') {
      return (
        <View>
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
          {item.content ? (
            <View
              style={{
                marginTop: 8,
                backgroundColor: isMe ? '#00BFFF' : color.backgroundSecondary,
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 10,
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: 240,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 1,
              }}>
              <Text
                style={{
                  color: isMe ? '#fff' : color.text,
                  fontSize: 15,
                  textAlign: 'left',
                  lineHeight: 20,
                }}>
                {item.content}
              </Text>
            </View>
          ) : null}
        </View>
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

  const renderMessageBubble = () => {
    const maxShownReactions = 3;
    const displayedReactions =
      item.reactions?.slice(0, maxShownReactions) || [];
    const remainingCount =
      (item.reactions?.length || 0) - displayedReactions.length;

    return (
      <TouchableOpacity
        onLongPress={() => onLongPress?.(item)}
        style={{position: 'relative'}}>
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

        {item.reactions && item.reactions.length > 0 && (
          <View
            style={{
              position: 'absolute',
              bottom: -15,
              right: isMe ? 7 : undefined,
              left: !isMe ? 7 : undefined,
              marginLeft: !isMe ? (isMe || showAvatar ? 0 : 50) : 0,
              flexDirection: 'row-reverse',
              alignItems: 'center',
              paddingHorizontal: 3,
              paddingVertical: 2,
              backgroundColor: '#fff',
              borderRadius: 20,
            }}>
            {displayedReactions.map((r, idx) => (
              <View
                key={idx}
                style={{
                  marginRight: idx === 0 ? 0 : -8,
                }}>
                <Text style={{fontSize: 16}}>{r.content}</Text>
              </View>
            ))}

            {remainingCount > 0 && (
              <Text
                style={{
                  fontSize: 13,
                  color: '#555',
                  marginRight: 6,
                }}>{`+${remainingCount}`}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.containerMessage,
        {
          justifyContent: isMe ? 'flex-end' : 'flex-start',
          marginBottom: item.reactions && item.reactions.length > 0 ? 20 : 0,
        },
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

const styles = StyleSheet.create({
  blockAvatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  message: {
    position: 'relative',
    borderRadius: 10,
  },
  containerMessage: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  row: {
    width: '100%',
  },
});
