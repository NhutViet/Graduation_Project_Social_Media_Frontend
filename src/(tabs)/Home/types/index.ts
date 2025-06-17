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
  openComment: (postId: string) => void;
  likeCount: number;
  commentCount: number;
  music?: MusicInfo;
  musicInfo?: MusicInfo;
  isFollow: boolean;
  isBookmarked?: boolean;
}

interface User {
  _id: string;
  handleName: string;
  profilePic: string;
}

interface MusicInfo {
  link: string;
  timeStart?: number;
  timeEnd?: number;
}

export interface HandleBookmarkParams {
  isBookmarked: boolean;
  _id: string;
  refreshToken: string;
  setIsBookmarked: (v: boolean) => void;
  dispatch: AppDispatch;
}
