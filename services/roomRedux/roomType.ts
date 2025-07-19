import {MediaMessage} from '@services/messageRedux/messageType';

export interface RoomUser {
  _id: string;
  handleName?: string;
  profilePic: string;
}

export interface LatestMessage {
  _id: string;
  messageId: string;
  content: string;
  senderId: string;
  media: MediaMessage;
  createdAt: string;
}

export interface Room {
  _id: string;
  name: string;
  type: string;
  theme: string;
  created_by: string;
  user_ids: RoomUser[];
  createdAt: string;
  updatedAt: string;
  latestMessage?: LatestMessage;
  __v: number;
}

export interface UpdateRoomThemeArgs {
  roomId: string;
  theme: string;
}

export interface UpdateRoomNameArgs {
  roomId: string;
  name: string;
}

export interface CreateRoomResponse {
  room: Room;
  isExisted: boolean;
  message: string;
}

export interface CreateRoomDto {
  name?: string;
  user_ids?: string[];
  type?: string;
}

export interface ResRoomUser {
  count: number;
  users: {
    username: string;
    handleName: string;
    profilePic: string;
    user_id?: string;
    isFollow: boolean;
    isCreated: boolean;
  }[];
}