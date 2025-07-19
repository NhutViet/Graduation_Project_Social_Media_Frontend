import {createSlice} from '@reduxjs/toolkit';
import {Room} from './roomType';
import {
  createRoom,
  fetchMyRooms,
  fetchMyWaitingRooms,
  getRoomById,
  updateRoomName,
  updateRoomTheme,
} from './roomSlice';

interface RoomState {
  rooms: Room[];
  waitingRooms: Room[];
  loading: boolean;
  error: string | null;
  createdRoom: Room | null;
  isExisted: boolean;
  message: string | null;
}

const initialState: RoomState = {
  rooms: [],
  waitingRooms: [],
  loading: false,
  error: null,
  createdRoom: null,
  isExisted: false,
  message: '',
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    registerRoom: state => {
      state.rooms = [];
      state.waitingRooms = [];
      state.loading = false;
      state.error = null;
      state.createdRoom = null;
      state.isExisted = false;
      state.message = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMyRooms.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchMyRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMyWaitingRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.waitingRooms = action.payload;
      })

      .addCase(updateRoomTheme.fulfilled, (state, action) => {
        const updatedRoom = action.payload;
        const index = state.rooms.findIndex(
          room => room._id === updatedRoom._id,
        );
        if (index !== -1) {
          state.rooms[index].theme = updatedRoom.theme;
        }
      })

      .addCase(updateRoomName.fulfilled, (state, action) => {
        const updatedRoom = action.payload;
        const index = state.rooms.findIndex(
          room => room._id === updatedRoom._id,
        );
        if (index !== -1) {
          state.rooms[index].name = updatedRoom.name;
        }
      })

      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.createdRoom = action.payload.room;
        state.isExisted = action.payload.isExisted;
        state.message = action.payload.message;

        const exists = state.rooms.some(r => r._id === action.payload.room._id);
        if (!exists) {
          state.rooms.push(action.payload.room);
        }
      })

      .addCase(createRoom.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getRoomById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomById.fulfilled, (state, action) => {
        state.loading = false;

        const exists = state.rooms.some(room => room._id === action.payload._id);
        if (!exists) {
          if(action.payload.type === 'accept'){
            state.rooms.push(action.payload);
          }else{
            state.waitingRooms.push(action.payload);
          }
          
        }
      })
      .addCase(getRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Lấy chi tiết phòng chat thất bại.';
      })
  },
});

export const {registerRoom} = roomSlice.actions;
export default roomSlice.reducer;
