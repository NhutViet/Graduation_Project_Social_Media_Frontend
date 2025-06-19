export interface Reel {
  _id: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  media: {
    videoUrl: string;
    audioId: string;
    audioUrl: string;
  };
  owner: {
    handleName: string;
    profilePic: string;
  };
}
