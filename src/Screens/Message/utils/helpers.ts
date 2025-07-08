import axiosInstance from '@services/axiosInstance';
import { API } from '@services/api';

export const getRelationShip = async ({ fromUserId, toUserId }: { fromUserId: string; toUserId: string }): Promise<Boolean> => {
  try {
    const response = await axiosInstance.get(
      `${API.GET_RELATIONSHIP}/${fromUserId}/${toUserId}`,
      {
        headers: { token: 'refresh' },
      }
    );
    return response.data.data;
  } catch (error: any) {
    return false;
  }
};

export const updatedRoomStatus = async ({ roomId }: { roomId: string }) => {
  try {
    const response = await axiosInstance.patch(
      `${API.UPDATE_ROOM_STATUS}/${roomId}`,
      {},
      {
        headers: { token: 'refresh' },
      }
    );
    console.log(response.data.message);
    return response.data;
  } catch (error: any) {
    return null;
  }
};

export const isBothFollowing = async (currentUser: string, targetUser: string) => {
  const [isCurrentFollowTarget, isTargetFollowCurrent] = await Promise.all([
    getRelationShip({fromUserId: currentUser, toUserId: targetUser}),
    getRelationShip({fromUserId: targetUser, toUserId: currentUser}),
  ]);
  return isCurrentFollowTarget && isTargetFollowCurrent;
};
