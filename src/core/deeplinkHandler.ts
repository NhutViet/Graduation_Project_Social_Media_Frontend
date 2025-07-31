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
  const segments = path.split('/');

  switch (segments[0]) {
    case 'profile':
      if (segments[1]) {
        navigationRef.current?.navigate('ProfileComp', {userID: segments[1]});
      }
      break;
    case 'share':
      if (segments[1]) {
        navigationRef.current?.navigate('PostDetailScreen', {
          postId: segments[1],
        });
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
};
