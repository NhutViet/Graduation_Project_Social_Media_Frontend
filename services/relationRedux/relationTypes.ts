export type RelationType = 'FOLLOWER' | 'FOLLOWING' | 'BLOCK' | 'REQUEST';

export interface Relation {
  id: string;
  userOneId: string;
  userTwoId: string;
  relation: RelationType;
  create_at: string;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  handleName: string;
  bio: string;
  address: string;
  gender: string;
  profilePic: string;
  dateOfBirth: string;
  isVip: boolean;
  deletedAt: boolean;
  isFollowing: boolean;
  isMeFollowing?: boolean;
}

export interface RelationWithUser {
  relation: Relation;
  user: UserProfile;
}