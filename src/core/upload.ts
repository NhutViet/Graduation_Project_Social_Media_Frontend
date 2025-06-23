import axios from 'axios';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {Buffer} from 'buffer';
import {BASE_URL} from '../../services/api';

const R2_PUBLIC_BASE_URL =
  'https://pub-ad59fb2f0d474d27b87956b4048028d8.r2.dev';

type UploadCallbacks = {
  showUploadModal: (uri: string, type: 'image' | 'video') => void;
  hideUploadModal: () => void;
  setProgress: (progress: number) => void;
};

export const uploadToCloudflare = async (
  uri: string,
  {showUploadModal, hideUploadModal, setProgress}: UploadCallbacks,
): Promise<string> => {
  showUploadModal(uri, 'video');
  try {
    const res = await axios.get(`${BASE_URL}/stream/upload-url`);
    const {uploadURL, key} = res.data.uploadURL;

    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      type: 'video/mp4',
      name: 'video.mp4',
    });

    await axios.post(uploadURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        const progress = progressEvent.loaded / progressEvent.total;
        setProgress(progress);
      },
    });

    hideUploadModal();
    return key;
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
    const ext = uri.split('.').pop() || 'jpg';
    const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const fileName = `image_${uniqueId}.${ext}`;
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

    const publicUrl = `${R2_PUBLIC_BASE_URL}/${fileName}`;
    hideUploadModal();
    return publicUrl;
  } catch (error) {
    hideUploadModal();
    console.error('Image upload error:', error);
    throw error;
  }
};
