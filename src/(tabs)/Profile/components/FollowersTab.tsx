import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  fetchFollowers,
  fetchFollowing,
  relationAction,
} from '../../../../services/relationRedux/relationSlice';
import {createRoom} from '../../../../services/roomRedux/roomSlice';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';
import {UserProfile} from '@services/relationRedux/relationTypes';
import {selectDisplayFollowers} from '@services/relationRedux/relationSelector';
import {Search, User, UserX, X} from 'lucide-react-native';
import LoadingModal from '../../../../components/Global/LoadingModal';

const FollowersTab = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const dispatch = useDispatch<AppDispatch>();
  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const userID = useSelector((state: RootState) => state.user?.user?._id);
  const user = useSelector((state: RootState) => state.user.user);
  const {followers, following, loading, error} = useSelector(
    (state: RootState) => state.relation,
  );

  useEffect(() => {
    if (userID) {
      dispatch(fetchFollowers({userId: userID}));
      dispatch(fetchFollowing({userId: userID}));
    }
  }, [userID]);

  const followingIds = useMemo(
    () => new Set(following.map(u => u._id)),
    [following],
  );

  const followersList = useSelector(selectDisplayFollowers);

  const displayList = followersList.filter(u =>
    u.handleName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleActionButton = useCallback(
    async (item: UserProfile, isMutual: boolean) => {
      try {
        await dispatch(
          relationAction({
            targetId: item._id,
            action: isMutual ? 'unfollow' : 'follow',
            senderId: user?._id,
            handleName: user?.handleName,
          }),
        ).unwrap();
      } catch (error) {
        GlobalAlertManager.show('Thất bại', 'Vui lòng thử lại sau');
      }
    },
    [dispatch, user],
  );

  const renderItem: ListRenderItem<UserProfile> = ({item}) => {
    const isMutual = followingIds.has(item._id);
    return (
      <View style={styles.userContainer}>
        <TouchableOpacity style={styles.touchableInfo}>
          {item.profilePic ? (
            <Image source={{uri: item.profilePic}} style={styles.avatar} />
          ) : (
            <User size={styles.avatar.width || 40} color={color.text} />
          )}
          <View style={styles.userInfo}>
            <Text style={[styles.username, {color: color.text}]}>
              {item.username}
            </Text>
            <Text style={[styles.handle, {color: color.textSecondary}]}>
              {item.handleName}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            isMutual
              ? [styles.messageButton, {borderColor: color.text}]
              : styles.followBack,
          ]}
          onPress={() => handleActionButton(item, isMutual)}>
          <Text
            style={[
              styles.buttonText,
              isMutual
                ? [styles.messageText, {color: color.text}]
                : styles.followText,
            ]}>
            {isMutual ? 'Bạn bè' : 'Theo dõi'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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

  if (!followersList.length) {
    return (
      <View
        style={[styles.emptyContainer, {backgroundColor: color.background}]}>
        <UserX size={styles.emptyImage?.width || 60} color={color.text} />
        <Text style={[styles.emptyTitle, {color: color.text}]}>
          Bạn chưa có người theo dõi
        </Text>
        <Text style={[styles.emptySubtitle, {color: color.textSecondary}]}>
          Khi có người theo dõi bạn, họ sẽ xuất hiện ở đây
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

      {displayList.length === 0 && searchQuery.length ? (
        <View
          style={[styles.emptyContainer, {backgroundColor: color.background}]}>
          <UserX size={40} color={color.text} />
          <Text style={[styles.emptyTitle, {color: color.text}]}>
            Không tìm thấy người dùng
          </Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <FlashList
            data={displayList}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            estimatedItemSize={50}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            extraData={followingIds}
          />
        </View>
      )}
    </View>
  );
};

export default FollowersTab;

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
    alignItems: 'center',
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
    color: '#666',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 14,
  },
  followText: {
    color: '#fff',
  },
  messageText: {
    color: '#000',
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 10,
    height: 10,
  },
  cancelImage: {
    width: 10,
    height: 10,
  },
  searchBar: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 20,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 10,
  },
  searchBarContainer: {
    marginVertical: 3,
    alignItems: 'center',
    flexDirection: 'row',
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
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  clearButton: {
    position: 'absolute',
    right: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
