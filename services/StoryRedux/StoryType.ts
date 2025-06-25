export interface Story {
  _id: string;
  ownerId: string;
  type?: 'stories' | 'highlights';
  mediaUrl: string;
  isArchived?: boolean;
  viewedByUsers: UserMini[];
  likedByUsers: string[];
  collectionName?: string;
  storyId?: string[];
  thumbnail: string;
  createdAt: string;
  updatedAt?: string;

  music?: {
    _id: string;
    link: string;
    time_start: number;
    time_end: number;
  };
  content?: {
    text: string;
    x: number;
    y: number;
  };
  isSeen?: boolean;
}

export interface UserMini {
  _id: string;
  username: string;
  profilePic: string;
  handleName?: string;
}

export interface userFollow {
  _id: string;
  handleName: string;
  profilePic: string;
  username: string;
  stories: string[];
  storyDetails?: Story[];
}

export interface CreateHighlightPayload {
  collectionName: string;
  thumbnail: string;
  storyId: string[];
}

export interface FetchHighlightPayload {
  userId: string;
}
