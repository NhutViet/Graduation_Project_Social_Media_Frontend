import {PostData} from './posts.mock';

export interface User {
  id: string;
  name: string;
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
  followers: 123,
  following: 193,
  posts: PostData,
  isPrivate: true,
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio:
    "🌟 Passionate photographer capturing life's beautiful moments through my lens.\n" +
    '🎨 Creating visual stories that inspire and connect people around the world.\n' +
    '✈️ Travel enthusiast exploring diverse cultures and sharing unique perspectives.\n' +
    '📸 Specializing in portrait, landscape, and street photography with a modern twist.\n' +
    '🔗 Portfolio: vsco.co/phranki3 | Available for collaborations and projects',
};
