import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  header: {
    borderRadius: 40,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#a1a1a199',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  commentsContainer: {
    flex: 1,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  username: {
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    fontSize: 13,
  },
  commentFooter: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  timeAgo: {
    fontSize: 12,
  },
  reply: {
    fontSize: 12,
    fontWeight: '600',
  },
  likes: {
    fontSize: 12,
  },
  likeButton: {
    padding: 8,
  },
  reactionsContainer: {
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  reactionButton: {
    padding: 10,
    marginHorizontal: 4,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DBDBDB',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  nestedComment: {
    marginLeft: 32,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#a1a1a199',
  },
  viewMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 48,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
