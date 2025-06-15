export interface Story {
  _id: string;
  ownerId: string;
  type: 'stories' | 'highlights';
  mediaUrl: string;
  isArchived: boolean;
  viewedByUsers: string[];
  likedByUsers: string[];
  collectionName?: string;
  storyId?: string[];
  createdAt: string;
  updatedAt: string;
}
export interface userFollow {
  _id: string;
  handleName: string;
  profilePic: string;
  stories: string[];
}
