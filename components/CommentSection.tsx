import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {Send, Heart} from 'lucide-react-native';
import {FlashList} from '@shopify/flash-list';
import {mockComments, Comment} from '../src/MockData/comments.mock';
import styles from '../src/StyleSheet/Comment.Styles';

interface CommentItemProps {
  comment: Comment;
  color: any;
}

const CommentItem = React.memo(({comment, color}: CommentItemProps) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);

  return (
    <View style={[styles.commentItem, {borderBottomColor: color.border}]}>
      <Image source={{uri: comment.avatar}} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={[styles.username, {color: color.text}]}>
            {comment.username}
          </Text>
          <Text style={[styles.content, {color: color.text}]}>
            {comment.content}
          </Text>
        </View>
        <View style={styles.commentFooter}>
          <Text style={[styles.timeAgo, {color: color.textSecondary}]}>
            {comment.timeAgo}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.reply, {color: color.textSecondary}]}>
              Reply
            </Text>
          </TouchableOpacity>
          {comment.likedBy && (
            <Text style={[styles.likes, {color: color.textSecondary}]}>
              {comment.likedBy.text}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => setIsLiked(!isLiked)}>
        <Heart
          size={16}
          color={isLiked ? '#FF3B30' : color.textSecondary}
          fill={isLiked ? '#FF3B30' : 'none'}
        />
      </TouchableOpacity>
    </View>
  );
});

const ReactionsList = ({onReactionPress}: any) => {
  const reactions = [
    '❤️',
    '👍',
    '😂',
    '😍',
    '😢',
    '🤔',
    '🎉',
    '🔥',
    '👏',
    '💪',
    '🙏',
    '💬',
  ];
  return (
    <FlashList
      data={reactions}
      renderItem={({item, index}) => (
        <TouchableOpacity
          key={index}
          style={styles.reactionButton}
          onPress={() => onReactionPress(item)}>
          <Text style={styles.reactionEmoji}>{item}</Text>
        </TouchableOpacity>
      )}
      estimatedItemSize={40}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export const CommentSection = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const [newComment, setNewComment] = useState('');
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});

  const handleReactionPress = useCallback(
    (reaction: string) => {
      setNewComment(newComment + reaction);
    },
    [newComment],
  );

  const toggleReplies = useCallback((commentId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <Pressable
        style={[styles.modalContainer, {backgroundColor: 'rgba(0,0,0,0.5)'}]}
        onPress={onClose}>
        <Pressable
          style={[styles.modalContent, {backgroundColor: color.background}]}
          onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, {color: color.text}]}>
              Comments
            </Text>
          </View>
          <View style={{flex: 1}}>
            <FlashList
              data={mockComments}
              contentContainerStyle={{paddingBottom: 100}}
              estimatedItemSize={100}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              renderItem={({item: comment}) => (
                <View key={comment.id}>
                  <CommentItem comment={comment} color={color} />
                  {comment.replies &&
                    comment.replies.items &&
                    comment.replies.items.length > 0 && (
                      <>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={[
                            styles.viewMoreButton,
                            {
                              marginLeft: 20,
                              padding: 8,
                              backgroundColor: color.gray + '20',
                              borderRadius: 4,
                            },
                          ]}
                          onPress={() => toggleReplies(comment.id)}
                          delayPressIn={0}>
                          <Text
                            style={[
                              styles.viewMoreText,
                              {color: color.textSecondary},
                            ]}>
                            {expandedComments[comment.id]
                              ? 'Hide replies'
                              : `View ${comment.replies.count} replies`}
                          </Text>
                        </TouchableOpacity>
                        {expandedComments[comment.id] && (
                          <View style={{marginTop: 8}}>
                            {comment.replies.items.map(reply => (
                              <View key={reply.id} style={{marginLeft: 20}}>
                                <CommentItem comment={reply} color={color} />
                              </View>
                            ))}
                          </View>
                        )}
                      </>
                    )}
                </View>
              )}
            />
          </View>
          <View
            style={[
              styles.reactionsContainer,
              {
                borderTopColor: color.border,
                backgroundColor: color.background,
              },
            ]}>
            <ReactionsList onReactionPress={handleReactionPress} />
          </View>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: color.background,
                borderTopColor: color.border,
              },
            ]}>
            <Image
              source={{uri: 'https://picsum.photos/50/50?random=0'}}
              style={styles.userAvatar}
            />
            <TextInput
              style={[styles.input, {color: color.text}]}
              placeholder="Add a comment..."
              placeholderTextColor={color.textSecondary}
              value={newComment}
              onChangeText={setNewComment}
            />
            {newComment.length > 0 && (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  console.log('Sending comment:', newComment);
                  setNewComment('');
                }}>
                <Send size={24} color={color.blue} />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
