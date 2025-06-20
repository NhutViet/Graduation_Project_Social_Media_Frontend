import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  Playlist,
  ReqBookmark,
  ReqCreatePlaylist,
  ReqGetItemPlaylist,
  ReqRemoveBookmark,
  ResBookmark,
  ResCreatePlaylist,
  ResGetItemPlaylist,
  ResSwitchBookmark,
} from './bookmarkTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const saveBookmark = createAsyncThunk<
  ResBookmark,
  ReqBookmark,
  {rejectValue: {message: string}}
>(
  'bookmark-playlists/add-default',
  async ({postId, refreshToken}, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(
        API.POST_SAVE_BOOKMARK,
        {
          postId,
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.response?.data?.message || 'Lưu bài viết thất bại',
      });
    }
  },
);

export const removeBookmark = createAsyncThunk<
  {message: string; postIds: string[]},
  ReqRemoveBookmark,
  {rejectValue: {message: string}}
>(
  'bookmark-items/remove',
  async ({postIds, refreshToken}, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.delete(API.DELETE_BOOKMARK, {
        data: {
          postIds,
        },
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const message = res.data.message || 'Xóa thành công';
      return {message, postIds};
    } catch (error: any) {
      return rejectWithValue({
        message: error?.response?.data?.message || 'Bỏ lưu thất bại',
      });
    }
  },
);

export const createPlaylist = createAsyncThunk<
  ResCreatePlaylist,
  ReqCreatePlaylist,
  {rejectValue: {message: string}}
>(
  'bookmark-playlist/add',
  async ({playlistName, refreshToken}, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(
        API.POST_CREATE_PLAYLIST,
        {
          playlistName,
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue({
        message:
          error?.response?.data?.message || 'Tạo danh sách lưu thất bại.',
      });
    }
  },
);

export const getAllPlaylists = createAsyncThunk<
  Playlist[],
  {refreshToken: string},
  {rejectValue: {message: string}}
>('bookmark-playlists/all', async ({refreshToken}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.get(API.GET_ALL_PLAYLIST, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    // Trả mảng playlist đầy đủ
    const playlists: Playlist[] = res.data;
    return playlists;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.response?.data?.message || 'Lấy danh sách lưu thất bại.',
    });
  }
});


export const getItemsOfPlaylist = createAsyncThunk<
  ResGetItemPlaylist,
  ReqGetItemPlaylist,
  {rejectValue: {message: string}}
>(
  'bookmark-item/allOfPlaylist',
  async (
    {playlistId, refreshToken, page = 1, limit = 20},
    {rejectWithValue},
  ) => {
    try {
      const res = await axiosInstance.get(
        `${API.GET_ITEM_PLAYLIST}/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
          params: {page, limit},
        },
      );
      return {
        ...res.data,
        playlistId,
      };
    } catch (error: any) {
      return rejectWithValue({
        message:
          error?.response?.data?.message || 'Lấy danh sách bài viết thất bại.',
      });
    }
  },
);


export const switchBookmark = createAsyncThunk<
  ResSwitchBookmark,
  {postIds: string[], playlistId: string, refreshToken: string},
  {rejectValue: {message: string}}
>(
  'bookmark-playlists/switch',
  async ({postIds, playlistId, refreshToken}, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(
        API.POST_SWITCH_PLAYLIST,
        {
          postIds,
          playlistId
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.response?.data?.message || 'Chuyển mục lưu thất bại.',
      });
    }
  },
);