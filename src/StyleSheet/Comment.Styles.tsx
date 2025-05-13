import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  headerText: {
    fontSize: 16,
    fontWeight: '600',
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
  nestedComment: {
    marginLeft: 32,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#a1a1a199',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButtonText: {
    fontSize: 16,
  },
  commentsContainer: {
    flex: 1,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    marginRight: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
  },
  commentFooter: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 12,
    marginRight: 12,
  },
  reply: {
    fontSize: 12,
    marginRight: 12,
  },
  likes: {
    fontSize: 12,
  },
  likeButton: {
    padding: 4,
  },
  viewMoreButton: {
    paddingLeft: 44,
    paddingVertical: 8,
  },
  viewMoreText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    marginBottom: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 32,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 24,
    flex: 1,
    fontSize: 16,
    padding: 10,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
});
