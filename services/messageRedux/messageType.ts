export interface Sender {
  userId: string;
  handleName: string;
  profilePic: string;
}

interface MediaMessage {
  type: string;
  url?: string;
}

export interface Message {
  _id: string;
  roomId: string;
  content: string;
  media?: MediaMessage;
  createdAt: string;
  sender: Sender;
}
