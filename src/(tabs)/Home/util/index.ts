import {Alert} from 'react-native';
import {relationAction} from '../../../../services/relationRedux/relationSlice';
import {AppDispatch} from '../../../../services/store';
import {
  removeBookmark,
  saveBookmark,
} from '../../../../services/bookmarkRedux/bookmarkSlice';
import {HandleBookmarkParams} from '../types';
import {seenStory} from '../../../../services/StoryRedux/StorySlice';
import {
  checkStorySeenInStorage,
  markStoryAsSeen,
} from '../../../../services/storage/storage';

export const handleBookmark = async ({
  isBookmarked,
  _id,
  playlists,
  refreshToken,
  itemsByPlaylist,
  setIsBookmarked,
  dispatch,
}: HandleBookmarkParams) => {
  if (!isBookmarked) {
    setIsBookmarked(true);
    try {
      await dispatch(
        saveBookmark({
          postId: _id,
          playlistId: playlists[0].id,
          refreshToken,
        }),
      ).unwrap();
    } catch (res) {
      const fallback = Object.values(itemsByPlaylist)
        .flat()
        .some(item => item.itemID === _id);
      setIsBookmarked(fallback);
    }
  } else {
    const playlistID = Object.entries(itemsByPlaylist).find(([_, items]) =>
      items.some(item => item.itemID.toString() === _id.toString()),
    )?.[0];
    setIsBookmarked(false);
    if (playlistID) {
      try {
        await dispatch(
          removeBookmark({
            postId: [_id],
            playlistId: playlistID,
            refreshToken,
          }),
        ).unwrap();
      } catch (res) {
        const fallback = Object.values(itemsByPlaylist)
          .flat()
          .some(item => item.itemID === _id);
        setIsBookmarked(fallback);
      }
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
  setFollow,
  dispatch,
}: {
  userId: string;
  follow: boolean;
  setFollow: (follow: boolean) => void;
  dispatch: AppDispatch;
}) => {
  const isFollowing = follow;
  const actionType = isFollowing ? 'unfollow' : 'follow';
  setFollow(!isFollowing);
  try {
    await dispatch(
      relationAction({
        targetId: userId,
        action: actionType,
      }),
    ).unwrap();
  } catch (error) {
    Alert.alert(
      `${actionType === 'follow' ? 'Theo dõi' : 'Bỏ theo dõi'} thất bại`,
      'Vui lòng thử lại sau.',
    );
    setFollow(isFollowing);
  }
};

export const handleUserPress = async (
  item: any,
  dispatch: any,
  navigation: any,
  storyDetails: any[],
  user: any,
) => {
  const isCurrentUser = item._id === user?._id;

  if (!item.stories.length && isCurrentUser) {
    navigation.navigate('UpStory');
    return;
  }

  const storyId = item.stories[0];
  const story = storyDetails.find(s => s._id === storyId);
  const createdAt = story?.createdAt;

  if (!createdAt) {
    console.warn('⚠️ createdAt is undefined, bỏ qua:', storyId);
    return;
  }

  try {
    const res = await dispatch(seenStory({storyId})).unwrap();
    const storyData = res?.data;

    if (!storyData || !storyData.mediaUrl) {
      Alert.alert('Không tìm thấy nội dung story để hiển thị');
      return;
    }

    // Nếu chưa lưu thì mới đánh dấu đã seen trong máy
    const hasSeen = await checkStorySeenInStorage(storyId, createdAt);
    if (!hasSeen) {
      await markStoryAsSeen(storyId, storyData.createdAt);
    }

    const selectedItem = {
      ...storyData,
      uriVideo: storyData.mediaUrl.endsWith('.m3u8')
        ? storyData.mediaUrl
        : null,
      image:
        storyData.mediaUrl.endsWith('.jpg') ||
        storyData.mediaUrl.endsWith('.png')
          ? storyData.mediaUrl
          : null,
      createdAt: storyData.createdAt,
    };

    const creator = {
      username: item.handleName,
      profilePic: item.profilePic,
    };

    navigation.navigate(isCurrentUser ? 'SeenStoryOwner' : 'SeenStory', {
      selectedItem,
      creator,
    });
  } catch (error) {
    Alert.alert('Lỗi khi tải story');
    console.error('❌ seenStory error', error);
  }
};
