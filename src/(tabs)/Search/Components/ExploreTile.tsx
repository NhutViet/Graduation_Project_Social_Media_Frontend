import React from 'react';
import {Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import MasonryList from 'react-native-masonry-list';
import Video from 'react-native-video';
import {PostWithMedia} from '@services/postRedux/postTypes';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GAP = 1.5;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

interface ExploreMasonryFeedProps {
  posts: PostWithMedia[];
  onPressPost?: (post: PostWithMedia) => void;
}

const ExploreMasonryFeed: React.FC<ExploreMasonryFeedProps> = ({
  posts,
  onPressPost,
}) => {
  const data = posts.map(post => {
    const firstMedia = post.media[0];
    const isVideo = !!firstMedia.videoUrl;
    const isMulti = post.media.length > 1;
    const imageUrl = firstMedia.imageUrl;
    return {
      imageUrl,
      videoUrl: firstMedia.videoUrl,
      isVideo,
      isMulti,
      // post,
      dimensions: {width: ITEM_SIZE, height: ITEM_SIZE},
    };
  });

  const renderItem = (item: any) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.item}
      onPress={() => onPressPost?.(item.post)}>
      {item.isVideo && item.videoUrl ? (
        <Video
          source={{uri: item.videoUrl}}
          style={styles.media}
          resizeMode="cover"
          paused
        />
      ) : (
        <Image
          source={{uri: item.imageUrl}}
          style={styles.media}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
  console.log(data[4]);

  return (
    // <MasonryList
    //   images={data}
    //   columns={NUM_COLUMNS}
    //   spacing={GAP}
    //   renderItem={renderItem}
    //   keyExtractor={item => item._id}
    //   imageContainerStyle={styles.imageContainer}
    // />
    <TouchableOpacity
      onPress={() => console.log(data[4].isVideo)}
      style={styles.item}>
      {data[4].isVideo && data[4].videoUrl !== undefined ? (
        <Video
          source={{uri: data[4].videoUrl}}
          style={styles.media}
          resizeMode="cover"
          paused
        />
      ) : (
        <Image
          source={{uri: data[4].imageUrl}}
          style={styles.media}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderWidth: GAP,
    borderColor: '#000',
    backgroundColor: '#111',
    borderRadius: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderWidth: GAP,
    borderColor: '#000',
    backgroundColor: '#111',
    borderRadius: 0,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  iconText: {
    color: '#fff',
    fontSize: 15,
  },
});

export default ExploreMasonryFeed;
