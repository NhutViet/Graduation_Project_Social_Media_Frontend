import React, {useRef, useCallback, useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import {Modalize} from 'react-native-modalize';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {Portal} from 'react-native-portalize';
import BottomSheetOptions, {
  OptionItem,
} from '../../../../components/BottomSheetOptions';
import BottomSheetIntentions, {
  IntentionOption,
} from '../../../../components/BottomSheetIntentions';
import {useNavigation} from '@react-navigation/native';
import ModalShare from './ModalShare';
import ModalReaction from './ModalReaction';
import {
  fetchFollowers,
  fetchFollowing,
} from '../../../../services/relationRedux/relationSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  likePost,
  unlikePost,
} from '../../../../services/reactionRedux/reactionSlice';
import {addLikedPost} from '../../../../services/reactionRedux/reactionReducer';
import {hidePost} from '../../../../services/postRedux/postSlice';

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
  } = props;

  const {theme} = useTheme();
  const color = Colors[theme];
  const [muted, setMuted] = React.useState(true);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const navigation: any = useNavigation();
  const [visibleModalShare, setVisibleModalShare] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const userID = useSelector((state: RootState) => state.user?.user?._id);
  const {followers, following, loading, error} = useSelector(
    (state: RootState) => state.relation,
  );

  const follows = useMemo(() => {
    const allUsers = [...followers, ...following];

    // Loại bỏ trùng lặp dựa trên id
    const uniqueUsers = allUsers.filter(
      (user, index, self) => index === self.findIndex(u => u.id === user.id),
    );

    // Chuyển đổi format dữ liệu cho ModalShare
    return uniqueUsers.map(user => ({
      id: user.id,
      name: user.username,
      avatar: user.profilePic,
    }));
  }, [followers, following]);

  useEffect(() => {
    if (userID) {
      // gọi 2 api followers, following
      Promise.all([
        dispatch(fetchFollowers({userID})),
        dispatch(fetchFollowing({userID})),
      ]).catch(error => {
        console.error('Error fetching relations:', error);
      });
    }
  }, [dispatch, userID]);

  //gọi api like
  const {likePosts} = useSelector((state: RootState) => state.reactions);

  const {refreshToken} = useSelector((state: RootState) => state.user);
  const isLiked = likePosts.includes(_id);
  const [numLike, setNumLike] = useState(likeCount);

  useEffect(() => {
    if (isLike && !likePosts.includes(_id)) {
      dispatch(addLikedPost(_id));
    }
  }, [_id, isLike]);

  const handleLike = async () => {
    if (isLiked) {
      const result = await dispatch(unlikePost({postId: _id, refreshToken}));
      if (unlikePost.fulfilled.match(result)) {
        setNumLike((prev: number) => prev - 1);
      }
    } else {
      const result = await dispatch(likePost({postId: _id, refreshToken}));
      if (likePost.fulfilled.match(result)) {
        setNumLike((prev: number) => prev + 1);
      }
    }
  };

  // Modalize bottom sheet reference
  const sheetRef = useRef<Modalize>(null);
  const openOptions = useCallback(() => {
    sheetRef.current?.open();
  }, []);
  const closeSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const onSheetClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const intentRef = useRef<Modalize>(null);
  const openIntentions = useCallback(() => intentRef.current?.open(), []);
  const closeIntentions = useCallback(() => intentRef.current?.close(), []);
  const onIntentionsClose = useCallback(() => {}, []);

  const modalReactionRef = useRef<Modalize>(null);

  const handleOpenReactionModal = useCallback(() => {
    modalReactionRef.current?.open();
  }, []);

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

      // Mở modal sau khi đã load xong data
      setVisibleModalShare(true);

      console.log('Followers:', followers.length);
      console.log('Following:', following.length);
      console.log('Combined follows:', follows.length);
    } catch (error) {
      console.error('Error fetching relations:', error);
      // Hiển thị thông báo lỗi cho user
      Alert.alert('Lỗi', 'Không thể tải danh sách bạn bè. Vui lòng thử lại.');
    }
  }, [dispatch, userID, loading]);

  // Number formatting utility
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num?.toString();
  };

  // hàm đổi ngày
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

  // Bottom sheet options
  const topOptions: OptionItem[] = [
    {
      id: 'bookmark',
      icon: require('../../../../assets/icon/bookmark.png'),
      label: 'Lưu',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'remix',
      icon: require('../../../../assets/icon/remix.png'),
      label: 'Remix',
      onPress: () => {
        closeSheet();
      },
    },
  ];
  const firstListOptions: OptionItem[] = [
    {
      id: 'favorite',
      icon: require('../../../../assets/icon/star.png'),
      label: 'Thêm vào mục yêu thích',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'unfollow',
      icon: require('../../../../assets/icon/unfollow.png'),
      label: 'Bỏ theo dõi',
      onPress: () => {
        closeSheet();
      },
    },
  ];
  const secondListOptions: OptionItem[] = [
    {
      id: 'accountInfo',
      icon: require('../../../../assets/icon/account.png'),
      label: 'Giới thiệu về tài khoản này',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'whySee',
      icon: require('../../../../assets/icon/info.png'),
      label: 'Tại sao tôi thấy bài viết này ?',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'hide',
      icon: require('../../../../assets/icon/blind.png'),
      label: 'Ẩn',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'report',
      icon: require('../../../../assets/icon/report.png'),
      label: 'Báo cáo',
      onPress: () => {
        closeSheet();
        openIntentions();
      },
      labelColor: '#FF0000',
    },
  ];

  const reportChoices: IntentionOption[] = [
    {
      id: 'bullying',
      label: 'Bắt nạt hoặc liên hệ theo cách không mong muốn',
      onPress: closeIntentions,
    },
    {
      id: 'selfHarm',
      label: 'Tự tử, tự gậy thương tích hoặc chứng rối loạn ăn uống',
      onPress: closeIntentions,
    },
    {
      id: 'violence',
      label: 'Bạo lực, thù ghét hoặc bóc lột',
      onPress: closeIntentions,
    },
    {
      id: 'restricted',
      label: 'Bán hoặc quảng cáo mặt hàng bị hạn chế',
      onPress: closeIntentions,
    },
    {
      id: 'nudity',
      label: 'Ảnh khỏa thân hoặc hoạt động tình dục',
      onPress: closeIntentions,
    },
    {
      id: 'spam',
      label: 'Lừa đảo, gian lận hoặc spam',
      onPress: closeIntentions,
    },
    {id: 'false', label: 'Thông tin sai sự thật', onPress: closeIntentions},
    {
      id: 'copyright',
      label: 'Quyền sở hữu trí tuệ',
      onPress: closeIntentions,
    },
  ];

  return (
    <View style={styles.wrapper}>
      {/* Single Modalize wrapping only the BottomSheetOptions content */}
      <Portal>
        <Modalize
          ref={sheetRef}
          modalStyle={{
            backgroundColor: color.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 18,
          }}
          handleStyle={{
            backgroundColor: color.text,
            height: 6,
            width: 40,
            marginBottom: 8,
          }}
          handlePosition="inside"
          panGestureEnabled
          scrollViewProps={{scrollEnabled: false}}
          adjustToContentHeight
          // only updates state, does NOT call sheetRef.close()
          onClose={onSheetClose}>
          <BottomSheetOptions
            topOptions={topOptions}
            listOptionGroups={[firstListOptions, secondListOptions]}
            handleHidePost={handleHidePost}
            // when an option is pressed, only CLOSE the sheet
            // BottomSheetOptions will call item.onPress(), then onClose()
            onClose={closeSheet}
          />
        </Modalize>
      </Portal>

      <Portal>
        <Modalize
          ref={intentRef}
          modalStyle={{
            backgroundColor: color.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 18,
          }}
          handleStyle={{
            backgroundColor: color.text,
            height: 6,
            width: 40,
            marginBottom: 8,
          }}
          handlePosition="inside"
          panGestureEnabled
          scrollViewProps={{scrollEnabled: false}}
          adjustToContentHeight
          onClose={onIntentionsClose}>
          <BottomSheetIntentions
            title="Báo cáo"
            subtitle="Tại sao bạn báo cáo bài viết này?"
            content="Báo cáo của bạn sẽ được ẩn danh. Nếu ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy báo ngay cho dịch vụ khẩn cấp tại địa phương."
            options={reportChoices}
            onClose={closeIntentions}
          />
        </Modalize>
      </Portal>

      <View style={styles.container}>
        {type != 'reel' && <View style={styles.blockWhite}></View>}
        <View style={styles.video}>
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
                    bufferConfig={{
                      minBufferMs: 15000,
                      maxBufferMs: 50000,
                      bufferForPlaybackMs: 2500,
                      bufferForPlaybackAfterRebufferMs: 5000,
                    }}
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
            <View style={styles.pagination}>
              {media.map((_: any, index: any) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
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
        <View style={styles.headerItem}>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.blockImg}
              onPress={() => {
                navigation.navigate('ProfileComp');
              }}>
              <Image
                style={styles.imgUser}
                source={{
                  uri: user.profilePic,
                }}
              />
            </TouchableOpacity>
            <View>
              <Text
                style={[
                  styles.textNormal,
                  {color: type === 'reel' ? Colors.dark.text : color.text},
                ]}>
                {user.handleName}
              </Text>
              <Text
                style={[
                  styles.text,
                  {color: type === 'reel' ? Colors.dark.text : color.text},
                ]}>
                Gợi ý cho bạn
              </Text>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={[
                styles.btnFollow,
                {
                  borderColor:
                    type === 'reel' ? Colors.light.background : color.text,
                },
              ]}>
              <Text
                style={[
                  styles.textNormal,
                  {color: type === 'reel' ? Colors.dark.text : color.text},
                ]}>
                Theo dõi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openOptions} style={styles.iconBlock}>
              <Image
                style={[
                  {
                    tintColor:
                      type === 'reel' ? Colors.light.background : color.text,
                  },
                  styles.icon,
                ]}
                source={require('../../../../assets/icon/menu-dots-vertical.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.muteButton}
          onPress={() => setMuted(!muted)}>
          <Image
            source={
              muted
                ? require('../../../../assets/icon/mute.png')
                : require('../../../../assets/icon/volume.png')
            }
            style={[{tintColor: Colors.dark.text}, styles.icon]}
          />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: color.background, padding: 10}}>
        <View style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.iconBlock} onPress={handleLike}>
              <Image
                style={[
                  {tintColor: isLiked ? color.error : color.text},
                  styles.icon,
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
            <TouchableOpacity style={styles.iconBlock} onPress={openComment}>
              <Image
                style={[{tintColor: color.text}, styles.icon]}
                source={require('../../../../assets/icon/comment.png')}
              />
            </TouchableOpacity>
            <Text style={{color: color.text, marginLeft: 8, marginRight: 16}}>
              {formatNumber(commentCount)}
            </Text>
            <TouchableOpacity
              style={styles.iconBlock}
              onPress={handleOpenModalShare}>
              <Image
                style={[{tintColor: color.text}, styles.icon]}
                source={require('../../../../assets/icon/share.png')}
              />
            </TouchableOpacity>
            <Text style={{color: color.text, marginLeft: 8, marginRight: 16}}>
              {formatNumber(share)}
            </Text>
          </View>
          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={[{tintColor: color.text}, styles.icon]}
              source={require('../../../../assets/icon/bookmark.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, {color: color.text}]}>{caption}</Text>
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

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  wrapper: {
    width: '100%',
    marginTop: 10,
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 10,
  },
  footerTop: {
    justifyContent: 'space-between',
  },
  countText: {
    color: Colors.dark.text,
    marginHorizontal: 8,
  },
  dateText: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  muteIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.dark.text,
  },
  video: {
    width: '100%',
    backgroundColor: Colors.black,
    height: 600,
  },
  headerItem: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.light.transparent,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  imgUser: {
    width: '100%',
    height: '100%',
  },
  textNormal: {
    fontSize: 14,
  },
  text: {
    fontSize: 12,
  },
  btnFollow: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.light.transparent,
    borderWidth: 1,
    marginRight: 10,
  },
  iconBlock: {
    width: 24,
    height: 24,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginVertical: 10,
    fontSize: 14,
  },
  muteButton: {
    width: 25,
    height: 25,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  blockWhite: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.light.transparent,
  },
  optionsButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  pagination: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
});

export default ItemHome;
