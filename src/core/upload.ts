import axios from 'axios';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {Buffer} from 'buffer';
import {BASE_URL} from '../../services/api';

const R2_PUBLIC_VIDEO_BASE_URL = 'https://media.cirla.io.vn';
const R2_PUBLIC_IMAGE_BASE_URL = 'https://image.cirla.io.vn';

type UploadCallbacks = {
  showUploadModal: (uri: string, type: 'image' | 'video') => void;
  hideUploadModal: () => void;
  setProgress: (progress: number) => void;
};

export const uploadVideoToR2 = async (
  uri: string,
  {showUploadModal, hideUploadModal, setProgress}: UploadCallbacks,
): Promise<string> => {
  showUploadModal(uri, 'video');
  try {
    const fileName = `video_${Date.now()}.mp4`;
    const {data} = await axios.post(`${BASE_URL}/r2/presigned-video-url`, {
      fileName,
      contentType: 'video/mp4',
    });

    const {url: signedUrl} = data;
    const fileUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const fileData = await RNFS.readFile(fileUri, 'base64');
    const fileBuffer = Buffer.from(fileData, 'base64');

    await axios.put(signedUrl, fileBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
      },
      onUploadProgress: progressEvent => {
        const progress = progressEvent.loaded / progressEvent.total;
        setProgress(progress);
      },
    });

    const publicUrl = `${R2_PUBLIC_VIDEO_BASE_URL}/${fileName}`;
    hideUploadModal();
    return publicUrl;
  } catch (error) { 
    hideUploadModal();
    console.error('Video upload error:', error);
    throw error;
  }
};

export const uploadImageToR2 = async (
  uri: string,
  {showUploadModal, hideUploadModal, setProgress}: UploadCallbacks,
): Promise<string> => {
  showUploadModal(uri, 'image');
  try {
    const fileName = `image_${Date.now()}.jpg`;
    const {data} = await axios.post(`${BASE_URL}/r2/presigned-url`, {
      fileName,
      contentType: 'image/jpeg',
    });

    const {url: signedUrl} = data;
    const fileUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const fileData = await RNFS.readFile(fileUri, 'base64');
    const fileBuffer = Buffer.from(fileData, 'base64');

    await axios.put(signedUrl, fileBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
      onUploadProgress: progressEvent => {
        const progress = progressEvent.loaded / progressEvent.total;
        setProgress(progress);
      },
    });

    const publicUrl = `${R2_PUBLIC_IMAGE_BASE_URL}/${fileName}`;
    hideUploadModal();
    return publicUrl;
  } catch (error) {
    hideUploadModal();
    console.error('Image upload error:', error);
    throw error;
  }
};
