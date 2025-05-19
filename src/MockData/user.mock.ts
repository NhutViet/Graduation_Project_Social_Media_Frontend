import {PostData} from './posts.mock';

export interface User {
  id: string;
  name: string; // @claire
  handleName: string;
  followers: number;
  following: number;
  posts: typeof PostData;
  isPrivate: boolean;
  avatar: string;
  bio?: string;
}

export const UserMock: User = {
  id: '1',
  name: 'claire',
  handleName: 'helophrank',
  followers: 141,
  following: 193,
  posts: PostData,
  isPrivate: true,
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio: 'vsco.co/phranki3',
};
