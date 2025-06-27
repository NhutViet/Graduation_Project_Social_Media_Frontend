export interface ResLikePost {
  userId: string;
  postId: string;
}

export interface LikePostParams {
  postId: string;
  refreshToken: string;
  senderId: string;
  receiverId: string;
  handleName: string;
}
