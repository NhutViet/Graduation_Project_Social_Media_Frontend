import {createSlice} from '@reduxjs/toolkit';
import {
  addMusicToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllBookmark,
  getAllPlaylists,
  getItemsOfPlaylist,
  removeBookmark,
  removeMusicFromPlaylist,
  reNamePalylistBookmark,
  saveBookmark,
  switchBookmark,
} from './bookmarkSlice';
import {
  Pagination,
  Playlist,
  PlaylistItem,
} from './bookmarkTypes';

interface BookmarkState {
  playlists: Playlist[];
  itemsByPlaylist: {
    [playlistId: string]: PlaylistItem[];
  };
  paginationByPlaylist: {
    [playlistId: string]: Pagination;
  };
  allItems: PlaylistItem[];
  allPagination: Pagination | {};
  isloading: boolean;
  isError: boolean;
  messageError: string;
  isSuccess: boolean;
}

const initialState: BookmarkState = {
  playlists: [], // mỗi playlist có thể chứa nhiều item
  itemsByPlaylist: {},
  paginationByPlaylist: {},
  allItems: [],
  allPagination: {},
  isloading: false,
  isError: false,
  messageError: '',
  isSuccess: false,
};

const bookmarkReducer = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    resetBookmarkState: () => initialState,
    updateFollowStatusForUser: (
      state,
      action: {
        payload: {userId: string; isFollow: boolean};
      },
    ) => {
      const {userId, isFollow} = action.payload;

      Object.keys(state.itemsByPlaylist).forEach(playlistId => {
        const items = state.itemsByPlaylist[playlistId];

        if (items && items.length > 0) {
          state.itemsByPlaylist[playlistId] = items.map(item => {
            if (item.user?._id === userId) {
              return {
                ...item,
                user: {
                  ...item.user,
                  isFollow,
                },
              };
            }
            return item;
          });
        }
      });
    },
  },
  extraReducers: builder => {
    builder
      ////lưu bài post
      .addCase(saveBookmark.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(saveBookmark.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;

        const {playlistID, itemID, itemType} = action.payload;

        if (!state.itemsByPlaylist[playlistID]) {
          state.itemsByPlaylist[playlistID] = [];
        }

        const exists = state.itemsByPlaylist[playlistID].some(
          item => item.itemID === itemID && item.itemType === itemType,
        );

        // if (!exists) {
        //   state.itemsByPlaylist[playlistID].push({itemID, itemType});
        // }
      })
      .addCase(saveBookmark.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError = action.payload?.message || 'Lưu thất bại';
      })
      //// bỏ lưu bài post
      .addCase(removeBookmark.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;

        const {postIds} = action.payload;
        Object.keys(state.itemsByPlaylist).forEach(playlistId => {
          const items = state.itemsByPlaylist[playlistId];

          if (items && items.length > 0) {
            state.itemsByPlaylist[playlistId] = items.filter(
              item => !postIds.includes(item.itemID || ''),
            );
          }
        });
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError = action.payload?.message || 'Bỏ lưu thất bại';
      })
      ////tạo playlist
      .addCase(createPlaylist.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError =
          action.payload?.message || 'Tạo danh sách thất bại';
      })
      ////lấy danh sachs playlist
      .addCase(getAllPlaylists.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(getAllPlaylists.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;
        state.playlists = action.payload;
      })
      .addCase(getAllPlaylists.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError =
          action.payload?.message || 'Lấy danh sách thất bại';
      })
      ////lấy bài post của playlist
      .addCase(getItemsOfPlaylist.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(getItemsOfPlaylist.fulfilled, (state, action) => {
        const {items, pagination, playlistId} = action.payload;
        state.isloading = false;
        state.isSuccess = true;

        state.itemsByPlaylist[playlistId] = items || [];

        state.paginationByPlaylist[playlistId] = pagination;
      })
      .addCase(getItemsOfPlaylist.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError =
          action.payload?.message || 'Lấy danh sách thất bại';
      })
      // Chuyển bài post sang playlist khác
      .addCase(switchBookmark.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(switchBookmark.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;
      })
      .addCase(switchBookmark.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError =
          action.payload?.message || 'Chuyển mục lưu thất bại';
      })
      ////lưu âm thanh
      .addCase(addMusicToPlaylist.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(addMusicToPlaylist.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;
      })
      .addCase(addMusicToPlaylist.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError =
          action.payload?.message || 'Lưu âm thanh thất bại.';
      })
      //// bỏ lưu âm thanh
      .addCase(removeMusicFromPlaylist.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(removeMusicFromPlaylist.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;
      })
      .addCase(removeMusicFromPlaylist.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError =
          action.payload?.message || 'Bỏ lưu âm thanh thất bại.';
      })
      ///lấy tất cả item
      .addCase(getAllBookmark.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(getAllBookmark.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;
        state.allItems = action.payload.data || [];
        state.allPagination = action.payload.pagination || {};
      })
      .addCase(getAllBookmark.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError =
          action.payload?.message || 'Lấy danh sách bài viết đã lưu thất bại';
      })
      // đổi tên playlist
      .addCase(reNamePalylistBookmark.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(reNamePalylistBookmark.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;

        const updated = action.payload;
        const index = state.playlists.findIndex(p => p._id === updated._id);
        if (index !== -1) {
          state.playlists[index].playlistName = updated.playlistName;
        }
      })
      .addCase(reNamePalylistBookmark.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError = action.payload?.message || 'Đổi tên playlist thất bại';
      })
      // xóa playlist
      .addCase(deletePlaylist.pending, state => {
        state.isloading = true;
        state.isError = false;
        state.messageError = '';
        state.isSuccess = false;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.isloading = false;
        state.isSuccess = true;

        const deletedPlaylistId = action.meta.arg.id;

        state.playlists = state.playlists.filter(p => p._id !== deletedPlaylistId);

        delete state.itemsByPlaylist[deletedPlaylistId];
        delete state.paginationByPlaylist[deletedPlaylistId];
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.messageError =
          action.payload?.message || 'Xóa danh sách thất bại';
      })
  },
});

export const {resetBookmarkState, updateFollowStatusForUser} = bookmarkReducer.actions;
export default bookmarkReducer.reducer;
