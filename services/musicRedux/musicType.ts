export interface Music {
  _id: string;
  song: string;
  link: string;
  author: string;
  coverImg: string;
  createdAt?: string;
  updatedAt?: string;
  isBookmarked?: boolean;
}
