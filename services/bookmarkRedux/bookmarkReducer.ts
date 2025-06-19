import {createSlice} from '@reduxjs/toolkit';
import {
  addMusicToPlaylist,
  createPlaylist,
  getAllPlaylists,
  getItemsOfPlaylist,
  removeBookmark,
  removeMusicFromPlaylist,
  saveBookmark,
  switchBookmark,
} from './bookmarkSlice';
import {ResCreatePlaylist} from './bookmarkTypes';

interface Playlist {
  id: string;
  name: string;
}

interface BookmarkItem {
  itemID: string;
  itemType: string;
}

interface BookmarkState {
  playlists: Playlist[];
  itemsByPlaylist: {
    [playlistId: string]: BookmarkItem[];
  };
  paginationByPlaylist: {
    [playlistId: string]: any;
  };
  isloading: boolean;
  isError: boolean;
  messageError: string;
  isSuccess: boolean;
}

const initialState: BookmarkState = {
  playlists: [], // mỗi playlist có thể chứa nhiều item
  itemsByPlaylist: {},
  paginationByPlaylist: {},
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

        if (!exists) {
          state.itemsByPlaylist[playlistID].push({itemID, itemType});
        }
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

        const {postId} = action.payload;
        Object.keys(state.itemsByPlaylist).forEach(playlistId => {
          const items = state.itemsByPlaylist[playlistId];

          if (items && items.length > 0) {
            state.itemsByPlaylist[playlistId] = items.filter(
              item => item.itemID !== postId[0],
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

        const res = action.payload as ResCreatePlaylist;

        const newPlaylist: Playlist = {
          id: res.id,
          name: res.playlistName,
        };

        state.playlists.push(newPlaylist);
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

        const newPlaylist: Playlist[] = action?.payload?.map(playlist => ({
          id: playlist._id,
          name: playlist.playlistName,
        }));

        newPlaylist?.forEach(newItem => {
          const exists = state.playlists.some(p => p.id === newItem.id);
          if (!exists) {
            state.playlists.push(newItem);
          }
        });
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

        if (state.itemsByPlaylist[playlistId]) return;

        state.itemsByPlaylist[playlistId] = items.map(item => ({
          itemID: item.itemID,
          itemType: item.itemType,
        }));

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

        const {playlistID: playlistId, itemID: postId} = action.payload;

        // Xoá post khỏi tất cả playlists đang chứa
        for (const key in state.itemsByPlaylist) {
          const items = state.itemsByPlaylist[key];
          state.itemsByPlaylist[key] = items.filter(
            item => item.itemID !== postId,
          );
        }

        // Thêm post vào playlist mới nếu đã có dữ liệu load
        if (state.itemsByPlaylist[playlistId]) {
          state.itemsByPlaylist[playlistId].unshift({
            itemID: postId,
            itemType: 'post', // Nếu itemType khác thì chỉnh lại
          });
        }
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
        state.messageError = action.payload?.message || 'Lưu âm thanh thất bại.';
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
        state.messageError = action.payload?.message || 'Bỏ lưu âm thanh thất bại.';
      })
  },
});

export const {resetBookmarkState} = bookmarkReducer.actions;
export default bookmarkReducer.reducer;
