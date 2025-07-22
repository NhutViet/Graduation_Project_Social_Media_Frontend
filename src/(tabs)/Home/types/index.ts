import {Media} from '../../../../services/postRedux/postTypes';
import {AppDispatch} from '../../../../services/store';

export interface ItemHomeProps {
  _id: string;
  type: 'post' | 'reel' | 'story' | string;
  caption: string;
  share: number;
  createdAt: string;
  isLike: boolean;
  isBookmarked?: boolean;
  isFollow: boolean;
  likeCount: number;
  commentCount: number;
  media: Media[];
  user: User;
  music?: Music;
  musicInfo?: MusicInfo;
  currentVisible: boolean;
  isFocused: boolean;
  isVisible?: boolean;
  sheetRef: any;
  setSelectedPostId?: (v: {postId: string; receiverId: string}) => void;
  clickableHashtags?: boolean;
  SelectedPostRef?: any;
  onFollowChange?: any;
}

export interface User {
  _id: string;
  handleName: string;
  profilePic: string;
}

interface Music {
  musicId: string;
  timeStart?: number;
  timeEnd?: number;
}

interface MusicInfo {
  link?: string;
  song?: string;
  author?: string;
  coverImg?: string;
}

export interface HandleBookmarkParams {
  isBookmarked: boolean;
  _id: string;
  refreshToken: string;
  setIsBookmarked: (v: boolean) => void;
  dispatch: AppDispatch;
}

export interface PostItem {
  _id: string;
  type: string;
  caption: string;
  createdAt: string;
  media: Media[];
  user: User;
  isLike: boolean;
  isBookmarked: boolean;
  commentCount: number;
  likeCount: number;
  share: any;
  music?: any;
  isFollow?: boolean;
}
