export const BASE_URL =
  'https://graduation-project-be-real-revised.onrender.com';

export const API = {
  //// post
  GET_ALL_POST: 'posts/get-all-with-media',
  GET_REELS_POST: 'posts/get-all-reel-media',
  UPLOAD_POST: 'posts/with-media',

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

  //// Register
  REGISTER: 'users/register',
};
