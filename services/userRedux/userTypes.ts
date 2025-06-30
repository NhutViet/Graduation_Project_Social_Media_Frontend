export interface User {
  deletedAt: boolean;
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  handleName: string;
  bio: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  profilePic: string;
  isVip: boolean;
  createdAt: string;
  updateAt: string;
  currentSessionId: string;
}

export interface UserRes {
  user: User;
}

export interface EditUserDto {
  username?: string;
  bio?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  address?: string;
  dateOfBirth?: string;
  handleName?: string;
  profilePic?: string;
}

export interface PublicUserRes {
  username: string;
  phoneNumber: string;
  handleName: string;
  bio: string;
  address: string;
  gender: string;
  profilePic: string;
  isVip: boolean;
  userFollowing: boolean;
  userBlocked: boolean;
}

