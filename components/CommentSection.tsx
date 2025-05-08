/**
 * CommentSection - Component hiển thị phần bình luận dạng bottom sheet
 *
 * Component này hiển thị danh sách bình luận, cho phép người dùng:
 * - Xem các bình luận và phản hồi
 * - Mở rộng/thu gọn các phản hồi
 * - Thêm bình luận mới
 * - Thêm reaction vào bình luận
 *
 * @component
 */

interface CommentItemProps {
  comment: Comment;
  color: any; // TODO: Thay thế any bằng ThemeColors type
}

/**
 * CommentItem - Hiển thị một bình luận
 *
 * @component
 * @param {CommentItemProps} props
 * @param {Comment} props.comment - Dữ liệu bình luận cần hiển thị
 * @param {any} props.color - Object chứa các màu sắc theo theme
 */

interface ReplyItemProps {
  reply: Comment;
  color: any;
}

/**
 * ReplyItem - Hiển thị một phản hồi cho bình luận
 *
 * @component
 * @param {ReplyItemProps} props
 * @param {Comment} props.reply - Dữ liệu phản hồi cần hiển thị
 * @param {any} props.color - Object chứa các màu sắc theo theme
 */

interface ReactionsListProps {
  reactions: string[];
  onReactionPress: (reaction: string) => void;
}

/**
 * ReactionsList - Hiển thị danh sách các reaction có thể chọn
 *
 * @component
 * @param {ReactionsListProps} props
 * @param {string[]} props.reactions - Mảng các emoji reaction
 * @param {Function} props.onReactionPress - Callback khi chọn reaction
 */

/**
 * Cách sử dụng CommentSection:
 *
 * ```tsx
 * import { CommentSection } from './components/CommentSection';
 *
 * function App() {
 *   return (
 *     <CommentSection />
 *   );
 * }
 * ```
 *
 * Component này tự quản lý state và không yêu cầu props từ bên ngoài.
 * Sử dụng ThemeContext để lấy theme hiện tại.
 *
 * TODO:
 * - Thêm prop để truyền vào danh sách bình luận thay vì sử dụng mock data
 * - Thêm callback để xử lý khi gửi bình luận mới
 * - Thêm prop để tùy chỉnh danh sách reactions
 * - Thêm proper type cho color prop
 */

import React, {useState, useRef, useMemo, useCallback} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import {Send} from 'lucide-react-native';
import {FlashList} from '@shopify/flash-list';
import {Comments as comments, Comment} from '../src/MockData/comments.mock';
import styles from '../src/StyleSheet/Comment.Styles';

const CommentItem = React.memo(({comment, color}: CommentItemProps) => {
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
      <TouchableOpacity style={styles.likeButton}>
        <Text style={{fontSize: 16}}>❤️</Text>
      </TouchableOpacity>
    </View>
  );
});

const ReplyItem = React.memo(({reply, color}: ReplyItemProps) => {
  return (
    <View
      style={[
        styles.commentItem,
        styles.nestedComment,
        {borderBottomColor: color.border},
      ]}>
      <Image source={{uri: reply.avatar}} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={[styles.username, {color: color.text}]}>
            {reply.username}
          </Text>
          <Text style={[styles.content, {color: color.text}]}>
            {reply.content}
          </Text>
        </View>
        <View style={styles.commentFooter}>
          <Text style={[styles.timeAgo, {color: color.textSecondary}]}>
            {reply.timeAgo}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.reply, {color: color.textSecondary}]}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.likeButton}>
        <Text style={{fontSize: 16}}>❤️</Text>
      </TouchableOpacity>
    </View>
  );
});

const ReactionsList = React.memo(
  ({reactions, onReactionPress}: ReactionsListProps) => {
    return (
      <FlashList
        data={reactions}
        horizontal
        estimatedItemSize={50}
        showsHorizontalScrollIndicator={false}
        renderItem={({item: reaction}) => (
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => onReactionPress(reaction)}>
            <Text style={styles.reactionEmoji}>{reaction}</Text>
          </TouchableOpacity>
        )}
      />
    );
  },
);

export const CommentSection = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const [newComment, setNewComment] = useState('');
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});

  // ref
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const reactions: string[] = ['👊', '🔥', '🐝', '😎', '⭐', '🙌', '👾', '💪'];

  const handleReactionPress = useCallback(
    (reaction: string) => {
      setNewComment(reaction + newComment);
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
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={{backgroundColor: color.background}}
      handleIndicatorStyle={{backgroundColor: color.text}}>
      <View style={styles.header}>
        <Text style={[styles.headerText, {color: color.text}]}>Comments</Text>
      </View>

      <BottomSheetScrollView
        style={[styles.commentsContainer, {backgroundColor: color.background}]}
        contentContainerStyle={{paddingBottom: 20}}>
        {comments.map(comment => (
          <View key={comment.id}>
            <CommentItem comment={comment} color={color} />
            {comment.replies &&
              comment.replies.items &&
              comment.replies.items.length > 0 && (
                <>
                  {expandedComments[comment.id] &&
                    comment.replies.items.map(reply => (
                      <ReplyItem key={reply.id} reply={reply} color={color} />
                    ))}
                  <TouchableOpacity
                    style={styles.viewMoreButton}
                    onPress={() => toggleReplies(comment.id)}>
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
                </>
              )}
          </View>
        ))}
      </BottomSheetScrollView>

      <View
        style={[
          styles.reactionsContainer,
          {
            borderTopColor: color.border,
            backgroundColor: color.background,
          },
        ]}>
        <ReactionsList
          reactions={reactions}
          onReactionPress={handleReactionPress}
        />
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
            <Send size={20} color={color.blue} />
          </TouchableOpacity>
        )}
      </View>
    </BottomSheet>
  );
};
