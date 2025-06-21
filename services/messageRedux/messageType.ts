export interface Sender {
  userId: string;
  handleName: string;
  profilePic: string;
}

export interface MediaMessage {
  type: string;
  url?: string;
  duration?: number;
}

export interface Message {
  _id: string;
  roomId: string;
  content: string;
  media?: MediaMessage;
  createdAt: string;
  sender: Sender;
}
