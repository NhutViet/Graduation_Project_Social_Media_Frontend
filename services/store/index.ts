import {configureStore} from '@reduxjs/toolkit';
import postReducer from '../postRedux/postReducer';
import commentReducer from '../commentRedux/commentReducer';
import musicReducer from '../musicRedux/musicReducer';

export const store = configureStore({
  reducer: {
    post: postReducer,
    comment: commentReducer,
    music: musicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
