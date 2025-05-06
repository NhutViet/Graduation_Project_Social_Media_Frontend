import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import {Comments} from '../src/mockData/comments.mock';
import {styles} from '../src/StyleSheet/Comment.Styles';

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  timeAgo: string;
  likes?: number;
  isLiked?: boolean;
  likedBy?: {
    count: number;
    text: string;
  };
  replies?: {
    count: number;
    text: string;
    items?: Comment[];
  };
}

const CommentItem = ({
  comment,
  color,
  onLike,
  onReply,
  level = 0,
}: {
  comment: Comment;
  color: any;
  onLike: (id: string) => void;
  onReply: (id: string) => void;
  level?: number;
}) => {
  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <View>
      <View style={[styles.commentItem, level > 0 && styles.nestedComment]}>
        <Image source={{uri: comment.avatar}} style={styles.avatar} />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={[styles.username, {color: color.text}]}>
              {comment.username}
            </Text>
            <Text style={[styles.commentText, {color: color.text}]}>
              {comment.content}
            </Text>
          </View>
          <View style={styles.commentFooter}>
            <Text style={[styles.timeAgo, {color: color.textSecondary}]}>
              {comment.timeAgo}
            </Text>
            <TouchableOpacity onPress={() => onReply(comment.id)}>
              <Text style={[styles.replyButton, {color: color.textSecondary}]}>
                Reply
              </Text>
            </TouchableOpacity>
            {comment.likedBy && (
              <Text style={[styles.likes, {color: color.textSecondary}]}>
                {comment.likedBy.text}
              </Text>
            )}
          </View>
          {comment.replies?.items && comment.replies.items.length > 0 && (
            <TouchableOpacity
              style={styles.viewRepliesButton}
              onPress={toggleReplies}>
              <Text
                style={[styles.viewRepliesText, {color: color.textSecondary}]}>
                {showReplies ? 'Hide' : 'View'} {comment.replies.count}{' '}
                {comment.replies.count > 1 ? 'replies' : 'reply'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => onLike(comment.id)}>
          <Text
            style={[
              styles.heart,
              {color: comment.isLiked ? color.error : color.textSecondary},
            ]}>
            ♥
          </Text>
        </TouchableOpacity>
      </View>

      {showReplies && comment.replies?.items && (
        <View style={styles.repliesContainer}>
          {comment.replies.items.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              color={color}
              onLike={onLike}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const CommentSection = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const [commentText, setCommentText] = useState('');
  const comments: Comment[] = Comments;

  const reactions = ['👊', '🔥', '📢', '😎', '⭐', '🙌', '👾', '💪'];

  const handleLike = (commentId: string) => {
    // Xử lý like comment
    console.log('Like comment:', commentId);
  };

  const handleReply = (commentId: string) => {
    // Xử lý reply comment
    console.log('Reply to comment:', commentId);
  };

  const handleReactionSelect = (reaction: string) => {
    setCommentText(`${commentText} ${reaction}`.trim());
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log('Sending comment:', {
        text: commentText,
      });
      setCommentText('');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {height: Dimensions.get('window').height * 0.55},
      ]}>
      <View style={styles.listContainer}>
        <FlashList
          data={comments}
          estimatedItemSize={100}
          renderItem={({item}) => (
            <CommentItem
              comment={item}
              color={color}
              onLike={handleLike}
              onReply={handleReply}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>

      <View style={styles.reactionsBar}>
        <FlashList
          data={reactions}
          horizontal
          estimatedItemSize={40}
          renderItem={({item}) => (
            <TouchableOpacity
              key={item}
              style={styles.reactionButton}
              onPress={() => handleReactionSelect(item)}>
              <Text style={styles.reactionEmoji}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <View style={[styles.commentInput, {backgroundColor: color.background}]}>
        <Image
          source={{uri: 'https://picsum.photos/40/40?random=0'}}
          style={styles.userAvatar}
        />
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Add a comment..."
          placeholderTextColor={color.textSecondary}
          style={[styles.input, {color: color.text}]}
        />
        {commentText.trim() && (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendComment}>
            <Text style={[styles.sendButtonText, {color: color.primary}]}>
              Send
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CommentSection;
