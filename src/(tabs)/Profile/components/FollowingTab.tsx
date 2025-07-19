import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  fetchFollowing,
  relationAction,
  fetchRecommendations,
} from '../../../../services/relationRedux/relationSlice';
import {createRoom} from '../../../../services/roomRedux/roomSlice';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {UserProfile} from '@services/relationRedux/relationTypes';
import MoreActionPopup, {MoreActionPopupRef} from './MoreActionModal';
import {MoreVertical, Users} from 'lucide-react-native';
import LoadingModal from '../../../../components/Global/LoadingModal';

const FollowingTab = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const userID = useSelector((state: RootState) => state.user?.user?._id);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const {
    following: reduxFollowing,
    recommendations: reduxRecommendations,
    loading,
    error,
  } = useSelector((state: RootState) => state.relation);

  const popupRef = useRef<MoreActionPopupRef>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!userID) return;
    dispatch(fetchFollowing({userId: userID}));
    dispatch(fetchRecommendations({limit: 10}));
  }, [dispatch, userID]);

  const followingIds = useMemo(
    () => new Set(reduxFollowing.map(u => u._id)),
    [reduxFollowing],
  );
  const recommendations = useMemo(
    () => reduxRecommendations.filter(u => !followingIds.has(u._id)),
    [reduxRecommendations, followingIds],
  );

  const handleMessagingPress = async (item: UserProfile) => {
    try {
      const res = await dispatch(
        createRoom({name: '', user_ids: [item._id], type: 'waiting'}),
      ).unwrap();
      const {room} = res;
      const otherUsers = room.user_ids.filter(user => user._id !== userID);
      const img1 = otherUsers[0]?.profilePic;
      const img2 = room.user_ids.find(user => user._id === userID)?.profilePic;
      navigation.navigate('MessageScreen', {room: room._id, img1, img2});
    } catch (error) {
      console.log('Tạo room thất bại:', error);
    }
  };

  const handleFollowPress = async (item: UserProfile) => {
    try {
      await dispatch(
        relationAction({
          targetId: item._id,
          action: 'follow',
          senderId: user?._id,
          handleName: user?.handleName,
        }),
      ).unwrap();
    } catch (error) {
      GlobalAlertManager.show('Thất bại', 'Vui lòng thử lại sau');
    }
  };

  const handleMorePress = (item: UserProfile) => {
    popupRef.current?.setUser(item._id);
    popupRef.current?.open();
  };

  const onUnfollow = (targetId: string) => {
    dispatch(
      relationAction({
        targetId,
        action: 'unfollow',
        senderId: user?._id!,
        handleName: user?.handleName!,
      }),
    )
      .unwrap()
      .catch(() => {
        GlobalAlertManager.show('Lỗi', 'Không thể bỏ theo dõi');
      });
  };

  const onReport = (targetId: string) => {
    GlobalAlertManager.show('Thông báo', 'Đã báo cáo người dùng');
  };

  const renderUserItem = (item: UserProfile, isFollowing: boolean) => (
    <View style={[styles.suggestedItem, {backgroundColor: color.background}]}>
      <TouchableOpacity style={styles.touchableInfo}>
        <Image source={{uri: item.profilePic}} style={styles.profilePic} />
        <View style={styles.suggestedInfo}>
          <Text style={[styles.handle, {color: color.text}]}>
            {item.handleName}
          </Text>
          <Text style={[styles.username, {color: color.textSecondary}]}>
            {item.username}
          </Text>
        </View>
      </TouchableOpacity>
      {isFollowing ? (
        <>
          <TouchableOpacity
            onPress={() => handleMessagingPress(item)}
            style={[styles.messageButton, {borderColor: color.text}]}>
            <Text style={[styles.messageText, {color: color.text}]}>
              Nhắn tin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMorePress(item)}>
            <MoreVertical size={22} color={color.text} />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => handleFollowPress(item)}
          style={styles.followButton}>
          <Text style={styles.followText}>Theo dõi</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LoadingModal />
      </View>
    );
  if (error)
    return (
      <Text style={{textAlign: 'center', color: color.text, marginTop: 20}}>
        {error}
      </Text>
    );

  return (
    <ScrollView style={[styles.container, {backgroundColor: color.background}]}>
      {reduxFollowing.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Users size={200} color={color.text} />
          <Text style={[styles.emptyTitle, {color: color.text}]}>
            Bạn chưa theo dõi ai
          </Text>
          <Text style={[styles.emptyText, {color: color.textSecondary}]}>
            Khám phá người dùng để kết nối và bắt đầu theo dõi
          </Text>
        </View>
      ) : (
        <FlashList
          data={reduxFollowing}
          keyExtractor={item => item._id}
          renderItem={({item}) => renderUserItem(item, true)}
          estimatedItemSize={60}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FlashList
        data={recommendations}
        keyExtractor={item => item._id}
        renderItem={({item}) => renderUserItem(item, false)}
        ListHeaderComponent={
          <Text style={[styles.sectionHeader, {color: color.text}]}>
            Gợi ý cho bạn
          </Text>
        }
        estimatedItemSize={60}
        showsVerticalScrollIndicator={false}
      />

      <MoreActionPopup
        ref={popupRef}
        onUnfollow={onUnfollow}
        onReport={onReport}
      />
    </ScrollView>
  );
};

export default FollowingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
  },
  suggestedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  touchableInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  suggestedInfo: {
    flex: 1,
  },
  handle: {
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 13,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginLeft: 10,
  },
  followText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  messageButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 10,
  },
  messageText: {
    fontSize: 14,
  },
  moreIcon: {
    width: 18,
    height: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
