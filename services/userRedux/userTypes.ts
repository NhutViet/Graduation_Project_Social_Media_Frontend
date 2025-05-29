export interface User {
  deletedAt: boolean,
  _id: string,
  username: string,
  email: string,
  phoneNumber: string,
  handleName: string,
  bio: string,
  address: string,
  gender: string,
  profilePic: string,
  isVip: boolean,
  createdAt: string,
  updateAt: string,
  currentSessionId: string,
  refreshToken?: string;
};
