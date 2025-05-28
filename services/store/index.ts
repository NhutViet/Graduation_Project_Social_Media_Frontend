import {configureStore} from '@reduxjs/toolkit';
import postReducer from '../postRedux/postReducer';
import commentReducer from '../commentRedux/commentReducer';
import musicReducer from '../musicRedux/musicReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import userReducer from '../userRedux/userReducer';

const persistUserConfig = {
  key: 'user',
  storage: AsyncStorage,
};

export const store = configureStore({
  reducer: {
    post: postReducer,
    comment: commentReducer,
    music: musicReducer,
    user: persistReducer(persistUserConfig, userReducer),
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
