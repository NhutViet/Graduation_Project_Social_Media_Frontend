import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import React, {useEffect, useMemo} from 'react';
import {Colors} from '@assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  fetchViewedFollowing,
  fetchFollowing,
  relationAction,
  fetchRecommendations,
} from '../../../../services/relationRedux/relationSlice';
import {createRoom} from '../../../../services/roomRedux/roomSlice';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {UserProfile} from '@services/relationRedux/relationTypes';
import {selectDisplayViewedFollowing} from '@services/relationRedux/relationSelector';
import {User, UserPlus} from 'lucide-react-native';
import LoadingModal from '../../../../components/Global/LoadingModal';

type Props = {
  userID: string;
};

type DisplayProfile = UserProfile & {isMeFollowing: boolean};

const UserFollowingTab = ({userID}: Props) => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const user = useSelector((state: RootState) => state.user?.user);
  const myUserId = useSelector((state: RootState) => state.user?.user?._id);
  const dispatch = useDispatch<AppDispatch>();
  const {recommendations, loading, error} = useSelector(
    (state: RootState) => state.relation,
  );

  useEffect(() => {
    if (!userID || !myUserId) return;
    dispatch(fetchViewedFollowing({userId: userID}));
    dispatch(fetchFollowing({userId: myUserId}));
    dispatch(fetchRecommendations({limit: 10}));
  }, [dispatch, userID, myUserId]);

  const displayList = useSelector(selectDisplayViewedFollowing);

  const filteredRecommendations = useMemo(() => {
    const viewedIds = new Set(displayList.map(u => u._id));
    return recommendations.filter(u => !viewedIds.has(u._id));
  }, [recommendations, displayList]);

  const handleActionButton = async (
    item: UserProfile & {isMeFollowing?: boolean},
    isRecommendation: boolean = false,
  ) => {
    const mutual = item.isMeFollowing ?? false;
    if (mutual) {
      try {
        const res = await dispatch(
          createRoom({
            name: '',
            user_ids: [item._id],
            type: 'waiting',
          }),
        ).unwrap();

        const {room} = res;
        const otherUsers = room.user_ids.filter(u => u._id !== userID);
        const img1 = otherUsers[0]?.profilePic;
        const img2 = room.user_ids.find(u => u._id === userID)?.profilePic;

        navigation.navigate('MessageScreen', {
          room: room._id,
          img1,
          img2,
        });
      } catch (error) {
        console.log('Tạo room thất bại:', error);
      }
    } else {
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
          dispatch(fetchRecommendations({limit: 10}));
          await dispatch(fetchViewedFollowing({userId: userID}));
        }
      } catch (error) {
        GlobalAlertManager.show('Thất bại', 'Vui lòng thử lại sau');
        console.log(error);
      }
    }
  };

  const renderSortItem: ListRenderItem<DisplayProfile> = ({item}) => {
    const isMe = item._id === myUserId;
    return (
      <View style={[styles.suggestedItem, {backgroundColor: color.background}]}>
        <TouchableOpacity style={styles.touchableInfo}>
          {item.profilePic ? (
            <Image source={{uri: item.profilePic}} style={styles.profilePic} />
          ) : (
            <User size={40} color={color.text} style={{marginRight: 10}} />
          )}
          <View style={styles.suggestedInfo}>
            <Text style={[styles.handle, {color: color.text}]}>
              {item.handleName}
            </Text>
            <Text style={[styles.username, {color: color.textSecondary}]}>
              {item.username}
            </Text>
          </View>
        </TouchableOpacity>
        {!isMe && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              item.isMeFollowing
                ? [styles.messageButton, {borderColor: color.text}]
                : styles.followButton,
            ]}
            onPress={() => handleActionButton(item)}>
            <Text
              style={[
                styles.buttonText,
                item.isMeFollowing
                  ? [styles.messageText, {color: color.text}]
                  : styles.followText,
              ]}>
              {item.isMeFollowing ? 'Nhắn tin' : 'Theo dõi'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderRecommendItem: ListRenderItem<UserProfile> = ({item}) => (
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
      <TouchableOpacity
        onPress={() => handleActionButton(item, true)}
        style={styles.followButton}>
        <Text style={styles.followText}>Theo dõi</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <LoadingModal />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{padding: 20}}>
        <Text style={{color: color.text, textAlign: 'center'}}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, {backgroundColor: color.background}]}>
      {!loading && displayList.length === 0 ? (
        <View>
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
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 8,
              }}>
              Người dùng chưa theo dõi ai
            </Text>
          </View>
        </View>
      ) : (
        <FlashList
          data={displayList}
          keyExtractor={item => item._id}
          renderItem={renderSortItem}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={60}
        />
      )}
      {!loading && filteredRecommendations.length === 0 ? (
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
          data={filteredRecommendations}
          keyExtractor={item => item._id}
          renderItem={renderRecommendItem}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={10}
          ListHeaderComponent={
            <Text style={[styles.sectionHeader, {color: color.text}]}>
              Gợi ý cho bạn
            </Text>
          }
        />
      )}
    </ScrollView>
  );
};

export default UserFollowingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryDescription: {
    color: '#666',
  },
  sortSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortIcon: {
    width: 16,
    height: 16,
  },
  suggestedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  touchableInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  suggestedInfo: {
    flex: 1,
  },
  handle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    color: '#666',
  },
  followButton: {
    width: 89,
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    width: 89,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followText: {
    color: '#fff',
  },
  messageText: {
    color: '#000',
  },
  moreIcon: {
    width: 16,
    height: 16,
  },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  actionButton: {
    width: 90,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBack: {
    paddingHorizontal: 15,
    backgroundColor: '#007BFF',
  },
  buttonText: {
    fontSize: 14,
  },
});
