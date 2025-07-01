import {relationAction} from '../../../../services/relationRedux/relationSlice';
import {AppDispatch} from '../../../../services/store';
import {
  removeBookmark,
  saveBookmark,
} from '../../../../services/bookmarkRedux/bookmarkSlice';
import {HandleBookmarkParams} from '../types';
import {
  fetchStoryDetails,
  seenStory,
} from '../../../../services/StoryRedux/StorySlice';
import {
  checkStorySeenInStorage,
  markStoryAsSeen,
} from '../../../../services/storage/storage';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

export const handleBookmark = async ({
  isBookmarked,
  _id,
  refreshToken,
  setIsBookmarked,
  dispatch,
}: HandleBookmarkParams) => {
  if (!isBookmarked) {
    setIsBookmarked(true);
    try {
      await dispatch(
        saveBookmark({
          postId: _id,
          refreshToken,
        }),
      ).unwrap();
    } catch (res) {
      setIsBookmarked(false);
    }
  } else {
    setIsBookmarked(false);
    try {
      await dispatch(
        removeBookmark({
          postIds: [_id],
          refreshToken,
        }),
      ).unwrap();
    } catch (res) {
      setIsBookmarked(true);
    }
  }
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} năm trước`;
  if (months > 0) return `${months} tháng trước`;
  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  if (minutes > 0) return `${minutes} phút trước`;
  return `Vừa xong`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num?.toString();
};

export const handleFollowToggle = async ({
  userId,
  follow,
  dispatch,
}: {
  userId: string;
  follow: boolean;
  dispatch: AppDispatch;
}) => {
  const actionType = follow ? 'unfollow' : 'follow';
  try {
    await dispatch(
      relationAction({
        targetId: userId,
        action: actionType,
      }),
    ).unwrap();
  } catch (error) {
    console.error('[ERROR] handleFollowToggle failed:', error);
    GlobalAlertManager.show(
      'Thất bại',
      `${actionType === 'follow' ? 'Theo dõi' : 'Bỏ theo dõi'} thất bại`,
    );
  }
};

export const handleUserPress = async (
  item: any,
  dispatch: any,
  navigation: any,
  storyDetails: any[],
  user: any,
  followingUsers: any[],
) => {
  const isCurrentUser =
    item._id === user?._id || item.handleName === user?.handleName;

  if (!item.stories.length && isCurrentUser) {
    navigation.navigate('UpStory');
    return;
  }

  try {
    const allUsersWithStories = [user, ...followingUsers].filter(
      u => u.stories?.length > 0,
    );

    const storyGroups = await Promise.all(
      allUsersWithStories.map(async u => {
        const detailRes = await dispatch(
          fetchStoryDetails({storyIds: u.stories}),
        ).unwrap();

        const stories = await Promise.all(
          detailRes.map(async story => {
            try {
              await dispatch(seenStory({storyId: story._id}));
              const hasSeen = await checkStorySeenInStorage(
                story._id,
                story.createdAt,
              );
              if (!hasSeen) {
                await markStoryAsSeen(story._id, story.createdAt);
              }

              const populatedTags = (story.tags || []).map(tag => {
                const userDetail = tag.user;
                if (typeof userDetail === 'string') {
                  const foundUser =
                    story.viewedByUsers?.find(
                      (u: any) => u._id === userDetail,
                    ) ||
                    storyDetails
                      .flatMap(s => s.viewedByUsers || [])
                      .find((u: any) => u._id === userDetail);

                  return {
                    ...tag,
                    user: foundUser || {
                      _id: userDetail,
                      handleName: 'unknown',
                      username: 'unknown',
                    },
                  };
                }
                return tag;
              });

              return {
                ...story,
                isSeen: true,
                tags: populatedTags,
                uriVideo: story.mediaUrl.endsWith('.m3u8')
                  ? story.mediaUrl
                  : null,
                image:
                  story.mediaUrl.endsWith('.jpg') ||
                  story.mediaUrl.endsWith('.png')
                    ? story.mediaUrl
                    : null,
              };
            } catch {
              return null;
            }
          }),
        );

        const validStories = stories.filter(s => s);
        return {
          creator: {
            username: u.handleName,
            profilePic: u.profilePic,
          },
          stories: validStories,
        };
      }),
    );

    const validStoryGroups = storyGroups.filter(
      group => group.stories.length > 0,
    );

    const currentGroupIndex = validStoryGroups.findIndex(
      g => g.creator.username === item.handleName,
    );

    if (currentGroupIndex === -1) {
      GlobalAlertManager.show('Lỗi', 'Không tìm thấy story để hiển thị');
      return;
    }

    navigation.navigate(isCurrentUser ? 'SeenStoryOwner' : 'SeenStory', {
      stories: validStoryGroups[currentGroupIndex].stories,
      creator: validStoryGroups[currentGroupIndex].creator,
      storyGroups: validStoryGroups,
      storyGroupIndex: currentGroupIndex,
    });
  } catch (error) {
    console.error('❌ fetchStoryDetails or seenStory failed:', error);
    GlobalAlertManager.show('Lỗi', 'Lỗi khi tải story');
  }
};

export const handleHighlightPress = async (
  story: any,
  dispatch: AppDispatch,
  navigation: any,
  viewerUser: any,
  isOwner: boolean,
) => {
  try {
    const detailRes = await dispatch(
      fetchStoryDetails({storyIds: story.storyId}),
    ).unwrap();

    const seenedStories = await Promise.all(
      detailRes.map(async (item: any) => {
        try {
          await dispatch(seenStory({storyId: item._id}));

          const hasSeen = await checkStorySeenInStorage(
            item._id,
            item.createdAt,
          );
          if (!hasSeen) {
            await markStoryAsSeen(item._id, item.createdAt);
          }

          return {
            ...item,
            uriVideo: item.mediaUrl?.endsWith('.m3u8') ? item.mediaUrl : null,
            image:
              item.mediaUrl?.endsWith('.jpg') || item.mediaUrl?.endsWith('.png')
                ? item.mediaUrl
                : null,
          };
        } catch (err) {
          console.error('seenStory error', err);
          return null;
        }
      }),
    );

    const validStories = seenedStories.filter(s => s);

    if (!validStories.length) {
      GlobalAlertManager.show('Lỗi', 'Không có story hợp lệ để hiển thị');
      return;
    }

    const creator = {
      username: viewerUser?.handleName,
      profilePic: viewerUser?.profilePic,
    };

    navigation.navigate(isOwner ? 'SeenStoryOwner' : 'SeenStory', {
      stories: validStories,
      creator,
    });
  } catch (error) {
    console.error('handleHighlightPress error:', error);
    GlobalAlertManager.show('Thất bại', 'Lỗi khi tải highlight');
  }
};
