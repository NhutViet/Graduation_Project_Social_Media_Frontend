import {Dimensions, StyleSheet} from 'react-native';

export interface Reel {
  _id: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  media: {
    videoUrl: string;
    audioId: string;
    audioUrl: string;
  };
  owner: {
    handleName: string;
    profilePic: string;
  };
}

export interface ReelItemProps {
  item: Reel;
  index: number;
  activeIndex: number;
  handleHashtagPress: (tag: string) => void;
  openComment: (postId: string) => void;
  showBottomSheet: (postId: string) => void;
  navigation: any;
}

const {width, height} = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bottomContainer: {
    position: 'absolute',
    width: width,
    bottom: 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  block1: {
    width: '80%',
    justifyContent: 'flex-end',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  imgContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  btnFollow: {
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  followText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  caption: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  captionText: {
    color: '#fff',
    fontSize: 15,
  },
  hashtag: {
    color: '#4fa3ff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  musicIcon: {
    marginRight: 6,
  },
  audioText: {
    color: '#fff',
    fontSize: 13,
  },
  block2: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  containerVertical: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
  iconMusicContainer: {
    padding: 5,
    borderRadius: 2,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    height: 80,
  },
});
