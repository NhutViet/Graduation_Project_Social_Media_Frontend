import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {AppDispatch, RootState} from '../../../services/store';
import {useDispatch, useSelector} from 'react-redux';
import {BottomSheetCommentRef} from 'src/(tabs)/Home/components/CommentSection';
import {BottomSheetReelsRef} from 'src/(tabs)/Reels/bottomSheet/reelBottomSheet';
import Video from 'react-native-video';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {addLikedPost} from '../../../services/reactionRedux/reactionReducer';
import {
  unlikePost,
  likePost,
} from '../../../services/reactionRedux/reactionSlice';

interface Reels {
  _id: string;
  caption: string;
  isLike: boolean;
  likeCount: number;
  media: string;
  userID: string;
}
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num?.toString();
};

export const ViewReels = (item: Reels) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  //like
  const dispatch = useDispatch<AppDispatch>();
  const {likePosts} = useSelector((state: RootState) => state.reactions);

  const {refreshToken} = useSelector((state: RootState) => state.user);
  const [isLiked, setIsLiked] = useState(likePosts.includes(item._id));
  const [numLike, setNumLike] = useState(item.likeCount);

  useEffect(() => {
    if (item.isLike && !likePosts.includes(item._id)) {
      dispatch(addLikedPost(item._id));
    }
  }, [item._id, item.isLike]);

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(!isLiked);
      setNumLike((prev: number) => prev - 1);
      dispatch(unlikePost({postId: _id, refreshToken}))
        .unwrap()
        .catch(res => {
          setNumLike(likeCount);
          setIsLiked(likePosts.includes(_id));
        });
    } else {
      setIsLiked(!isLiked);
      setNumLike((prev: number) => prev + 1);
      dispatch(likePost({postId: _id, refreshToken}))
        .unwrap()
        .catch(res => {
          setNumLike(likeCount);
          setIsLiked(likePosts.includes(_id));
        });
    }
  };

  const sheetRef: any = useRef<BottomSheetReelsRef>(null);
  const sheetRefComment: any = useRef<BottomSheetCommentRef>(null);

  return (
    <View style={styles.container}>
      <View style={styles.video}>
        <Video
          source={{uri: media[0]?.videoUrl}}
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
          repeat
          paused={!currentVisible || !isFocused}
          muted={muted}
          maxBitRate={1500000}
          progressUpdateInterval={500}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.block1}>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.imgContainer}>
              <Image style={styles.img} source={{uri: user.profilePic}} />
            </TouchableOpacity>
            <Text style={styles.name}>{user.handleName}</Text>
            <TouchableOpacity style={styles.btnFollow}>
              <Text style={{fontSize: 14, color: Colors.dark.text}}>
                Theo dõi
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.textNormal} numberOfLines={1}>
            {item.caption}
          </Text>
        </View>
        <View style={styles.block2}>
          <View style={styles.containerVertical}>
            <TouchableOpacity style={styles.iconContainer} onPress={handleLike}>
              <Image
                style={[
                  styles.icon,
                  {tintColor: isLiked ? color.error : '#fff'},
                ]}
                source={
                  isLiked
                    ? require('../../../assets/icon/heart_fill.png')
                    : require('../../../assets/icon/heart.png')
                }
              />
            </TouchableOpacity>
            <Text style={styles.textNormal}>{formatNumber(numLike)}</Text>
          </View>
          <View style={styles.containerVertical}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                sheetRefComment.current?.open();
              }}>
              <Image
                style={styles.icon}
                source={require('../../../assets/icon/comment.png')}
              />
            </TouchableOpacity>
            <Text style={styles.textNormal}>
              {formatNumber(item.commentCount)}
            </Text>
          </View>
          <View style={styles.containerVertical}>
            <TouchableOpacity style={styles.iconContainer}>
              <Image
                style={styles.icon}
                source={require('../../../assets/icon/share.png')}
              />
            </TouchableOpacity>
            <Text style={styles.textNormal}>{formatNumber(share)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.containerVertical, styles.iconContainer]}
            onPress={showBottomSheet}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/menu-dots-vertical.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconMusicContainer}
            onPress={() => navigation.navigate('SaveMusic' as never)}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/musical-note.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnFollow: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.light.transparent,
    borderWidth: 1,
    marginLeft: 10,
    borderColor: Colors.light.background,
  },
  textNormal: {
    fontSize: 14,
    color: Colors.light.background,
    marginTop: 5,
  },
  container: {
    position: 'relative',
    width: width,
    height: height,
    backgroundColor: Colors.dark.background,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 25,
    height: 25,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.dark.text,
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
    backgroundColor: Colors.dark.transparent,
  },
  block1: {
    width: '80%',
  },
  imgContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  block2: {
    alignItems: 'center',
  },
  containerVertical: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconMusicContainer: {
    width: 25,
    height: 25,
    padding: 5,
    borderRadius: 2,
    borderColor: Colors.dark.text,
    borderWidth: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
