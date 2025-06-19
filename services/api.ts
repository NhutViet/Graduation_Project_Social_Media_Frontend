export const BASE_URL = 'http://cirla.io.vn';
export const CallAppID = 1540310098;
export const CallAppSign = '3c3dfbc5dcb04d97848e4a1b9e91a7bc8c66db7cbbbe41f188f40101ee33e5f6';

export const API = {
  //// post
  GET_ALL_POST: 'posts/get-all-with-media',
  GET_REELS_POST: 'posts/get-all-reel-media',
  UPLOAD_POST: 'posts/with-media',
  HIDDEN_POST: 'user-hidden-post/hide',
  GET_POST: 'posts/user/all',
  GET_TAGGING_POST: 'posts/tags',

  //// comment
  GET_COMMENT_POST: 'comments/post',
  ADD_COMMENT: 'comments/add',

  // Story
  GET_STORY_BY_USERID: '/stories/following/',
  GET_USER_FOLLOW: 'stories/following',
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
  //// Register
  REGISTER: 'users/register',
  /// User
  GET_PUBLIC_PROFILE: '/users/public',
  ////bookmark
  POST_SAVE_BOOKMARK: 'bookmark-playlists/add-default',
  DELETE_BOOKMARK: 'bookmark-items/remove',
  POST_CREATE_PLAYLIST: 'bookmark-playlists/add',
  GET_ALL_PLAYLIST: 'bookmark-playlists/all',
  GET_ITEM_PLAYLIST: 'bookmark-items/all',
  POST_SWITCH_PLAYLIST: 'bookmark-playlists/switch',

  //// Room
  GET_MY_ROOMS: 'rooms/my',
  ROOM: 'rooms',

  //// Auth
  GET_ACCESS_TOKEN: 'users/refresh-access-token',

  //// Message
  MESSAGES_URL: 'messages',

  ////Search
  POST_SEARCH_POST: 'posts/search',
  POST_SEARCH_USER: 'users/search',
};
