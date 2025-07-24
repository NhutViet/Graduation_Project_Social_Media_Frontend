export interface ReqBookmark {
  postId?: string;
  playlistId?: string;
  refreshToken?: string;
}

export interface ReqRemoveBookmark {
  postIds: string[];
  playlistId?: string;
  refreshToken?: string;
}

export interface ResBookmark {
  playlistID: string;
  itemID: string;
  itemType: string;
  isDeleted: boolean;
  _id: string;
  createdAt: string;
  updateAt: string;
}

export interface ReqCreatePlaylist {
  playlistName: string;
  refreshToken: string;
}

export interface ResCreatePlaylist {
  _id: string;
  userID: string;
  playlistName: string;
  coverImg: string;
  postCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  _id: string;
  userID: string;
  playlistName: string;
  coverImg: string;
  postCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnails: string[];
}

export interface ResAllPlaylist {
  data: Playlist[];
}

export interface Music {
  musicId: string;
  timeStart: number;
  timeEnd: number;
}

export interface MusicInfo {
  song: string;
  link: string;
  author: string;
  coverImg: string;
}

export interface User {
  _id: string;
  handleName: string;
  profilePic: string;
}

export interface Media {
  _id: string;
  postID: string;
  videoUrl: string;
  tags?: any;
}

export interface MediaR {
  _id: string;
  postID: string;
  imageUrl: string;
  tags?: any;
}

export interface PlaylistItem {
  playlistID?: string;
  itemID?: string;
  itemType?: string;
  isDeleted?: boolean;
  _id: string;
  userID?: string;
  type?: string;
  caption?: string;
  isFlagged?: boolean;
  nsfw?: boolean;
  isEnable?: boolean;
  location?: string;
  isArchived?: string;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  share?: number;
  media?: Media[] | MediaR[];
  likeCount?: number;
  isLike?: boolean;
  music?: Music;
  musicInfo?: MusicInfo;
  user?: User;
  commentCount?: number;
  isBookmarked?: boolean;
  isFollow?: boolean;

  // Các trường đặc biệt cho loại âm thanh (music)
  song?: string;
  link?: string;
  author?: string;
  coverImg?: string;
}

export interface Pagination {
  currentPage: number;
  totalPage: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ResGetItemPlaylist {
  message: string;
  data: PlaylistItem[];
  pagination: Pagination;
  playlistId: string;
}

export interface ReqGetItemPlaylist {
  playlistId: string;
  refreshToken: string;
  page?: number;
  limit?: number;
}

export interface Result {
  postId?: string;
  action?: string;
  message?: string;
  bookmark?: PlaylistItem[];
}

export interface Summary {
  created?: number;
  moved?: number;
  resurrected?: number;
  already_exists?: number;
  errors?: number;
}

export interface ResSwitchBookmark {
  success?: boolean;
  totalProcessed?: number;
  results: Result[];
  summary: Summary;
}

export interface ResAddMusic {
  playlistID: string;
  itemID: string;
  itemType: string;
  isDeleted: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
