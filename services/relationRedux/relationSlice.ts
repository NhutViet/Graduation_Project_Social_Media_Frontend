import {createAsyncThunk} from '@reduxjs/toolkit';
import {UserProfile} from './relationTypes';
import axiosInstance from '../axiosInstance';
import {API} from '../api';

export const fetchFollowers = createAsyncThunk<
  UserProfile[], 
  {userID: string}, 
  {rejectValue: string}
>(
  'relations/followers',
  async ({userID}, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.post(API.GET_FOLLOWERS, { userID }, {
        headers: {
            token: 'refresh',
        },
      });
      return response.data.followers;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Lấy danh sách người theo dõi thất bại');
    }
  }
);

export const fetchFollowing = createAsyncThunk<
  UserProfile[], 
  {userID: string}, 
  {rejectValue: string}
>(
  'relations/following',
  async ({userID}, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.post(API.GET_FOLLOWING, { userID }, {
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