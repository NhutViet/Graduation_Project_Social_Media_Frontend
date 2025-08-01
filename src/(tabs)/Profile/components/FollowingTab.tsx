import React, {useEffect, useMemo, useRef} from 'react';
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
import {MoreVertical, Users, UserPlus} from 'lucide-react-native';
import LoadingModal from '../../../../components/Global/LoadingModal';
import ReportUserModal, {ReportUserModalHandle} from '../../../../src/Screens/Profile/components/reportUserModal';
import { Portal } from 'react-native-portalize';

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
  const reportRef = useRef<ReportUserModalHandle>(null);

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

  const handleFollowPress = async (item: UserProfile, isRecommendation = false) => {
    try {
      await dispatch(
        relationAction({
          targetId: item._id,
          action: 'follow',
          senderId: user?._id,
          handleName: user?.handleName,
        }),
      ).unwrap();
      if (isRecommendation) {
        dispatch(fetchFollowing({ userId: userID! }));
        dispatch(fetchRecommendations({ limit: 10 }));
      }
    } catch (error) {
      GlobalAlertManager.show('Thất bại', 'Vui lòng thử lại sau');
    }
  };

  const handleMorePress = (item: UserProfile) => {
    popupRef.current?.setUser(item._id);
    popupRef.current?.open();
  };

  const openReportModal = (userId: string) => {
    popupRef.current?.close();
    setTimeout(() => {
      reportRef.current?.open(userId);
    }, 250);
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

  const renderUserItem = (item: UserProfile, isFollowing: boolean, isRecommendation: boolean = false) => (
    <View style={[styles.suggestedItem, {backgroundColor: color.background}]}>
      <TouchableOpacity style={styles.touchableInfo}>
        <Image source={{uri: item.profilePic}} style={styles.profilePic} />
        <View style={styles.suggestedInfo}>
          <Text style={[styles.username, {color: color.text}]}>
            {item.username}
          </Text>
          <Text style={[styles.handle, {color: color.textSecondary}]}>
            {item.handleName}
          </Text>
        </View>
      </TouchableOpacity>
      {isFollowing ? (
        <>
          <TouchableOpacity
            onPress={() => onUnfollow(item._id)}
            style={[styles.messageButton, {borderColor: color.text}]}>
            <Text style={[styles.messageText, {color: color.text}]}>
              Hủy theo dõi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMorePress(item)}>
            <MoreVertical size={22} color={color.text} />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => handleFollowPress(item, isRecommendation)}
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
      {recommendations.length === 0 ? (
        <View>
          <Text style={[styles.sectionHeader, {color: color.text}]}>
            Gợi ý cho bạn
          </Text>
          <View
            style={{
              backgroundColor: color.background,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}>
            <UserPlus size={80} color={color.text} style={{marginBottom: 24}} />
            <Text
              style={{
                color: color.text,
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 8,
              }}>
              Không có đề xuất. Theo dõi thêm nhiều người khác để có đề xuất.
            </Text>
          </View>
        </View>
      ) : (
        <FlashList
          data={recommendations}
          keyExtractor={item => item._id}
          renderItem={({item}) => renderUserItem(item, false, true)}
          ListHeaderComponent={
            <Text style={[styles.sectionHeader, {color: color.text}]}>
              Gợi ý cho bạn
            </Text>
          }
          estimatedItemSize={60}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Portal>
        <MoreActionPopup
          ref={popupRef}
          onReport={openReportModal}
        />
      </Portal>
      <Portal>
        <ReportUserModal
          ref={reportRef}
          onReported={async (id: string) => {
            try{
              await dispatch(
                relationAction({
                  targetId: id,
                  action: 'unfollow',
                  senderId: user?._id!,
                  handleName: user?.handleName!,
                })
              ).unwrap();
              dispatch(fetchFollowing({ userId: userID! }));
              dispatch(fetchRecommendations({ limit: 10}));
            } catch (error){
              console.log('Cannot unfollow after reporting: ', error);
            }
          }}  
        />
      </Portal>
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
    color: '#666',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
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
