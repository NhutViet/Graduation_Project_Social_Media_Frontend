import React, { memo, useCallback } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { Colors } from '../../../../assets/color/Colors';
import HashtagText from '../../../../components/HashtagText';
import { useTheme } from '../../../util/ThemeContext';
import { formatNumber } from '../../../../src/(tabs)/Home/util';
import ReelsHeader from './ReelsHeader';
import TagMarker from './TagMarker';

const { width } = Dimensions.get('window');

const MemoizedTagMarker = memo(TagMarker);
const MemoizedImage = memo(Image);
const MemoizedText = memo(Text);

const ReelsComponent = memo((props: any) => {
  const {
    _id,
    caption,
    share,
    media,
    user,
    muted,
    currentVisible,
    isFocused,
    likeCount,
    isLiked,
    commentCount,
    isFollowing,
    isCurrentUser,
    containerHeight,
    // callbacks func
    onLike,
    onComment,
    onFollow,
    onShare,
    onMenu,
    onProfilePress,
    onTagPress,
    setSkipReload,
  } = props;

  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const color = Colors[theme];

  const handleLike = useCallback(() => onLike(_id, isLiked), [_id, isLiked, onLike]);
  const handleFollow = useCallback(() => onFollow(user._id, isFollowing), [user._id, isFollowing, onFollow]);
  const handleProfilePress = useCallback(() => onProfilePress(user._id), [user._id, onProfilePress]);
  const handleTagPress = useCallback((userId: string) => onTagPress(userId), [onTagPress]);

  const renderProfileImage = useCallback(() =>
    user.profilePic ? (
      <MemoizedImage style={styles.img} source={{ uri: user.profilePic }} />
    ) : (
      <MemoizedImage
        style={styles.img}
        source={require('../../../../assets/icon/account.png')}
      />
    ), [user.profilePic]);

  const renderFollowButton = useCallback(() =>
    !isCurrentUser && (
      <TouchableOpacity onPress={handleFollow} style={styles.btnFollow}>
        <MemoizedText style={{ fontSize: 14, color: Colors.white }}>
          {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
        </MemoizedText>
      </TouchableOpacity>
    ), [isCurrentUser, isFollowing, handleFollow]);

  const renderActionButton = useCallback((
    iconSource: any,
    count: number,
    onPress: () => void,
    tintColor?: string,
  ) => (
    <View style={[styles.sectionContainer, styles.topSection]}>
      <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
        <MemoizedImage
          style={[styles.icon, tintColor ? { tintColor } : {}]}
          source={iconSource}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <MemoizedText style={styles.textNormal}>
          {formatNumber(count || 0)}
        </MemoizedText>
      </TouchableOpacity>
    </View>
  ), []);

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <Video
      // DO NOT CHANGE ANY VIDEO CONFIG BELOW!!!!!!!
        source={{ uri: media[0]?.videoUrl }}
        resizeMode="contain"
        style={[styles.videoPlayer, {height: containerHeight}]}
        repeat={false}
        paused={!currentVisible || !isFocused}
        muted={muted}
        maxBitRate={0}
        progressUpdateInterval={1000}
        onError={(error) => console.warn('Video error:', error)}
        playInBackground={false}
        playWhenInactive={false}
        hideShutterView={true}
      />

      <View style={styles.headerOverlay}>
        <ReelsHeader />
      </View>

      <View style={styles.tagOverlay}>
        {media[0]?.tags?.map((tag: any) => (
          <MemoizedTagMarker
            key={tag._id}
            tag={tag}
            onPress={handleTagPress}
          />
        ))}
      </View>

      <View style={styles.bottomOverlay}>
        <View style={styles.block1}>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.imgContainer}
              onPress={handleProfilePress}>
              {renderProfileImage()}
            </TouchableOpacity>
            <MemoizedText style={styles.name}>{user.handleName}</MemoizedText>
            {renderFollowButton()}
          </View>
          <HashtagText
            text={caption}
            clickable={true}
            baseStyle={styles.textNormal}
            hashtagColor={Colors.hashtag}
            hashtagStyle={{ fontWeight: '600' }}
            setSkipReload={setSkipReload}
            navigation={navigation}
          />
        </View>

        <View style={styles.block2}>
          {renderActionButton(
            isLiked
              ? require('../../../../assets/icon/heart_fill.png')
              : require('../../../../assets/icon/heart.png'),
            likeCount,
            handleLike,
            isLiked ? color.error : '#fff',
          )}

          {renderActionButton(
            require('../../../../assets/icon/comment.png'),
            commentCount,
            onComment,
          )}

          {renderActionButton(
            require('../../../../assets/icon/share.png'),
            share,
            onShare,
          )}

          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={onMenu}>
              <MemoizedImage
                style={styles.icon}
                source={require('../../../../assets/icon/menu-dots-vertical.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.iconMusicContainer}
              onPress={() => navigation.navigate('SaveMusic')}>
              <MemoizedImage
                style={styles.icon}
                source={require('../../../../assets/icon/musical-note.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: Colors.black,
    overflow: 'hidden',
  },
  videoPlayer: {
    width: width,
    backgroundColor: Colors.black,
    position: 'absolute',
    // borderWidth: 1,
    // borderColor: 'blue',
  },
  headerOverlay: {
    position: 'absolute',
    top: 18,
    left: 18,
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
    width: width,
    bottom: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 20,
  },
  topSection: {
    alignItems: 'center',
  },
  iconMusicContainer: {
    width: 25,
    height: 25,
    padding: 5,
    borderRadius: 2,
    borderColor: Colors.white,
    borderWidth: 1,
  },
});

export default memo(ReelsComponent);
