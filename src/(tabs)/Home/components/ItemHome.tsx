import React, {useRef, useCallback, useState, useEffect, useMemo, Suspense} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import {Modalize} from 'react-native-modalize';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {Portal} from 'react-native-portalize';
import {useNavigation} from '@react-navigation/native';
import ModalShare from './ModalShare';
import ModalReaction from './ModalReaction';
import {
  fetchFollowers,
  fetchFollowing,
  relationAction,
} from '../../../../services/relationRedux/relationSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  likePost,
  unlikePost,
} from '../../../../services/reactionRedux/reactionSlice';
import {addLikedPost} from '../../../../services/reactionRedux/reactionReducer';
import {hidePost} from '../../../../services/postRedux/postSlice';
import {
  removeBookmark,
  saveBookmark,
} from '../../../../services/bookmarkRedux/bookmarkSlice';
import {ItemHomeStyles} from '../component_styles/ItemHomeStyles';
import Sound from 'react-native-sound';
import {
  postTopOptions,
  postFirstList,
  postSecondList,
  reportChoices
} from '../../../config/postOptions';

// lazy‑load the bottom‑sheet components
const BottomSheetOptions    = React.lazy(() => import('../../../../components/BottomSheetOptions'));
const BottomSheetIntentions = React.lazy(() => import('../../../../components/BottomSheetIntentions'));

Sound.setCategory('Playback');

const ItemHome = (props: any) => {
  const {
    _id,
    type,
    caption,
    share,
    createdAt,
    isLike,
    media,
    user,
    currentVisible,
    isFocused,
    openComment,
    likeCount,
    commentCount,
    music,
    musicInfo,
    isFollow,
  } = props;

  const {theme} = useTheme();
  const color = Colors[theme];
  const [muted, setMuted] = React.useState(true);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const navigation: any = useNavigation();
  const [visibleModalShare, setVisibleModalShare] = useState(false);
  const [follow, setFollow] = useState(isFollow);

  const dispatch = useDispatch<AppDispatch>();
  const userID = useSelector((state: RootState) => state.user?.user?._id);
  const {followers, following, loading, error} = useSelector(
    (state: RootState) => state.relation,
  );

  const soundRef = useRef<Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPlayback = () => {
    if (soundRef.current) soundRef.current.stop();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!currentVisible || !musicInfo?.link || !isFocused) {
      stopPlayback();
      return;
    }

    const sound = new Sound(musicInfo.link, undefined, error => {
      if (error) {
        console.log('Sound load error:', error);
        return;
      }

      sound.setCurrentTime(music?.timeStart || 0);
      sound.setVolume(muted ? 0 : 1);
      sound.play();

      intervalRef.current = setInterval(() => {
        sound.getCurrentTime(seconds => {
          if (seconds >= (music?.timeEnd || 0)) {
            sound.stop();
            sound.setCurrentTime(music?.timeStart || 0);
            sound.play();
          }
        });
      }, 200);
    });

    soundRef.current = sound;

    return () => {
      stopPlayback();
    };
  }, [currentVisible, musicInfo, isFocused]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolume(muted ? 0 : 1);
    }
  }, [muted]);

  useEffect(() => {
    if (!isFocused) {
      stopPlayback();
    }
  }, [isFocused]);

  const follows = useMemo(() => {
    const allUsers = [...followers, ...following];

    const uniqueUsers = allUsers.filter(
      (user, index, self) => index === self.findIndex(u => u.id === user.id),
    );

    return uniqueUsers.map(user => ({
      id: user.id,
      name: user.username,
      avatar: user.profilePic,
    }));
  }, [followers, following]);

  const {likePosts} = useSelector((state: RootState) => state.reactions);

  const {refreshToken} = useSelector((state: RootState) => state.user);
  const [isLiked, setIsLiked] = useState(isLike);
  const [numLike, setNumLike] = useState(likeCount);

  useEffect(() => {
    if (isLike && !likePosts.includes(_id)) {
      dispatch(addLikedPost(_id));
    }
  }, [_id, isLike]);

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

  const handleFollowPress = async () => {
    if (follow) return;

    setFollow(true);

    try {
      await dispatch(
        relationAction({
          targetId: user._id || '',
          action: 'follow',
        }),
      ).unwrap();
    } catch (error) {
      console.error('Follow thất bại:', error);
      setFollow(false);
    }
  };

  const handleUnFollowPress = async () => {
    setFollow(false);
    try {
      await dispatch(
        relationAction({
          targetId: user._id || '',
          action: 'unfollow',
        }),
      ).unwrap();
    } catch (error) {
      console.error('Unfollow thất bại:', error);
      setFollow(true);
    }
  };
  const intentRef = useRef<Modalize>(null);
  const sheetRef = useRef<Modalize>(null);
  const openOptions = useCallback(() => {
    sheetRef.current?.open();
  }, []);

  const openIntentions = useCallback(() => {
    intentRef.current?.open();
  }, []);


  const closeSheet = useCallback(() => {
    // sheetRef.current?.close();
  }, []);

  const closeIntentions = useCallback(() => {
  }, []);

  const onSheetClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const onIntentionsClose = useCallback(() => {}, []);

  const modalReactionRef = useRef<Modalize>(null);

  const handleOpenReactionModal = useCallback(() => modalReactionRef.current?.open(), []);

  const handleOpenModalShare = useCallback(async () => {
    if (loading) {
      console.log('Still loading relations...');
      return;
    }

    try {
      if (userID) {
        await Promise.all([
          dispatch(fetchFollowers({userID})),
          dispatch(fetchFollowing({userID})),
        ]);
      }

      setVisibleModalShare(true);

      console.log('Followers:', followers.length);
      console.log('Following:', following.length);
      console.log('Combined follows:', follows.length);
    } catch (error) {
      console.error('Error fetching relations:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách bạn bè. Vui lòng thử lại.');
    }
  }, [dispatch, userID, loading]);

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num?.toString();
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} năm trước`;
    if (months > 0) return `${months} tháng trước`;
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `Vừa xong`;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const handleHidePost = async () => {
    try {
      await dispatch(hidePost(_id)).unwrap();
      onSheetClose();
    } catch (error) {
      console.log('Ẩn bài viết lỗi:', error);
    }
  };

  // Unified select‑by‑ID handler (memoized)
  const handleOptionSelect = useCallback((id: string) => {
    sheetRef.current?.close();
    switch (id) {
      case 'hide':
        sheetRef.current?.close();
        return handleHidePost();
      case 'unfollow':
        sheetRef.current?.close();
        return handleUnFollowPress();
      case 'report':
        sheetRef.current?.close();
        return openIntentions();       
      default:
        return sheetRef.current?.close();
    }
  }, [handleHidePost, handleUnFollowPress, openIntentions]);

  const handleIntentionSelect = useCallback((id: string) => {
    intentRef.current?.close();

    console.log('Intent chosen:', id);
  }, []);

  // Memoized option arrays
  const topOptions = useMemo(
    () => postTopOptions.map(opt => ({
      ...opt,
      onPress: () => handleOptionSelect(opt.id),
    })),
    [handleOptionSelect]
  );

  const firstListOptions = useMemo(
    () => postFirstList.map(opt => ({
      ...opt,
      onPress: () => handleOptionSelect(opt.id),
    })),
    [handleOptionSelect]
  );

  const secondListOptions = useMemo(
    () => postSecondList.map(opt => ({
      ...opt,
      onPress: () => handleOptionSelect(opt.id),
    })),
    [handleOptionSelect]
  );

  // For the intentions sheet we also call onClose after select
  const intentionOptions = useMemo(
    () => reportChoices.map(opt => ({
      ...opt,
      onPress: () => {
        handleOptionSelect(opt.id);
        onIntentionsClose();
      },
    })),
    [handleOptionSelect, onIntentionsClose]
  );

  //bookmark
  const {itemsByPlaylist, playlists} = useSelector(
    (state: RootState) => state.bookmark,
  );
  const [isBookmarked, setIsBookmarked] = useState(() =>
    Object.values(itemsByPlaylist)
      .flat()
      .some(item => item.itemID === _id),
  );

  // Nếu có thể thay đổi dữ liệu bên ngoài, nên sync lại khi props thay đổi:
  useEffect(() => {
    const bookmarked = Object.values(itemsByPlaylist)
      .flat()
      .some(item => item.itemID === _id);
    setIsBookmarked(bookmarked);
  }, [itemsByPlaylist, _id]);

  const handleBookmark = () => {
    if (!isBookmarked) {
      setIsBookmarked(true);
      dispatch(
        saveBookmark({
          postId: _id,
          playlistId: playlists[0].id,
          refreshToken,
        }),
      )
        .unwrap()
        .catch(res =>
          setIsBookmarked(
            Object.values(itemsByPlaylist)
              .flat()
              .some(item => item.itemID === _id),
          ),
        );
    } else {
      const playlistID = Object.entries(itemsByPlaylist).find(([_, items]) =>
        items.some(item => {
          return item.itemID.toString() === _id.toString();
        }),
      )?.[0];
      setIsBookmarked(false);
      if (playlistID) {
        dispatch(
          removeBookmark({
            postId: [_id],
            playlistId: playlistID,
            refreshToken,
          }),
        )
          .unwrap()
          .catch(res =>
            setIsBookmarked(
              Object.values(itemsByPlaylist)
                .flat()
                .some(item => item.itemID === _id),
            ),
          );
      }
    }
  };

  return (
    <View style={ItemHomeStyles.wrapper}>
    <Portal>
      <Suspense fallback={null}>
        <Modalize
          ref={sheetRef}
          adjustToContentHeight
          handlePosition="inside"
          modalStyle={{ backgroundColor: color.background, borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden', paddingTop: 24,}}
          handleStyle={{ backgroundColor: color.text, width: 40, height: 5, borderRadius: 2.5, marginVertical: 8,alignSelf: 'center', top: 8 }}
          // onClose={() => sheetRef.current?.close()}
        >
          <BottomSheetOptions
            topOptions={topOptions}
            listOptionGroups={[firstListOptions, secondListOptions]}
            onSelect={handleOptionSelect}
          />
        </Modalize>
      </Suspense>
    </Portal>

    <Portal>
      <Suspense fallback={null}>
        <Modalize
          ref={intentRef}
          adjustToContentHeight
          handlePosition="inside"
          modalStyle={{ backgroundColor: color.background, borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden', paddingTop: 24,}}
          handleStyle={{ backgroundColor: color.text, width: 40, height: 5, borderRadius: 2.5, marginVertical: 8,alignSelf: 'center', top: 8 }}
          // onClose={() => intentRef.current?.close()}
        >
          <BottomSheetIntentions
            title="Báo cáo"
            subtitle="Tại sao bạn báo cáo bài viết này?"
            content="Báo cáo của bạn sẽ được ẩn danh. Nếu ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy báo ngay cho dịch vụ khẩn cấp tại địa phương."
            options={intentionOptions}
            onSelect={handleIntentionSelect}
          />
        </Modalize>
      </Suspense>
    </Portal>

      <View style={ItemHomeStyles.container}>
        {type != 'reel' && <View style={ItemHomeStyles.blockWhite}></View>}
        <View style={ItemHomeStyles.video}>
          <FlatList
            data={media}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id.toString()}
            renderItem={({item, index}) => {
              if (item.videoUrl) {
                return (
                  <Video
                    key={index}
                    source={{uri: item.videoUrl}}
                    resizeMode="contain"
                    style={{width: screenWidth, height: '100%'}}
                    repeat
                    paused={!currentVisible || !isFocused}
                    muted={muted}
                    maxBitRate={1500000}
                    progressUpdateInterval={500}
                  />
                );
              } else {
                return (
                  <Image
                    key={index}
                    source={{uri: item.imageUrl}}
                    style={{width: screenWidth, height: '100%'}}
                    resizeMode="contain"
                  />
                );
              }
            }}
            onMomentumScrollEnd={event => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const newIndex = Math.round(offsetX / screenWidth);
              setCurrentIndex(newIndex);
            }}
          />

          {media.length > 1 && (
            <View style={ItemHomeStyles.pagination}>
              {media.map((_: any, index: any) => (
                <View
                  key={index}
                  style={[
                    ItemHomeStyles.dot,
                    {
                      backgroundColor:
                        index === currentIndex
                          ? '#fff'
                          : 'rgba(255,255,255,0.5)',
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>
        <View style={ItemHomeStyles.headerItem}>
          <View style={ItemHomeStyles.rowContainer}>
            <TouchableOpacity
              style={ItemHomeStyles.blockImg}
              onPress={() => {
                navigation.navigate('ProfileComp', {userID: user._id});
              }}>
              <Image
                style={ItemHomeStyles.imgUser}
                source={{
                  uri: user.profilePic,
                }}
              />
            </TouchableOpacity>
            <View>
              <Text
                style={[
                  ItemHomeStyles.textNormal,
                  {color: type === 'reel' ? Colors.dark.text : color.text},
                ]}>
                {user.handleName}
              </Text>
              <Text
                style={[
                  ItemHomeStyles.text,
                  {color: type === 'reel' ? Colors.dark.text : color.text},
                ]}>
                Gợi ý cho bạn
              </Text>
            </View>
          </View>
          <View style={ItemHomeStyles.rowContainer}>
            <TouchableOpacity
              style={[
                ItemHomeStyles.btnFollow,
                {
                  borderColor:
                    type === 'reel' ? Colors.light.background : color.text,
                },
              ]}
              onPress={() => {
                handleFollowPress();
              }}>
              <Text
                style={[
                  ItemHomeStyles.textNormal,
                  {color: type === 'reel' ? Colors.dark.text : color.text},
                ]}>
                {follow ? 'Đã theo dõi' : 'Theo dõi'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openOptions}
              style={ItemHomeStyles.iconBlock}>
              <Image
                style={[
                  {
                    tintColor:
                      type === 'reel' ? Colors.light.background : color.text,
                  },
                  ItemHomeStyles.icon,
                ]}
                source={require('../../../../assets/icon/menu-dots-vertical.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        {type === 'post' && !music ? (
          <></>
        ) : (
          <TouchableOpacity
            style={ItemHomeStyles.muteButton}
            onPress={() => setMuted(!muted)}>
            <Image
              source={
                muted
                  ? require('../../../../assets/icon/mute.png')
                  : require('../../../../assets/icon/volume.png')
              }
              style={[{tintColor: Colors.dark.text}, ItemHomeStyles.icon]}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={{backgroundColor: color.background, padding: 10}}>
        <View
          style={[
            ItemHomeStyles.rowContainer,
            {justifyContent: 'space-between'},
          ]}>
          <View style={ItemHomeStyles.rowContainer}>
            <TouchableOpacity
              style={ItemHomeStyles.iconBlock}
              onPress={handleLike}>
              <Image
                style={[
                  {tintColor: isLiked ? color.error : color.text},
                  ItemHomeStyles.icon,
                ]}
                source={
                  isLiked
                    ? require('../../../../assets/icon/heart_fill.png')
                    : require('../../../../assets/icon/heart.png')
                }
              />
            </TouchableOpacity>
            <Text
              style={{color: color.text, marginLeft: 8, marginRight: 16}}
              onPress={handleOpenReactionModal}>
              {formatNumber(numLike)}
            </Text>
            <TouchableOpacity
              style={ItemHomeStyles.iconBlock}
              onPress={openComment}>
              <Image
                style={[{tintColor: color.text}, ItemHomeStyles.icon]}
                source={require('../../../../assets/icon/comment.png')}
              />
            </TouchableOpacity>
            <Text style={{color: color.text, marginLeft: 8, marginRight: 16}}>
              {formatNumber(commentCount)}
            </Text>
            <TouchableOpacity
              style={ItemHomeStyles.iconBlock}
              onPress={handleOpenModalShare}>
              <Image
                style={[{tintColor: color.text}, ItemHomeStyles.icon]}
                source={require('../../../../assets/icon/share.png')}
              />
            </TouchableOpacity>
            <Text style={{color: color.text, marginLeft: 8, marginRight: 16}}>
              {formatNumber(share)}
            </Text>
          </View>
          <TouchableOpacity
            style={ItemHomeStyles.iconBlock}
            onPress={handleBookmark}>
            <Image
              style={[
                {tintColor: isBookmarked ? '#F2C641' : color.text},
                ItemHomeStyles.icon,
              ]}
              source={
                isBookmarked
                  ? require('../../../../assets/icon/bookmark_fill.png')
                  : require('../../../../assets/icon/bookmark.png')
              }
            />
          </TouchableOpacity>
        </View>
        <Text style={[ItemHomeStyles.title, {color: color.text}]}>
          {caption}
        </Text>
        <Text style={{color: color.text, fontSize: 12}}>
          {formatTimeAgo(createdAt)}
        </Text>
      </View>
      <ModalShare
        visible={visibleModalShare}
        onClose={() => setVisibleModalShare(false)}
        friends={follows}
      />
      <Portal>
        <ModalReaction ref={modalReactionRef} postId={_id} isLiked={isLiked} />
      </Portal>
    </View>
  );
};

export default ItemHome;
