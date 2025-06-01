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
