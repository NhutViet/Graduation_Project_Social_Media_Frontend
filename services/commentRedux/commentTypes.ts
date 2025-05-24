export interface Comment {
  id: string;
  postID: string;
  parentID: string | null;
  content: string;
  mediaUrl?: string | null;
  isDeleted: boolean;
  likedBy: string[];
  createdAt: string;
  reply: [Comment[], UserComment];
}

export interface UserComment {
  _id: string;
  handleName: string;
  profilePic?: string;
}

export interface CommentPost {
  comment: Comment;
  user: UserComment;
}
