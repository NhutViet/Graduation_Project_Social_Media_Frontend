export const BASE_URL = 'http://cirla.io.vn';

export const API = {
  //// post
  GET_ALL_POST: 'posts/get-all-with-media',
  GET_REELS_POST: 'posts/get-all-reel-media',
  UPLOAD_POST: 'posts/with-media',
  HIDDEN_POST: 'user-hidden-post/hide',
  GET_POST: 'posts/user/all',

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
  ////Logout
  POST_LOGOUT: 'users/logout',

  //// Relation
  GET_FOLLOWERS: 'relations/followers',
  GET_FOLLOWING: 'relations/following',
  RELATION_ACTION: 'relations/relation-action',
  //// Register
  REGISTER: 'users/register',
  /// User
  GET_PUBLIC_PROFILE: '/users/public',
  ////bookmark
  POST_SAVE_BOOKMARK: 'bookmark-playlists/add-bookmark',
  DELETE_BOOKMARK: 'bookmark-playlists/remove-bookmark',
  POST_CREATE_PLAYLIST: 'bookmark-playlists/add',
  GET_ALL_PLAYLIST: 'bookmark-playlists/all',
  GET_ITEM_PLAYLIST: 'bookmark-items/all',
};
