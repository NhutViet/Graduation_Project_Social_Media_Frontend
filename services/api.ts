export const BASE_URL = 'http://cirla.io.vn';
// export const BASE_URL = 'http://172.31.98.52:4001';
// export const BASE_URL = 'http://192.168.1.3:4001';
// export const BASE_URL = 'http://10.0.2.2:4001';
export const CallAppID = 41521435;
export const CallAppSign =
  '6c6785fccbe2469324a805ea64c58069dc7254723d60c056c925ab48d2aee6a4';
export const LiveStreamAppID = 192295587;
export const LiveStreamAppSign =
  '0baa6cfb9bb2efb6d8c859f6ef13dba0fa6eb2df520196e63b8ae8d44bd7663e';

export const API = {
  //// post
  GET_ALL_POST: 'posts/get-all-with-media',
  GET_REELS_POST: 'posts/get-all-reel-media',
  UPLOAD_POST: 'posts/with-media',
  HIDDEN_POST: 'user-hidden-post/hide',
  GET_POST: 'posts/user/all',
  GET_TAGGING_POST: 'posts/tags',

  //// comment
  COMMENT: 'comments',
  GET_COMMENT_POST: 'comments/post',
  ADD_COMMENT: 'comments/add',

  // Story
  GET_STORY_BY_USERID: '/stories/following/',
  GET_USER_FOLLOW: 'stories/following',
  CREATE_HIGHLIGHT_STORY: '/stories/create/highlight',
  //// music
  GET_ALL_MUSIC: 'music/find-all',

  //// Login
  GET_lOGIN_POST: 'users/login',
  GET_ME: 'users/me',
  CHECK_REFRESH_TOKEN: 'users/check-refresh-token',
  CHECK_EMAIL: 'users/check-email',
  EDIT_USER: '/users/edit-me',
  ////Logout
  POST_LOGOUT: 'users/logout',

  //// Relation
  GET_FOLLOWERS: 'relations/followers',
  GET_FOLLOWING: 'relations/following',
  GET_BLOCKING: '/relations/blocking',
  RELATION_ACTION: 'relations/relation-action',
  GET_RECOMMENDATIONS: 'relations/recommendations',
  GET_RELATIONSHIP: 'relations',
  //// Register
  REGISTER: 'users/register',
  /// User
  GET_PUBLIC_PROFILE: '/users/public',
  GET_USER_ID_BY_HANDLE: '/users/username-by-handle',
  ////bookmark
  POST_SAVE_BOOKMARK: 'bookmark-playlists/add-default',
  DELETE_BOOKMARK: 'bookmark-items/remove',
  POST_CREATE_PLAYLIST: 'bookmark-playlists/add',
  GET_ALL_PLAYLIST: 'bookmark-playlists/all',
  GET_ITEM_PLAYLIST: 'bookmark-items/all',
  POST_SWITCH_PLAYLIST: 'bookmark-playlists/switch',
  POST_ADD_MUSIC: 'bookmark-playlists/music/add',
  DELETE_MUSIC_BOOKMARK: 'bookmark-playlists/music/remove',

  //// Room
  GET_MY_ROOMS: 'rooms/my',
  GET_MY_WAITING_ROOMS: 'rooms/waiting/my',
  ROOM: 'rooms',
  UPDATE_ROOM_STATUS: 'rooms',

  //// Auth
  GET_ACCESS_TOKEN: 'users/refresh-access-token',

  //// Message
  MESSAGES_URL: 'messages',

  ////Search
  POST_SEARCH_POST: 'posts/search',
  POST_SEARCH_USER: 'users/search',

  ////Notification
  NOTIFICATION_API: 'notification/send',
  NOTIFICATION_API_FOLLOW: 'relations/followers/send-notification',
  GET_NOTIFICATIONS: 'notification',
};
