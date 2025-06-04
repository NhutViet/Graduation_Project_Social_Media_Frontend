import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import postReducer from '../postRedux/postReducer';
import commentReducer from '../commentRedux/commentReducer';
import musicReducer from '../musicRedux/musicReducer';
import userReducer from '../userRedux/userReducer';
import storyReducer from '../StoryRedux/StoryReducer';
import reactionReducer from '../reactionRedux/reactionReducer';
import LikerReducer from '../likersRedux/likersReducer';


const persistUserConfig = {
  key: 'user',
  storage: AsyncStorage,
};

const persistedUserReducer = persistReducer(persistUserConfig, userReducer);

export const store = configureStore({
  reducer: {
    post: postReducer,
    comment: commentReducer,
    music: musicReducer,
    user: persistedUserReducer,
    stories: storyReducer,
    reactions: reactionReducer,
    likers: LikerReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
