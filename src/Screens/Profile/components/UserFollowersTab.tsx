import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useRef, useState, useCallback, useEffect, useMemo} from 'react';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  fetchViewedFollowers,
  fetchFollowing,
  relationAction,
} from '../../../../services/relationRedux/relationSlice';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {UserProfile} from '@services/relationRedux/relationTypes';
import {selectDisplayViewedFollowers} from '@services/relationRedux/relationSelector';
import {Search, User, UserX, X} from 'lucide-react-native';
import LoadingModal from '../../../../components/Global/LoadingModal';

type DisplayProfile = UserProfile & {isMeFollowing: boolean};

const UserFollowersTab = ({route}: any) => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const userID: string = route.params?.userID;
  const user = useSelector((state: RootState) => state.user.user);
  const myUserId = useSelector((state: RootState) => state.user.user?._id);
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error} = useSelector((state: RootState) => state.relation);
  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userID || !myUserId) return;
    dispatch(fetchViewedFollowers({userId: userID}));
    dispatch(fetchFollowing({userId: myUserId}));
  }, [dispatch, userID, myUserId]);

  const followersList = useSelector(selectDisplayViewedFollowers);
  const displayList = useMemo(
    () =>
      followersList.filter(u =>
        u.handleName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [followersList, searchQuery],
  );

  const handleActionButton = useCallback(
    async (item: DisplayProfile) => {
      const actionType = item.isMeFollowing ? 'unfollow' : 'follow';

      try {
        await dispatch(
          relationAction({
            targetId: item._id,
            action: actionType,
            senderId: user?._id,
            handleName: user?.username,
          }),
        ).unwrap();

        await Promise.all([
          dispatch(fetchViewedFollowers({ userId: userID })),
          dispatch(fetchFollowing({ userId: myUserId! })),
        ]);
      } catch (err) {
        GlobalAlertManager.show(
          'Thất bại',
          actionType === 'follow'
            ? 'Không thể theo dõi, vui lòng thử lại'
            : 'Không thể bỏ theo dõi, vui lòng thử lại',
        );
      }
    },
    [dispatch, navigation, myUserId, user],
  );

  const renderItem: ListRenderItem<DisplayProfile> = useCallback(
    ({item}) => {
      const isMe = item._id === myUserId;
      return (
        <View style={styles.userContainer}>
          <View style={styles.touchableInfo}>
            {item.profilePic ? (
              <Image source={{uri: item.profilePic}} style={styles.avatar} />
            ) : (
              <User size={40} color={color.text} />
            )}
            <View style={styles.userInfo}>
              <Text style={[styles.handle, {color: color.text}]}>
                {item.username}
              </Text>
              <Text style={[styles.username, {color: color.textSecondary}]}>
                {item.handleName}
              </Text>
            </View>
          </View>
          {!isMe && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                item.isMeFollowing
                  ? [styles.messageButton, {borderColor: color.text}]
                  : styles.followBack,
              ]}
              onPress={() => handleActionButton(item)}>
              <Text
                style={[
                  styles.buttonText,
                  item.isMeFollowing
                    ? [styles.messageText, {color: color.text}]
                    : styles.followText,
                ]}>
                {item.isMeFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [color, handleActionButton, myUserId],
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
      <View style={styles.center}>
        <Text style={[styles.errorText, {color: color.text}]}>{error}</Text>
      </View>
    );
  }

  if (!followersList || followersList.length === 0) {
    return (
      <View
        style={[styles.emptyContainer, {backgroundColor: color.background}]}>
        <UserX size={60} color={color.text} />
        <Text style={[styles.emptyTitle, {color: color.text}]}>
          Người dùng hiện tại chưa có người theo dõi
        </Text>
        <Text style={[styles.emptySubtitle, {color: color.textSecondary}]}>
          Khi có người theo dõi, họ sẽ xuất hiện ở đây
        </Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: color.background}}>
      {followersList.length > 0 && (
        <View
          style={[
            styles.searchBarArea,
            {
              backgroundColor: color.background,
              borderBottomColor: color.border,
            },
          ]}>
          <View style={styles.searchBarContainer}>
            <TextInput
              ref={searchInputRef}
              style={[
                styles.searchBar,
                {color: color.text, backgroundColor: color.lessBlack},
              ]}
              placeholder="Tìm kiếm"
              placeholderTextColor={color.text}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Search size={22} color={color.text} />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}>
                <X size={20} color={color.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {displayList.length === 0 && searchQuery.length > 0 ? (
        <View
          style={[styles.emptyContainer, {backgroundColor: color.background}]}>
          <UserX size={60} color={color.text} />
          <Text style={[styles.emptyTitle, {color: color.text}]}>
            Không tìm thấy tên người dùng
          </Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <FlashList
            data={displayList}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            estimatedItemSize={60}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </View>
  );
};

export default UserFollowersTab;

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  touchableInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  handle: {
    fontWeight: 'bold',
  },
  username: {
    color: '#666',
  },
  actionButton: {
    width: 90,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBack: {
    backgroundColor: '#007BFF',
  },
  messageButton: {
    width: 110,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
  },
  followText: {
    color: '#fff',
  },
  messageText: {
    // color được override inline
  },
  searchBarArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    marginBottom: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  clearButton: {
    position: 'absolute',
    right: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 70,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
