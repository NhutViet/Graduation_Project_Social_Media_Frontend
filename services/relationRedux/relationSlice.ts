import {createAsyncThunk} from '@reduxjs/toolkit';
import {UserProfile} from './relationTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const fetchFollowers = createAsyncThunk<
  UserProfile[], 
  {userId: string}, 
  {rejectValue: string}
>(
  'relations/followers',
  async ({userId}, {rejectWithValue}) => {
    try {
      if (!userId || typeof userId !== 'string') {
        return rejectWithValue('User ID không hợp lệ');
      }

      console.log('Sending request to get followers for userId:', userId);
      
      const response = await axiosInstance.post(API.GET_FOLLOWERS, { 
        userId: userId.toString().trim()
      }, {
        headers: {
            token: 'refresh',
        },
      });

      console.log('Server response:', response.data);

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
        'Lấy danh sách người theo dõi thất bại'
      );
    }
  }
);

export const fetchFollowing = createAsyncThunk<
  UserProfile[], 
  {userId: string}, 
  {rejectValue: string}
>(
  'relations/following',
  async ({userId}, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.post(API.GET_FOLLOWING, { userId }, {
        headers: {
            token: 'refresh',
        },
      });
      return response.data.following;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Lấy danh sách người đang theo dõi thất bại');
    }
  }
);

export const relationAction = createAsyncThunk<
  any,
  { targetId: string; action: 'follow' | 'unfollow' | 'block' | 'unblock' },
  { rejectValue: string }
>(
  'relations/relationAction',
  async ({ targetId, action }, { rejectWithValue }) => {
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
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Thao tác quan hệ thất bại'
      );
    }
  }
);