import {deleteMessageById} from '@services/messageRedux/messageSlice';
import {Colors} from '../../../../assets/color/Colors';
import {
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
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {useSocket} from '@services/SocketContext';
import {Reply, Copy, Trash2} from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  content: Message | undefined;
  setChat: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ActionModalMessage = ({visible, onClose, content, setChat}: Props) => {
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const {socket} = useSocket();

  const handleReaction = (reaction: string) => {
    if (!socket || !content || !user?._id) return;

    socket.emit('addReaction', {
      messageId: content._id,
      userId: user._id,
      content: reaction,
    });

    onClose();
  };

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
          style={{
            backgroundColor: '#E6F7FF',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            alignItems: 'center',
            minWidth: 100,
          }}>
          <Text style={{color: '#007AFF', fontWeight: '600', fontSize: 14}}>
            {content.content}
          </Text>
          {content.media.duration && (
            <Text
              style={{
                color: '#007AFF',
                fontSize: 12,
                marginTop: 4,
              }}>
              ⏱ {content.media.duration}
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
              <Reply size={22} color="black" />
              <Text style={styles.text} numberOfLines={1}>
                Trả lời
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureContainer}>
              <Copy size={22} color="black" />
              <Text style={styles.text} numberOfLines={1}>
                Sao chép
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureContainer}
              onPress={async () => {
                if (content) {
                  try {
                    const resultAction = await dispatch(
                      deleteMessageById({messageId: content._id}),
                    );

                    if (deleteMessageById.fulfilled.match(resultAction)) {
                      const {deleted, reason} = resultAction.payload;

                      if (deleted) {
                        setChat(prev =>
                          prev.filter(msg => msg._id !== content._id),
                        );
                        onClose();
                      } else {
                        GlobalAlertManager.show(
                          'Thất bại',
                          reason || 'Bạn không thể xoá tin nhắn này',
                        );
                      }
                    } else {
                      const reason = resultAction.payload || 'Xoá thất bại';
                      GlobalAlertManager.show('Lỗi', reason);
                    }
                  } catch (err) {
                    GlobalAlertManager.show(
                      'Lỗi',
                      'Đã xảy ra lỗi khi xoá tin nhắn',
                    );
                  } finally {
                    onClose();
                  }
                }
              }}>
              <Trash2 size={22} color="black" />
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
    backgroundColor: 'rgba(50,50,50,0.7)',
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
    marginTop: 6,
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
