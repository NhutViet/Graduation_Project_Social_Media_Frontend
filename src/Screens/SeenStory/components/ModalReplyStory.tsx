import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {shareStory} from '../../../../services/StoryRedux/StorySlice';
import {
  createRoom,
  fetchMyRooms,
} from '../../../../services/roomRedux/roomSlice';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {X, Send} from 'lucide-react-native';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';

const {width, height} = Dimensions.get('window');

interface ModalReplyStoryProps {
  storyData?: {
    _id: string;
    mediaUrl: string;
    type: 'image' | 'video';
  };
  creatorId?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface ModalReplyHandle {
  open: () => void;
  close: () => void;
}

const ModalReplyStory = forwardRef<ModalReplyHandle, ModalReplyStoryProps>(
  ({storyData, creatorId, onOpen, onClose}, ref) => {
    const {theme} = useTheme();
    const color = Colors[theme];
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const dispatch = useDispatch<AppDispatch>();
    const currentUserId = useSelector(
      (state: RootState) => state.user.user?._id,
    );
    const existingRooms = useSelector((state: RootState) => state.rooms.rooms);

    // Auto focus when modal becomes visible
    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [visible]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setVisible(true);
        onOpen?.();
        // Focus will be handled by useEffect when visible becomes true
      },
      close: () => {
        setVisible(false);
        setMessage('');
        onClose?.();
      },
    }));

    const findExistingRoom = (creatorId: string, currentUserId: string) => {
      return existingRooms.find(room => {
        // Check if room has exactly 2 users and includes both creator and current user
        if (room.user_ids.length !== 2) return false;

        const userIds = room.user_ids.map(user => user._id);
        return userIds.includes(creatorId) && userIds.includes(currentUserId);
      });
    };

    const handleSendReply = async () => {
      if (!message.trim() || !storyData || !creatorId || !currentUserId) {
        GlobalAlertManager.show('Lỗi', 'Vui lòng nhập tin nhắn');
        return;
      }

      setIsSending(true);
      try {
        let roomId: string;

        // Check if room already exists between current user and creator
        const existingRoom = findExistingRoom(creatorId, currentUserId);

        if (existingRoom) {
          // Use existing room
          roomId = existingRoom._id;
        } else {
          // Create new room
          const roomResponse = await dispatch(
            createRoom({
              user_ids: [creatorId],
              type: 'waiting',
              name: '',
            }),
          ).unwrap();

          roomId = roomResponse.room._id;

          // Refresh rooms list to include the new room
          await dispatch(fetchMyRooms());
        }

        // Now send the story message to the room
        const payload = {
          roomIds: [roomId], // Use the actual room ID
          message: message.trim(),
          media: {
            type: storyData.type || 'image',
            url: storyData.mediaUrl,
          },
        };

        await dispatch(shareStory(payload)).unwrap();

        GlobalAlertManager.show('Thành công', 'Đã gửi reply story thành công');

        // Close modal and reset
        setVisible(false);
        setMessage('');
        onClose?.();
      } catch (error: any) {
        console.error('Error sending reply:', error);
        GlobalAlertManager.show(
          'Lỗi',
          error?.message || error || 'Không thể gửi reply story',
        );
      } finally {
        setIsSending(false);
      }
    };

    const handleClose = () => {
      setVisible(false);
      setMessage('');
      onClose?.();
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: color.background,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingTop: 20,
                paddingBottom: Platform.OS === 'ios' ? 40 : 20,
                minHeight: height * 0.3,
                maxHeight: height * 0.5,
              }}>
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingBottom: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: color.text,
                  }}>
                  Reply Story
                </Text>
                <TouchableOpacity onPress={handleClose}>
                  <X size={24} color={color.text} />
                </TouchableOpacity>
              </View>

              {/* Input Section */}
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 20,
                  paddingTop: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    backgroundColor: color.backgroundSecondary,
                    borderRadius: 20,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    minHeight: 50,
                  }}>
                  <TextInput
                    ref={inputRef}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: color.text,
                      maxHeight: 100,
                      paddingVertical: 5,
                    }}
                    placeholder="Nhập tin nhắn..."
                    placeholderTextColor={color.textSecondary}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    autoFocus={true}
                    blurOnSubmit={false}
                    returnKeyType="send"
                    onSubmitEditing={handleSendReply}
                    keyboardType="default"
                    autoCapitalize="sentences"
                  />
                  <TouchableOpacity
                    onPress={handleSendReply}
                    disabled={!message.trim() || isSending}
                    style={{
                      marginLeft: 10,
                      padding: 8,
                      borderRadius: 20,
                      backgroundColor: message.trim()
                        ? color.primary
                        : color.backgroundSecondary,
                      opacity: isSending ? 0.7 : 1,
                    }}>
                    {isSending ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Send size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Preview */}
                {storyData && (
                  <View
                    style={{
                      marginTop: 15,
                      padding: 15,
                      backgroundColor: color.backgroundSecondary,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: color.textSecondary,
                        marginBottom: 5,
                      }}>
                      Đang reply story:
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: color.textSecondary,
                      }}>
                      {storyData.type === 'video' ? 'Video' : 'Ảnh'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  },
);

export default ModalReplyStory;
