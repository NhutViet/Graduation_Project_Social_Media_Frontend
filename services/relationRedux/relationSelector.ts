import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectFollowers = (state: RootState) => state.relation.followers;
const selectFollowing = (state: RootState) => state.relation.following;
const selectMyUserId = (state: RootState) => state.user.user?._id;

const selectViewedFollowers = (state: RootState) => state.relation.viewedFollowers;
const selectViewedFollowing = (state: RootState) => state.relation.viewedFollowing;

export const selectDisplayFollowers = createSelector(
  [selectFollowers, selectFollowing],
  (followers, following) => {
    const followingIds = new Set(following.map(u => u._id));
    const mutual = followers.filter(u => followingIds.has(u._id));
    const others = followers.filter(u => !followingIds.has(u._id));
    return [...mutual, ...others];
  }
);

export const selectDisplayViewedFollowers = createSelector(
  [selectViewedFollowers, selectFollowing, selectMyUserId],
  (viewedFollowers, personalFollowing, myUserId) => {
    const followingIds = new Set(personalFollowing.map(u => u._id));
    const withFlag = viewedFollowers.map(u => ({
      ...u,
      isMeFollowing: followingIds.has(u._id),
    }));
    const self = myUserId
      ? withFlag.filter(u => u._id === myUserId)
      : [];
    const mutual = withFlag.filter(u => u.isMeFollowing && u._id !== myUserId);
    const others = withFlag.filter(u => !u.isMeFollowing && u._id !== myUserId);
    return [...self, ...mutual, ...others];
  }
);

export const selectDisplayFollowing = createSelector(
  [selectFollowing, selectFollowers],
  (following, followers) => {
    const followerIds = new Set(followers.map(u => u._id));
    const mutual = following.filter(u => followerIds.has(u._id));
    const others = following.filter(u => !followerIds.has(u._id));
    return [...mutual, ...others];
  }
);

export const selectDisplayViewedFollowing = createSelector(
  [selectViewedFollowing, selectFollowing, selectMyUserId],
  (viewedFollowing, personalFollowing, myUserId) => {
    const followingIds = new Set(personalFollowing.map(u => u._id));
    const withFlag = viewedFollowing.map(u => ({
      ...u,
      isMeFollowing: followingIds.has(u._id),
    }));
    const self = myUserId
      ? withFlag.filter(u => u._id === myUserId)
      : [];
    const mutual = withFlag.filter(u => u.isMeFollowing && u._id !== myUserId);
    const others = withFlag.filter(u => !u.isMeFollowing && u._id !== myUserId);
    return [...self, ...mutual, ...others];
  }
);
