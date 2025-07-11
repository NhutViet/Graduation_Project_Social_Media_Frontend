import { API } from '@services/api';
import axiosInstance from '@services/axiosInstance';

export interface MediaItem {
  _id: string;
  media: {
    url: string;
    type: 'image' | 'video';
  };
  createdAt: string;
  senderId: {
    handleName: string;
  };
}

interface MediaResponse {
  media: MediaItem[];
  page: string;
}

export const getAllMediaInRoom = async ({
  roomId,
  page,
}: {
  roomId: string;
  page: number
}): Promise<MediaResponse | false> => {
  try {
    const response = await axiosInstance.get(
      `${API.MESSAGES_MEDIA}/${roomId}?page=${page}`,
      {
        headers: { token: 'refresh' },
      }
    );

    if (response.data && response.data.data) {
      return {
        media: response.data.data.media,
        page: response.data.data.page,
      };
    }
    return false;
  } catch (error: any) {
    console.warn('❌❌❌❌❌❌Error fetching media:', error);
    return false;
  }
};
