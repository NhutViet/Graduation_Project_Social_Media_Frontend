export interface Tag {
  userId: string;
  handleName: string;
  positionX: number;
  positionY: number;
  _id: string;
}

export interface Media {
  _id: string;
  postID: string;
  imageUrl: string;
  tags: Tag[];
}

export interface Owner {
  _id: string;
  handleName: string;
  profilePic: string;
}

export interface TaggedPost {
  _id: string;
  owner: Owner;
  caption: string;
  media: Media[];
  share: number;
  likeCounts: number;
  commentCounts: number;
}
