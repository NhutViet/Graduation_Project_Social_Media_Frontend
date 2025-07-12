import {Media} from '../../../../services/postRedux/postTypes';
import {AppDispatch} from '../../../../services/store';

export interface ItemHomeProps {
  _id: string;
  type: string;
  caption: string;
  share: number;
  createdAt: string;
  isLike: boolean;
  media: Media[];
  user: User;
  currentVisible: boolean;
  isFocused: boolean;
  sheetRef: any;
  likeCount: number;
  commentCount: number;
  music?: Music;
  musicInfo?: MusicInfo;
  isFollow: boolean;
  isBookmarked?: boolean;
  SelectedPostRef?: any;
  clickableHashtags?: boolean;
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
