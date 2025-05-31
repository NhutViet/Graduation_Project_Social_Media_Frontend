export interface Media {
  _id: string;
  postID: string;
  imageUrl?: string;
  videoUrl: string;
}

export interface Post {
  _id: string;
  userID: string;
  type: string;
  caption?: string;
  isFlagged?: boolean;
  nsfw?: boolean;
  isEnable: boolean;
  location?: string;
  isArchived?: boolean;
  view_count: number;
  share?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPost {
  _id: string;
  handleName: string;
  profilePic?: string;
}

export interface PostWithMedia {
  post: Post;
  media: Media[];
  user: UserPost;
}

export interface MediaItem {
  videoUrl?: string;
  imageUrl?: string;
}

export interface Music {
  song: string;
  link: string;
  author: string;
  coverImg: string;
}

export interface UploadPostPayload {
  post: {
    type: string;
    caption: string;
    isEnable: boolean;
  };
  media: MediaItem[];
  music?: Music;
}
