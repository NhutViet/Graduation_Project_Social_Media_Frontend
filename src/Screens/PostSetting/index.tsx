import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
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
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../services/store';
import {uploadPostWithMedia} from '../../../services/postRedux/postSlice';
import Toast from 'react-native-toast-message';
import VideoModal from './Components/VideoModal';
import BottomSheet, {
  BottomSheetRef,
} from '../PostStory/BottomSheet/BottomSheetMusic';
import {uploadImageToR2, uploadToCloudflare} from '../../core/upload';
import {useUploadProgress} from '../../../services/UploadProgressManager';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
// import {TaggedMedia} from '../TagSo';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

// type Params = {
//   updated?: TaggedMedia[];
// };

export const PostSetting = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = getAddPostStyles(theme);
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const sheetRef = useRef<BottomSheetRef>(null);
  const [selectedMusic, setSelectedMusic] = useState<{
    musicId: string;
    timeStart: number;
    timeEnd: number;
    song: string;
    songImage: string;
  } | null>(null);

  //lâys dữ liệu
  const route = useRoute();
  const {selectedMedia}: any = route.params || [];
  const [caption, setCaption] = useState('');
  //modal xem video
  const [isModal, setIsModal] = useState(false);
  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress();

  const handleUploadAll = async () => {
    // if (!mediaWithTags || mediaWithTags.length === 0) {
    //   GlobalAlertManager.show(
    //     'Thông báo',
    //     'Hãy chọn ít nhất một ảnh hoặc video',
    //   );
    //   return;
    // }

    // for (const media of mediaWithTags) {
    //   if (!media.node.image.uri) {
    //     GlobalAlertManager.show('Lỗi', 'URI của media không hợp lệ');
    //     return;
    //   }
    // }

    try {
      const uploadedMedia: {imageUrl?: string; videoUrl?: string}[] = [];

      for (const media of selectedMedia) {
        const uri = media.node.image.uri;
        const isVideo = media.node.type.startsWith('video');

        try {
          if (isVideo) {
            const videoUrl = await uploadToCloudflare(uri, {
              showUploadModal,
              hideUploadModal,
              setProgress,
            });
            uploadedMedia.push({
              videoUrl: `https://videodelivery.net/${videoUrl}/manifest/video.m3u8`,
            });
          } else {
            const imageUrl = await uploadImageToR2(uri, {
              showUploadModal,
              hideUploadModal,
              setProgress,
            });
            uploadedMedia.push({imageUrl});
          }
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

      const resultAction = await dispatch(uploadPostWithMedia(body));

      if (uploadPostWithMedia.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: '🎉 Thành công',
          text2: 'Bài viết của bạn đã được tải lên!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Thất bại',
          text2: 'Tải lên thất bại',
        });
      }
    } catch (error) {
      GlobalAlertManager.show('Lỗi', 'Đã có lỗi xảy ra khi upload');
      console.error(error);
    }
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
      <ScrollView style={styles.container}>
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
        <TextInput
          placeholder="Thêm chú thích"
          placeholderTextColor={color.gray21}
          style={styles.textIn}
          multiline={true}
          textAlignVertical="top"
          value={caption}
          onChangeText={setCaption}
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
        <Section
          title={'Đối tượng'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/eye.png')}
        />
        <View style={styles.divi}></View>
        <Section
          title={'Lựa chọn khác'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/threedot.png')}
        />
      </ScrollView>
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
