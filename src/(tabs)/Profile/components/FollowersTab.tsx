import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {
  fetchFollowers,
  relationAction,
} from '../../../../services/relationRedux/relationSlice';
import {createRoom} from '../../../../services/roomRedux/roomSlice';
import {GlobalAlertManager} from '../../../../components/Global/AlertModal';

const FollowersTab = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const userID = useSelector((state: RootState) => state.user?.user?._id);
  const dispatch = useDispatch<AppDispatch>();
  const {
    followers: reduxFollowers,
    loading,
    error,
  } = useSelector((state: RootState) => state.relation);

  const [followers, setFollowers] = useState(reduxFollowers);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    if (!userID) return;

    setIsLoading(true);
    setIsError(null);

    if (userID) {
      dispatch(fetchFollowers({userId: userID}))
        .unwrap()
        .then(data => {
          setFollowers(data);
        })
        .catch(err => {
          console.error('Error fetching followers:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, userID]);

  const renderItem = ({item}: {item: (typeof followers)[0]}) => (
    <View style={styles.userContainer}>
      <TouchableOpacity style={styles.touchableInfo}>
        {item.profilePic ? (
          <Image source={{uri: item.profilePic}} style={styles.avatar} />
        ) : (
          <Image
            source={require('../../../../assets/icon/user.png')}
            style={styles.avatar}
          />
        )}
        <View style={styles.userInfo}>
          <Text style={[styles.handle, {color: color.text}]}>
            {item.handleName}
          </Text>
          <Text style={[styles.username, {color: color.textSecondary}]}>
            {item.username}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.actionButton,
          item.isFollowing
            ? [styles.messageButton, {borderColor: color.text}]
            : styles.followBack,
        ]}
        onPress={() => handleActionButton(item)}>
        <Text
          style={[
            styles.buttonText,
            item.isFollowing
              ? [styles.messageText, {color: color.text}]
              : styles.followText,
          ]}>
          {item.isFollowing ? 'Nhắn tin' : 'Theo dõi'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton}>
        <View style={{width: 10, height: 10, overflow: 'hidden'}}>
          <Image
            source={require('../../../../assets/icon/x.png')}
            style={[styles.cancelImage, {tintColor: color.text}]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  const handleActionButton = async (item: (typeof followers)[0]) => {
    if (item.isFollowing) {
      console.log(item.isFollowing);
      try {
        const res = await dispatch(
          createRoom({
            name: '',
            user_ids: [item._id],
            type: 'waiting',
          }),
        ).unwrap();

        const {room} = res;

        const otherUsers = room.user_ids.filter(user => user._id !== userID);
        const img1 = otherUsers[0]?.profilePic;
        const img2 = userID
          ? room.user_ids.find(user => user._id === userID)?.profilePic
          : undefined;

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
          }),
        ).unwrap();

        setFollowers(prevFollowers =>
          prevFollowers.map(follower =>
            follower._id === item._id
              ? {...follower, isFollowing: true}
              : follower,
          ),
        );
      } catch (error) {
        GlobalAlertManager.show('Thất bại', 'Vui lòng thử lại sau');
        console.log(error);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={color.text} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={[styles.errorText, {color: color.text}]}>{error}</Text>
      </View>
    );
  }

  if (!followers || followers.length === 0) {
    return (
      <View
        style={[styles.emptyContainer, {backgroundColor: color.background}]}>
        <Image
          source={require('../../../../assets/icon/block-user.png')}
          style={styles.emptyImage}
          resizeMode="contain"
        />
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
      <View
        style={[
          styles.searchBarArea,
          {backgroundColor: color.background, borderBottomColor: color.border},
        ]}>
        <View
          style={[
            styles.searchBarContainer,
            {backgroundColor: color.background, borderColor: color.text},
          ]}>
          <Image
            source={require('../../../../assets/icon/search.png')}
            style={[styles.searchIcon, {tintColor: color.text}]}
          />
          <TextInput
            style={[styles.searchBar, {borderColor: color.border}]}
            placeholder="Tìm kiếm"
            placeholderTextColor={color.text}
          />
        </View>
      </View>
      {}
      <FlashList
        data={followers}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        estimatedItemSize={50}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
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
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  searchBar: {
    flex: 1,
    fontSize: 14,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginHorizontal: 15,
    borderWidth: 1,
  },
  searchBarArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  listContent: {
    paddingTop: 70,
  },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  errorText: {fontSize: 16},
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
