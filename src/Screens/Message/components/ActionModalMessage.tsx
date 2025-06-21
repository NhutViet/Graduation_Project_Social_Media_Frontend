import {deleteMessageById} from '@services/messageRedux/messageSlice';
import {Colors} from '../../../../assets/color/Colors';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Message} from '@services/messageRedux/messageType';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';

interface Props {
  visible: boolean;
  onClose: () => void;
  content: Message | undefined;
  setChat: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ActionModalMessage = ({visible, onClose, content, setChat}: Props) => {
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  const handleReaction = (reaction: string) => {
    onClose();
  };
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const renderContent = () => {
    if (!content) return null;

    if (content.media?.type === 'image') {
      return (
        <Image
          source={{uri: content.media.url}}
          style={{
            width: 140,
            height: 200,
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
      );
    }

    if (content.media?.type === 'call') {
      return (
        <View
          style={[styles.textContainer, {width: 140, paddingHorizontal: 10}]}>
          <Text style={styles.text}>{content.content}</Text>
          {content.media.duration && (
            <Text style={styles.text}>⏱ {content.media.duration}</Text>
          )}
          <View style={styles.callButton}>
            <Text style={{color: Colors.black, fontSize: 13}}>📞 Gọi lại</Text>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          padding: 10,
          backgroundColor:
            content?.sender.userId === user?._id ? '#00BFFF' : Colors.white,
          borderRadius: 10,
        }}>
        <Text style={styles.text} numberOfLines={4}>
          {content.content}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.overlay} />
        <View style={styles.visibleAction}>
          <View style={styles.reactionContainer}>
            {reactions.map((reaction, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleReaction(reaction)}>
                <Text style={styles.reactionText}>{reaction}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              width: '90%',
              alignItems:
                content?.sender.userId === user?._id
                  ? 'flex-end'
                  : 'flex-start',
            }}>
            <View style={[styles.textContainer, {maxWidth: '80%'}]}>
              {renderContent()}
            </View>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.featureContainer}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/reply.png')}
              />
              <Text style={styles.text} numberOfLines={1}>
                Trả lời
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureContainer}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/copy.png')}
              />
              <Text style={styles.text} numberOfLines={1}>
                Sao chép
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.featureContainer}
              onPress={async () => {
                if (content) {
                  const resultAction = await dispatch(
                    deleteMessageById({messageId: content._id}),
                  );
                  if (deleteMessageById.fulfilled.match(resultAction)) {
                    setChat(prev =>
                      prev.filter(msg => msg._id !== content._id),
                    );
                    onClose();
                  } else {
                    Alert.alert('Lỗi', 'Xoá thất bại');
                  }
                  onClose();
                }
              }}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icon/trash.png')}
              />
              <Text style={styles.text} numberOfLines={1}>
                Xoá tin nhắn
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundColor: 'rgba(50,50,50,0.8)',
  },
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  visibleAction: {
    position: 'absolute',
    zIndex: 1,
    bottom: 40,
    alignItems: 'center',
  },
  reactionContainer: {
    width: '90%',
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reactionText: {
    fontSize: 20,
  },
  actionContainer: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    gap: 20,
  },
  featureContainer: {
    maxWidth: '30%',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 6,
    tintColor: Colors.black,
  },
  text: {
    color: Colors.black,
  },
  textContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginVertical: 10,
  },
  callButton: {
    width: '100%',
    marginTop: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
});

export default ActionModalMessage;
