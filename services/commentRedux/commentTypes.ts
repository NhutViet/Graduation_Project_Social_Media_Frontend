export interface UserComment {
  _id: string;
  handleName: string;
  profilePic?: string;
}

export interface CommentPost {
  _id: string;
  postID: string;
  parentID?: string;
  content: string;
  mediaUrl?: string | null;
  isDeleted: boolean;
  createdAt: string;
  totalLikes: number;
  isLiked: boolean;
  reply: any;
  user: UserComment;
}

export interface AddCommentPayload {
  postID: string;
  parentID?: string;
  content: string;
  mediaUrl?: string | null;
}

export interface ReqComment {
  payload: AddCommentPayload;
  receiverId?: string;
  handleName?: string;
  postId: string;
  userId?: string;
  parentUserId?: string;
}
