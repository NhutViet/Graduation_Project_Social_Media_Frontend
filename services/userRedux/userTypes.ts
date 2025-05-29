export interface User {
  _id: string;
  username: string;
  email: string;
  handleName: string;
  isVip: boolean;
  deletedAt: boolean;
  createdAt: string;
  updateAt: string;
  refreshToken?: string;
}
