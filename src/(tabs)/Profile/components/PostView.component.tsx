import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {GridView} from './GridView';

export const PostsView: React.FC<{data: any[]}> = ({data}) => {
  const navigation = useNavigation<any>();
  const handlePress = (item: any) => {
    navigation.navigate('AllPostOfUserScreen', {
      targetPostId: item._id,
    });
  };
  return <GridView data={data} onPressItem={handlePress} />;
};

export const ReelsView: React.FC<{data: any[]}> = ({data}) => {
  const navigation = useNavigation<any>();
  const handlePress = (item: any) => {
    navigation.navigate('AllReels', {
      reels: data,
      initialId: item._id,
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
