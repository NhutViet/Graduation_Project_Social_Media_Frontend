import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTheme} from '../../util/ThemeContext';
import {getAddPostStyles} from '../../StyleSheet/AddPostStyles';
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../../../assets/color/Colors';
import Section from '../../../components/Section';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {uploadPostWithMedia} from '../../../services/postRedux/postSlice';
import VideoModal from './Components/VideoModal';
import BottomSheet, {
  BottomSheetRef,
} from '../PostStory/BottomSheet/BottomSheetMusic';
import {uploadImageToR2, uploadToCloudflare} from '../../core/upload';
import {useUploadProgress} from '../../../services/UploadProgressManager';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {TaggedMedia} from '../TagSo';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {checkProfanityAndAlert} from '../../util/profanityFilter';
import {fetchFollowers} from '@services/relationRedux/relationSlice';
import MentionSuggestion from './Components/MentionSuggestion';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

type Params = {
  updated?: TaggedMedia[];
};

export const PostSetting = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = getAddPostStyles(theme);
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const sheetRef = useRef<BottomSheetRef>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedMusic, setSelectedMusic] = useState<{
    musicId: string;
    timeStart: number;
    timeEnd: number;
    song: string;
    songImage: string;
  } | null>(null);
  const {followers} = useSelector((state: RootState) => state.relation);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [captionLayoutY, setCaptionLayoutY] = useState(0);
  const popupHeight = 200;

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  //lâys dữ liệu
  const route = useRoute();
  const {selectedMedia, updated} = route.params as {
    selectedMedia: PhotoIdentifier[];
    updated?: TaggedMedia[];
  };

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchFollowers({userId: user._id}));
    }
  }, []);

  const handleChangeText = (text: string) => {
    setCaption(text);

    const lastAt = text.lastIndexOf('@');

    if (lastAt !== -1) {
      const textAfterAt = text.slice(lastAt + 1);
      const isValidQuery = /^[a-zA-Z0-9_]*$/.test(textAfterAt);

      if (isValidQuery) {
        setMentionQuery(textAfterAt);
        setShowSuggestions(true);
        return;
      }
    }

    setShowSuggestions(false);
    setMentionQuery('');
  };

  useFocusEffect(
    useCallback(() => {
      if (updated) {
        setMediaWithTags(updated);
      }
    }, [updated]),
  );

  const [mediaWithTags, setMediaWithTags] = useState<TaggedMedia[]>(
    selectedMedia.map(item => ({...item, tags: []})),
  );

  const [caption, setCaption] = useState('');
  //modal xem video
  const [isModal, setIsModal] = useState(false);
  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress();

  const handleUploadAll = async () => {
    if (!mediaWithTags || mediaWithTags.length === 0) {
      GlobalAlertManager.show(
        'Chưa chọn phương tiện',
        'Hãy chọn ít nhất một ảnh hoặc video',
      );
      return;
    }

    if (checkProfanityAndAlert(caption)) {
      return;
    }

    for (const media of mediaWithTags) {
      if (!media.node.image.uri) {
        GlobalAlertManager.show('Lỗi', 'URI của media không hợp lệ');
        return;
      }
    }

    try {
      const uploadedMedia: {
        imageUrl?: string;
        videoUrl?: string;
        tags?: {
          userId: string;
          handleName: string;
          positionX: number;
          positionY: number;
        }[];
      }[] = [];

      for (const media of mediaWithTags) {
        const uri = media.node.image.uri;
        const isVideo = media.node.type.startsWith('video');

        let uploadedItem: {
          imageUrl?: string;
          videoUrl?: string;
          tags?: {
            userId: string;
            handleName: string;
            positionX: number;
            positionY: number;
          }[];
        } = {};

        try {
          if (isVideo) {
            const videoUrl = await uploadToCloudflare(uri, {
              showUploadModal,
              hideUploadModal,
              setProgress,
            });
            uploadedItem.videoUrl = `https://videodelivery.net/${videoUrl}/manifest/video.m3u8`;
          } else {
            const imageUrl = await uploadImageToR2(uri, {
              showUploadModal,
              hideUploadModal,
              setProgress,
            });
            uploadedItem.imageUrl = imageUrl;
          }

          //nếu có tags
          if (media.tags && media.tags.length > 0) {
            uploadedItem.tags = media.tags.map(tag => ({
              userId: tag.user._id,
              handleName: tag.user.handleName,
              positionX: tag.position.x,
              positionY: tag.position.y,
            }));
          }

          uploadedMedia.push(uploadedItem);
        } catch (err) {
          GlobalAlertManager.show(
            'Thất bại',
            `Không thể upload ${isVideo ? 'video' : 'ảnh'}: ${uri}`,
          );
          return;
        }
      }

      const postType =
        uploadedMedia.length === 1 && uploadedMedia[0].videoUrl
          ? 'reel'
          : 'post';

      const body = {
        post: {
          type: postType,
          caption,
          isEnable: true,
        },
        media: uploadedMedia,
        music: selectedMusic
          ? {
              musicId: selectedMusic.musicId,
              timeStart: selectedMusic.timeStart,
              timeEnd: selectedMusic.timeEnd,
            }
          : undefined,
      };
      console.log('body: ', JSON.stringify(body, null, 2));

      const resultAction = await dispatch(
        uploadPostWithMedia({payload: body, handleName: user?.handleName}),
      );

      if (uploadPostWithMedia.fulfilled.match(resultAction)) {
        GlobalAlertManager.show(
          '🎉 Thành công',
          'Bài viết của bạn đã được tải lên!',
        );
        setMediaWithTags([]);
        navigation.reset({
          index: 0,
          routes: [{name: 'BottomTabs'}],
        });
      } else {
        GlobalAlertManager.show('Thất bại', 'Tải lên thất bại');
      }
    } catch (error) {
      GlobalAlertManager.show('Lỗi', 'Đã có lỗi xảy ra khi upload');
      console.error(error);
    }
  };

  const countAllTag = (media: TaggedMedia[]): number => {
    return media.reduce((sum, item) => sum + (item.tags?.length ?? 0), 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rowSpace}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.iconR}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Bài viết mới</Text>
        <View style={styles.iconR}></View>
      </View>
      <Animated.ScrollView
        style={styles.container}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <View
          style={[
            {
              backgroundColor: color.transparent,
              justifyContent: 'center',
              marginLeft: 20,
            },
            selectedMedia.length === 1 && {alignItems: 'center'},
          ]}>
          {selectedMedia && selectedMedia.length > 1 ? (
            <FlashList
              data={selectedMedia}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}: any) => (
                <Image
                  source={{uri: item.node.image.uri}}
                  style={[styles.imgShow]}
                />
              )}
              estimatedItemSize={200}
            />
          ) : (
            <TouchableOpacity
              onLongPress={() => {
                if (selectedMedia[0].node.type.startsWith('video')) {
                  setIsModal(true);
                }
              }}>
              <Image
                source={{uri: selectedMedia[0].node.image.uri}}
                style={[styles.imgShow]}
              />
              {selectedMedia[0].node.type.startsWith('video') && (
                <View style={styles.reelsContainer}>
                  <Image
                    source={require('../../../assets/icon/clapperboard.png')}
                    style={styles.iconReels}
                  />
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        <MentionSuggestion
          visible={showSuggestions}
          query={mentionQuery}
          followers={followers}
          onSelect={handle => {
            const lastAt = caption.lastIndexOf('@');
            const newText = caption.slice(0, lastAt + 1) + handle + ' ';
            setCaption(newText);
            setShowSuggestions(false);
          }}
          backgroundColor={color.background}
          positionY={captionLayoutY}
          scrollY={scrollY}
        />

        <TextInput
          placeholder="Thêm chú thích"
          placeholderTextColor={color.textSecondary}
          style={styles.textIn}
          multiline={true}
          textAlignVertical="top"
          value={caption}
          onChangeText={handleChangeText}
          onLayout={e => {
            e.target.measureInWindow((_x, y) => {
              setCaptionLayoutY(y);
            });
          }}
        />
        <TouchableOpacity style={styles.btnTD}>
          <Image
            source={require('../../../assets/icon/Menu.png')}
            style={styles.icon}
          />
          <Text style={[styles.textR, {fontWeight: 'normal'}]}>
            Thăm dò ý kiến
          </Text>
        </TouchableOpacity>
        <Section
          title={'Gắn thẻ người khác'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/tag.png')}
          backData={countAllTag(mediaWithTags).toString()}
          func={() =>
            navigation.navigate('TagSo', {
              selectedMedia: mediaWithTags,
            })
          }
        />
        <Section
          title={'Thêm vị trí'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/location.png')}
        />
        <Section
          title={selectedMusic?.song ? selectedMusic.song : 'Thêm nhạc'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/add_song.png')}
          func={() => sheetRef.current?.open()}
        />
        <View style={styles.divi}></View>
        <Section
          title={'Lựa chọn khác'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/threedot.png')}
        />
      </Animated.ScrollView>
      <TouchableOpacity style={styles.btnShare} onPress={handleUploadAll}>
        <Text style={styles.textBtn}>Chia sẻ</Text>
      </TouchableOpacity>
      <VideoModal
        uri={selectedMedia[0]?.node?.image?.uri}
        visible={isModal}
        onClose={() => setIsModal(false)}
      />
      <BottomSheet
        ref={sheetRef}
        onDoneSelect={(musicInfo: any) => {
          setSelectedMusic(musicInfo);
        }}
      />
    </SafeAreaView>
  );
};
