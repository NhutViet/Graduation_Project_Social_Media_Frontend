export interface Sender {
  userId: string;
  handleName: string;
  profilePic: string;
}

export interface Message {
  _id: string;
  roomId: string;
  content: string;
  media?: string;
  createdAt: string;
  sender: Sender;
}