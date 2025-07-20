import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  CreateHighlightPayload,
  FetchHighlightPayload,
  Story,
  userFollow,
} from './StoryType';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const fetchStoryDetails = createAsyncThunk<
  Story[],
  {storyIds: string[]},
  {rejectValue: string}
>('stories/fetchStoryDetails', async ({storyIds}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(
      '/stories',
      {storyId: storyIds},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Không thể lấy chi tiết story',
    );
  }
});

export const seenStory = createAsyncThunk<
  any,
  {storyId: string},
  {rejectValue: string}
>('stories/seenStory', async ({storyId}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.patch(
      '/stories/seen',
      {_id: storyId},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to mark story as seen',
    );
  }
});

export const fetchFollowingStories = createAsyncThunk<
  userFollow[],
  {page: number},
  {rejectValue: {message: string}}
>('stories/fetchFollowing', async ({page}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get(
      `/stories/following?page=${page}`,
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Lấy stories thất bại',
    });
  }
});

export const fetchGetPostedSotry = createAsyncThunk<
  Story[],
  void,
  {rejectValue: string}
>('stories/fetchPostedSotry', async (_, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get(`/stories/me`, {
      headers: {
        token: 'refresh',
      },
    });
    return response.data?.data || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Không lấy được story đã đăng',
    );
  }
});

export const toggleLikeStory = createAsyncThunk<
  {storyId: string; likedByUsers: string[]},
  {storyId: string},
  {rejectValue: string}
>('stories/toggleLikeStory', async ({storyId}, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.patch(
      `/stories/like`,
      {_id: storyId},
      {
        headers: {token: 'refresh'},
      },
    );
    return {
      storyId: res.data.data._id,
      likedByUsers: res.data.data.likedByUsers || [],
    };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to like story',
    );
  }
});

export const createHighlightStory = createAsyncThunk<
  Story,
  CreateHighlightPayload,
  {rejectValue: string}
>('stories/createHighlightStory', async (payload, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(
      `${API.CREATE_HIGHLIGHT_STORY}`,
      payload,
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Không thể tạo Highlight mới',
    );
  }
});

export const fetchHighlightStory = createAsyncThunk<
  Story[],
  FetchHighlightPayload,
  {rejectValue: string}
>('stories/getHighlighrStory', async ({userId}, {rejectWithValue}) => {
  try {
    console.log('🔍 Fetching highlight stories for userId:', userId);
    const response = await axiosInstance.get(
      `/stories/highlights/user/${userId}`,
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    console.log('🔍 API response:', {
      status: response.status,
      dataLength: response.data?.data?.length || 0,
      data: response.data?.data?.map((h: Story) => ({
        id: h._id,
        name: h.collectionName,
      })),
    });
    return response.data.data;
  } catch (error: any) {
    console.error('🔍 Error fetching highlight stories:', error);
    return rejectWithValue(
      error.response.data?.message || 'Lỗi không lấy được highlight story',
    );
  }
});

export const deleteStory = createAsyncThunk<
  {storyId: string},
  {storyId: string},
  {rejectValue: string}
>('stories/deleteStory', async ({storyId}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.patch(
      '/stories/delete',
      {_id: storyId},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return {storyId};
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Không thể xoá story',
    );
  }
});

export const createStory = createAsyncThunk<
  Story,
  {
    mediaUrl: string;
    music?: {
      _id: string;
      time_start: number;
      time_end: number;
    };
    content?: {
      text: string;
      x: number;
      y: number;
    };
    tags?: {
      user: string; // Chỉ là Mongo ID string
      position: {
        x: number;
        y: number;
      };
    }[];
  },
  {rejectValue: string}
>('stories/createStory', async (payload, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post('/stories/create', payload, {
      headers: {
        token: 'refresh',
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Không thể tạo story',
    );
  }
});

export const shareStory = createAsyncThunk<
  {shareTo: string[]; content: string},
  {
    roomIds: string[];
    message?: string;
    media: {
      type: 'image' | 'video';
      url: string;
    };
  },
  {rejectValue: string}
>('stories/shareStory', async (payload, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(API.SHARE_STORY, payload, {
      headers: {
        token: 'refresh',
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Không thể chia sẻ story',
    );
  }
});

export const deleteHighlightStory = createAsyncThunk<
  {highlightId: string},
  {highlightId: string},
  {rejectValue: string}
>('stories/deleteHighlightStory', async ({highlightId}, {rejectWithValue}) => {
  try {
    console.log('🔍 Deleting highlight with ID:', highlightId);
    const response = await axiosInstance.patch(
      API.DELETE_HIGHLIGHT_STORY,
      {_id: highlightId},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    console.log('🔍 Delete highlight response:', response.data);
    return {highlightId};
  } catch (error: any) {
    console.error('🔍 Delete highlight error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.message,
    });
    return rejectWithValue(
      error.response?.data?.message || 'Không thể xóa highlight story',
    );
  }
});

export const updateHighlightStory = createAsyncThunk<
  Story,
  {
    highlightId: string;
    collectionName?: string;
    thumbnail?: string;
    storyId?: string[];
  },
  {rejectValue: string}
>('stories/updateHighlightStory', async (payload, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.patch(
      API.UPDATE_HIGHLIGHT_STORY,
      {
        _id: payload.highlightId, 
        collectionName: payload.collectionName,
        thumbnail: payload.thumbnail,
        storyId: payload.storyId,
      },
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Không thể cập nhật highlight story',
    );
  }
});
