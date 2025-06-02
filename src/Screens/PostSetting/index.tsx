import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '../../util/ThemeContext';
import {getAddPostStyles} from '../../StyleSheet/AddPostStyles';
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../../../assets/color/Colors';
import Section from '../../../components/Section';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {useUploadProgress} from '../../../services/UploadProgressManager';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../services/store';
import {uploadPostWithMedia} from '../../../services/postRedux/postSlice';
import Toast from 'react-native-toast-message';
import VideoModal from './Components/VideoModal';

export const PostSetting = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = getAddPostStyles(theme);
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  //lâys dữ liệu
  const route = useRoute();
  const {selectedMedia}: any = route.params || [];

  const {showUploadModal, hideUploadModal, setProgress} = useUploadProgress();
  const [caption, setCaption] = useState('');

  //modal xem video
  const [isModal, setIsModal] = useState(false);
  

  const uploadToCloudinary = async (uri: string, type: string) => {
    showUploadModal(uri, type as 'video' | 'image');

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: type === 'video' ? 'video/mp4' : 'image/jpeg',
      name: `justina.${type === 'video' ? 'mp4' : 'jpg'}`,
    });
    formData.append('upload_preset', 'upload_video');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dsvcoywkc/' +
          (type === 'video' ? 'video' : 'image') +
          '/upload',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: progressEvent => {
            const progress = progressEvent.loaded / progressEvent.total;
            setProgress(progress);
          },
        },
      );

      hideUploadModal();
      return res.data.secure_url;
    } catch (error) {
      hideUploadModal();
      throw error;
    }
  };

  const handleUploadAll = async () => {
    if (!selectedMedia || selectedMedia.length === 0) {
      Alert.alert('No media selected', 'Please select at least one media file');
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{name: 'BottomTabs'}],
    });

    try {
      const uploadedUrls: string[] = [];

      for (const media of selectedMedia) {
        const uri = media.node.image.uri;
        const type = media.node.type.startsWith('video') ? 'video' : 'image';

        try {
          const url = await uploadToCloudinary(uri, type);
          uploadedUrls.push(url);
        } catch (err) {
          console.log(`Upload failed for ${uri}`);
          Alert.alert('Upload failed', `Upload failed for ${uri}`);
          return;
        }
      }

      const videoCount = selectedMedia.filter((m: any) =>
        m.node.type.startsWith('video'),
      ).length;

      const postType = videoCount === 1 ? 'reel' : 'post';

      const body = {
        post: {
          type: postType,
          caption: caption,
          isEnable: true,
        },
        media: uploadedUrls.map(url => ({
          videoUrl: url,
        })),
      };

      const resultAction = await dispatch(uploadPostWithMedia(body));

      if (uploadPostWithMedia.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: '🎉 Success',
          text2: 'Your post has been uploaded!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Upload failed',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('chọn nè: ', selectedMedia);
    console.log('VIDEO URI:', selectedMedia[0]?.node?.image?.uri);
  }, [selectedMedia]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rowSpace}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.iconR}
          />
        </TouchableOpacity>
        <Text style={styles.title}>New Campain</Text>
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
          iconLeft={require('../../../assets/icon/tagSO.png')}
        />
        <Section
          title={'Thêm vị trí'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/location.png')}
        />
        <Section
          title={'Thêm nhạc'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/music.png')}
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
        <Text style={styles.textBtn}>Share</Text>
      </TouchableOpacity>
      <VideoModal uri={selectedMedia[0]?.node?.image?.uri} visible={isModal} onClose={() => setIsModal(false)}/>
    </SafeAreaView>
  );
};
