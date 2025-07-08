import {createAsyncThunk} from '@reduxjs/toolkit';
import {UserProfile} from './relationTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';
import {updateIsFollowByUserId} from '@services/postRedux/postReducer';

export const fetchFollowers = createAsyncThunk<
  UserProfile[],
  {userId: string},
  {rejectValue: string}
>('relations/followers', async ({userId}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(
      API.GET_FOLLOWERS,
      {userId},
      {
        headers: {
          token: 'refresh',
        },
      },
    );

    if (!response.data || !Array.isArray(response.data.followers)) {
      return rejectWithValue('Dữ liệu trả về không hợp lệ');
    }

    return response.data.followers;
  } catch (error: any) {
    console.error('fetchFollowers error:', error);

    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }

    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        'Lấy danh sách người theo dõi thất bại',
    );
  }
});

export const fetchFollowing = createAsyncThunk<
  UserProfile[],
  {userId: string},
  {rejectValue: string}
>('relations/following', async ({userId}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(
      API.GET_FOLLOWING,
      {userId},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data.following;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        'Lấy danh sách người đang theo dõi thất bại',
    );
  }
});

export const fetchBlocking = createAsyncThunk<
  UserProfile[],
  {userId: string},
  {rejectValue: string}
>('relations/blocking', async ({userId}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.post(
      API.GET_BLOCKING,
      {userId},
      {
        headers: {
          token: 'refresh',
        },
      },
    );
    return response.data.blocking;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        'Lấy danh sách người bị chặn thất bại',
    );
  }
});

export const relationAction = createAsyncThunk<
  any,
  {
    targetId: string;
    action: 'follow' | 'unfollow' | 'block' | 'unblock';
    senderId?: string;
    handleName?: string;
  },
  {rejectValue: string}
>(
  'relations/relationAction',
  async ({targetId, action, senderId, handleName}, {dispatch, rejectWithValue}) => {
    try {
      const response = await axiosInstance.put(
        API.RELATION_ACTION,
        {
          targetId,
          action,
        },
        {
          headers: {
            token: 'refresh',
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        if (action === 'follow' || action === 'unfollow') {
          dispatch(
            updateIsFollowByUserId({
              userId: targetId,
              isFollow: action === 'follow',
            }),
          );
        }
      }

      if (response.status >= 200 && response.status <= 300 && action === 'follow') {
        await axiosInstance.post(
          API.NOTIFICATION_API,
          {
            receiverIds: [targetId],
            title: `${handleName} đã theo dõi bạn`,
            body: 'Nhấn vào để xem chi tiết...',
            data: {
              type: 'follow',
              userId: senderId,
            },
          },
          {
            headers: {
              token: 'refresh',
            },
          },
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Thao tác quan hệ thất bại',
      );
    }
  },
);

export const fetchRecommendations = createAsyncThunk<
  UserProfile[],
  {limit?: number},
  {rejectValue: string}
>('relations/recommendations', async ({limit = 10}, {rejectWithValue}) => {
  try {
    const response = await axiosInstance.get(API.GET_RECOMMENDATIONS, {
      params: {limit},
      headers: {token: 'refresh'},
    });

    const data = response.data;
    if (!data || !Array.isArray(data.recommendations)) {
      return rejectWithValue('Dữ liệu trả về không hợp lệ');
    }
    return data.recommendations;
  } catch (error: any) {
    console.error('fetchRecommendations error:', error);
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        'Lấy danh sách gợi ý thất bại',
    );
  }
});

export const fetchViewedFollowers = createAsyncThunk<
  UserProfile[], { userId: string }, { rejectValue: string }
>(
  'relations/viewedFollowers',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API.GET_FOLLOWERS, { userId }, { headers: { token: 'refresh' } });
      if (!res.data?.followers) return rejectWithValue('Dữ liệu trả về không hợp lệ');
      return res.data.followers as UserProfile[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchViewedFollowing = createAsyncThunk<
  UserProfile[], { userId: string }, { rejectValue: string }
>(
  'relations/viewedFollowing',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API.GET_FOLLOWING, { userId }, { headers: { token: 'refresh' } });
      if (!res.data?.following) return rejectWithValue('Dữ liệu trả về không hợp lệ');
      return res.data.following as UserProfile[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
