import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {GridView} from './GridView';

export const PostsView: React.FC<{data: any[]; isBookmark?: boolean}> = ({
  data,
  isBookmark = false,
}) => {
  const navigation = useNavigation<any>();
  const handlePress = (item: any) => {
    if (!isBookmark) {
      navigation.navigate('AllPostOfUserScreen', {
        targetPostId: item._id,
      });
    } else {
      navigation.navigate('AllPostOfCollection', {
        posts: data,
        targetPostId: item._id,
        playlistName: 'Đã lưu',
        clickableHashtag: false,
        clearSearchRedux: false,
      });
    }
  };
  return <GridView data={data} onPressItem={handlePress} />;
};

export const ReelsView: React.FC<{data: any[]}> = ({data}) => {
  const navigation = useNavigation<any>();
  const handlePress = (item: any) => {
    navigation.navigate('AllReels', {
      initialId: item._id,
      data: data,
    });
  };
  return <GridView data={data} onPressItem={handlePress} />;
};

export const TagsView: React.FC<{data: any[]}> = ({data}) => {
  const navigation = useNavigation<any>();
  const handlePress = (item: any) => {
    navigation.navigate('AllTaggedPostOfUserScreen', {
      targetPostId: item._id,
    });
  };
  return <GridView data={data} onPressItem={handlePress} />;
};
