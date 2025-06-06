export interface Story {
  _id: string;
  userId: string;
  type: 'stories' | 'highlights';
  mediaUrl: string;
  viewsCount: number;
  isArchived: boolean;
  viewerId: string[];
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
