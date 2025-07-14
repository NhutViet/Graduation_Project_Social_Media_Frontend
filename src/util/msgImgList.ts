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
  page: number;
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

    if (!response.data || !response.data.media) {
      return {
        media: [],
        page: 1,
      };
    }
    return {
      media: response.data.media,
      page: response.data.page,
    };
  } catch (error: any) {
    console.warn('❌❌❌❌❌❌Error fetching media:', error);
    return false;
  }
};
