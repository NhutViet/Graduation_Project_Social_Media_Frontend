export interface ReqGetPosts {
    type?: string;
    page?: number;
    limit?: number;
    userId?: string;
    refreshToken: string;
}

export interface Tags {
  _id: string;
  handleName: string;
  userId: string;
  positionX: number;
  positionY: number;
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
    tags?: Tags[];
}

export interface MediaR {
    _id: string;
    postID: string;
    imageUrl: string;
    tags?: Tags[];
}

export interface Item {
    _id?: string;
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
}

export type UserPostItem = Item;

export interface LikedPostItem extends Item {
  type: 'post' | 'reel';
//   dummy: boolean;
}

export interface LoadLiked {
  items: LikedPostItem[];
  pagination: Pagination;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface Load {
    items: Item[] | [];
    pagination: Pagination;
}

export interface ResGetPost {
    message: string;
    posts: Load;
}

export interface ResGetReels {
    message: string;
    reels: Load;
}

export interface ResGetPostsAndReels {
    message: string;
    posts: Load;
    reels: Load;
}

export enum TimeRange {
  TODAY = 'today',
  LAST_WEEK = 'last_week',
  LAST_MONTH = 'last_month',
  LAST_YEAR = 'last_year'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface ReqGetLikedPosts {
  page?: number;
  limit?: number;
  timeRange?: TimeRange;
  sortOrder?: SortOrder;
  refreshToken: string;
}

export interface ResGetLikedPosts {
  message: string;
  data: LikedPostItem[];
  pagination: Pagination;
}
