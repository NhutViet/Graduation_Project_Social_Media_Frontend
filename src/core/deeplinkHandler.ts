import {Linking} from 'react-native';
import {navigationRef} from '../NavigationService';

export const handleDeeplinkIfNeeded = async () => {
  const url = await Linking.getInitialURL();
  if (url) {
    navigateFromUrl(url);
  }
};

export const listenToDeeplink = () => {
  Linking.addEventListener('url', ({url}) => {
    navigateFromUrl(url);
  });
};

export const navigateFromUrl = (path: string) => {
  try {
    const cleanUrl = path.replace(/.*?:\/\//g, ''); // loại cirla://
    const segments = cleanUrl.split('/');

    const route = segments[0];
    const id = segments[1];

    switch (route) {
      case 'profile':
        if (id) {
          navigationRef.current?.navigate('ProfileComp', {userID: id});
        }
        break;
      case 'share':
        if (id) {
          navigationRef.current?.navigate('PostDetailScreen', {postId: id});
        }
        break;
      case 'story':
        if (segments[1] && segments[2]) {
          navigationRef.current?.navigate('SeenStory', {
            storyId: segments[1],
            creatorId: segments[2],
          });
        }
        break;
    }
  } catch (err) {
    console.warn('Invalid deep link:', path);
  }
};
