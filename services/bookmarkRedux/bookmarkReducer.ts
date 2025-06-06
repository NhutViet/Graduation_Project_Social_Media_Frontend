import {createSlice} from '@reduxjs/toolkit';
import {
  createPlaylist,
  getAllPlaylists,
  getItemsOfPlaylist,
  removeBookmark,
  saveBookmark,
} from './bookmarkSlice';
import {ResAllPlaylist, ResCreatePlaylist} from './bookmarkTypes';

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

        const {playlistId, itemID, itemType} = action.payload;

        if (!state.itemsByPlaylist[playlistId]) {
          state.itemsByPlaylist[playlistId] = [];
        }

        const exists = state.itemsByPlaylist[playlistId].some(
          item => item.itemID === itemID && item.itemType === itemType,
        );

        if (!exists) {
          state.itemsByPlaylist[playlistId].push({itemID, itemType});
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

        const {postId, playlistId} = action.payload;
        console.log('action payload ', action.payload);

        const itemss = state.itemsByPlaylist[playlistId];
        if (itemss) {
          state.itemsByPlaylist[playlistId] = itemss.filter(
            item => item.itemID !== postId[0],
          );
        }
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

        console.log('new Playlist 🤡: ', newPlaylist);

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
      });
  },
});

export default bookmarkReducer.reducer;
