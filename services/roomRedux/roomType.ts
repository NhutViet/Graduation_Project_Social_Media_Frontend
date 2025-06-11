export interface RoomUser {
  _id: string;
  handleName: string;
  profilePic?: string;
}

export interface Room {
  _id: string;
  name: string;
  type: string;
  created_by: string;
  user_ids: RoomUser[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}