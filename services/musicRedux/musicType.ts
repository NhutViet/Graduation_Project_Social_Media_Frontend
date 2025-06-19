export interface Music {
  _id: string;
  song: string;
  link: string;
  author: string;
  coverImg: boolean;
  createdAt?: string;
  updatedAt?: string;
  isBookmarked?: boolean;
}
