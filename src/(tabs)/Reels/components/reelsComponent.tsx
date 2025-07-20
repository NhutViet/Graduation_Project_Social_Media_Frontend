import React, {memo, useCallback, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import {Colors} from '../../../../assets/color/Colors';
import HashtagText from '../../../../components/HashtagText';
import {useTheme} from '../../../util/ThemeContext';
import {formatNumber} from '../../../../src/(tabs)/Home/util';
import TagMarker from './TagMarker';
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Music,
  Share2,
  UserCircle2,
  Play,
} from 'lucide-react-native';

const {width} = Dimensions.get('window');

const MemoizedTagMarker = memo(TagMarker);
const MemoizedImage = memo(Image);
const MemoizedText = memo(Text);

const ReelsComponent = memo((props: any) => {
  const {
    _id,
    caption,
    media,
    user,
    likeCount,
    commentCount,
    isBookmarked,
    isLiked,
    isFollow,
    isFollowing,
    isCurrentUser,
    share,
    music,
    currentVisible,
    isFocused,
    containerHeight,
    muted = false,
    onLike,
    openComment,
    onFollow,
    onProfilePress,
    onTagPress,
    onMenu,
    openShareModal,
    setSkipReload,
  } = props;

  const navigation = useNavigation<any>();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [paused, setPaused] = useState<boolean>(false);

  const handleTogglePause = useCallback(() => {
    setPaused(prev => !prev);
  }, []);

  const handleLike = useCallback(
    () => onLike(_id, isLiked),
    [_id, isLiked, onLike],
  );
  const handleFollow = useCallback(
    () => onFollow(user._id, isFollowing),
    [user._id, isFollowing, onFollow],
  );
  const handleProfilePress = useCallback(
    () => onProfilePress(user._id),
    [user._id, onProfilePress],
  );
  const handleTagPress = useCallback(
    (userId: string) => onTagPress(userId),
    [onTagPress],
  );

  const renderProfileImage = useCallback(
    () =>
      user.profilePic ? (
        <MemoizedImage style={styles.img} source={{uri: user.profilePic}} />
      ) : (
        <UserCircle2 size={40} color={Colors.white} />
      ),
    [user.profilePic],
  );

  const renderFollowButton = useCallback(
    () =>
      !isCurrentUser && (
        <TouchableOpacity onPress={handleFollow} style={styles.btnFollow}>
          <MemoizedText style={{fontSize: 14, color: Colors.white}}>
            {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
          </MemoizedText>
        </TouchableOpacity>
      ),
    [isCurrentUser, isFollowing, handleFollow],
  );

  const renderActionButton = useCallback(
    (
      IconComponent: React.ElementType,
      count: number,
      onPress: () => void,
      iconColor?: string,
      filled?: boolean,
    ) => (
      <View style={[styles.sectionContainer, styles.topSection]}>
        <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
          <IconComponent
            size={26}
            color={iconColor || Colors.white}
            fill={filled ? iconColor || Colors.white : 'none'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <MemoizedText style={styles.textNormal}>
            {formatNumber(count || 0)}
          </MemoizedText>
        </TouchableOpacity>
      </View>
    ),
    [],
  );

  return (
    <View style={[styles.container, {height: containerHeight}]}>
      <View style={[styles.videoWrapper, {height: containerHeight}]}>
        <Video
          source={{uri: media[0]?.videoUrl}}
          resizeMode="contain"
          style={StyleSheet.absoluteFill}
          repeat
          paused={!currentVisible || !isFocused || paused}
          muted={muted}
          onError={e => console.warn(e)}
          playInBackground={false}
          playWhenInactive={false}
          hideShutterView
        />
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <TouchableOpacity
            activeOpacity={1}
            style={[
              StyleSheet.absoluteFill,
              styles.centered,
              {backgroundColor: paused ? 'rgba(0,0,0,0.25)' : 'transparent'},
            ]}
            onPress={handleTogglePause}>
            {paused && <Play size={30} color={Colors.white} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tagOverlay}>
        {media[0]?.tags?.map((tag: any) => (
          <MemoizedTagMarker key={tag._id} tag={tag} onPress={handleTagPress} />
        ))}
      </View>

      <View style={styles.bottomOverlay}>
        <View style={styles.block1}>
          <View style={[styles.rowContainer, {marginBottom: 10}]}>
            <TouchableOpacity
              style={styles.imgContainer}
              onPress={handleProfilePress}>
              {renderProfileImage()}
            </TouchableOpacity>
            <MemoizedText style={styles.name}>{user?.handleName}</MemoizedText>
            {renderFollowButton()}
          </View>
          <HashtagText
            text={caption}
            clickable
            baseStyle={styles.textNormal}
            hashtagColor={Colors.hashtag}
            hashtagStyle={{fontWeight: '600'}}
            setSkipReload={setSkipReload}
            navigation={navigation}
          />
        </View>

        <View style={styles.block2}>
          {renderActionButton(
            Heart,
            likeCount,
            handleLike,
            isLiked ? color.error : '#fff',
            isLiked,
          )}
          {renderActionButton(MessageCircle, commentCount, openComment)}
          {renderActionButton(Share2, share, openShareModal)}
          <View style={styles.sectionContainer}>
            <TouchableOpacity style={styles.iconContainer} onPress={onMenu}>
              <MoreVertical size={26} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: Colors.black,
    overflow: 'hidden',
  },
  videoPlayer: {
    width,
    backgroundColor: Colors.black,
    position: 'absolute',
  },
  videoWrapper: {
    width,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomOverlay: {
    position: 'absolute',
    width,
    bottom: 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  block1: {
    width: '80%',
  },
  block2: {
    flexDirection: 'column',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.white,
  },
  btnFollow: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginLeft: 10,
    borderColor: Colors.white,
  },
  textNormal: {
    fontSize: 16,
    color: Colors.white,
    marginTop: 5,
  },
  iconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginTop: 26,
  },
  topSection: {
    alignItems: 'center',
  },
  iconMusicContainer: {
    width: 26,
    height: 26,
    borderRadius: 2,
    borderColor: Colors.white,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ReelsComponent);
