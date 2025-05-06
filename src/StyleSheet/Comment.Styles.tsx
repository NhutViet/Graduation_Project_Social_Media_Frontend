import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  commentsList: {
    paddingHorizontal: 15,
  },
  commentItem: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: '600',
    marginRight: 8,
    fontSize: 13,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
  },
  commentFooter: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 12,
    marginRight: 12,
    color: '#8e8e8e',
  },
  replyButton: {
    fontSize: 12,
    marginRight: 12,
    color: '#8e8e8e',
  },
  likes: {
    fontSize: 12,
    color: '#8e8e8e',
  },
  likeButton: {
    padding: 8,
    marginLeft: 'auto',
  },
  heart: {
    fontSize: 16,
  },
  reactionsBar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#DBDBDB',
    backgroundColor: 'white',
  },
  reactionButton: {
    marginRight: 25,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  commentInput: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#DBDBDB',
    backgroundColor: 'white',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },
  viewRepliesButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  viewRepliesText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8e8e8e',
  },
  nestedComment: {
    marginLeft: 48,
  },
  repliesContainer: {
    marginTop: 4,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0095f6',
  },
});
