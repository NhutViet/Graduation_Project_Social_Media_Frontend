import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { AppDispatch, RootState } from '../../../../services/store';
import { fetchFollowers, fetchFollowing, relationAction } from '../../../../services/relationRedux/relationSlice';
import {createRoom} from '../../../../services/roomRedux/roomSlice';

const UserFollowersTab = ({route}: any) => {
  const navigation: any = useNavigation();
    const {theme} = useTheme();
    const color = Colors[theme];
    const userID: string = route.params?.userID;
    const myUserId = useSelector((state: RootState) => state.user.user?._id);
    const dispatch = useDispatch<AppDispatch>();
    const {followers: reduxFollowers, following: reduxFollowing} = useSelector(
      (state: RootState) => state.relation,
    );
  
    const [followers, setFollowers] = useState(reduxFollowers);
    const [following, setFollowing] = useState(reduxFollowing);
  
    useEffect(() => {
      const fetchAndCombineData = async () => {
        if (userID === undefined || !myUserId) {
            console.error('User ID hoặc My User ID không hợp lệ');
            return;
        }
        try {
        const followersData = await dispatch(fetchFollowers({ userId: userID })).unwrap();
        const followingList = await dispatch(fetchFollowing({ userId: myUserId })).unwrap();

        console.log("data follower fetch: ", followersData)
        // update the isFollowing state for each follower that have _id match a user in current user following list
        const updatedFollowers = followersData.map(follower => ({
            ...follower,
            isMeFollowing: followingList.some(f => f._id === follower._id),
        }));

        console.log("UserID", userID);
        // Cập nhật danh sách followers với trạng thái mới
        setFollowers(updatedFollowers);
        } catch (err) {
            console.error("Error fetching followers:", err);
        }
    };

    if (userID) {
        fetchAndCombineData();
    }
    }, [dispatch, userID, myUserId])
  
    const renderItem = ({item}: {item: typeof followers[0]}) => (
      <View style={styles.userContainer}>
        <TouchableOpacity style={styles.touchableInfo}>
          <Image source={{uri: item.profilePic}} style={styles.avatar} />
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
            {item.isMeFollowing ? 'Nhắn tin' : 'Theo dõi'}
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
        <TouchableOpacity onPress={() => {console.log(userID);}}>
            <Text>asd</Text>
        </TouchableOpacity>
      </View>
    );
  
    const handleActionButton = async (item: typeof followers[0]) => {
      if (item.isMeFollowing) {
        console.log(item.isMeFollowing);
        try {
          const res = await dispatch(
            createRoom({
              name: '',
              user_ids: [item._id],
              type: 'waiting',
            }),
          ).unwrap();
        
          const {room} = res;
        
          const otherUsers = room.user_ids.filter(user => user._id !== myUserId);
          const img1 = otherUsers[0]?.profilePic;
          const img2 = myUserId
            ? room.user_ids.find(user => user._id === myUserId)?.profilePic
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
        try{
          await dispatch(
            relationAction({
              targetId: item._id,
              action: "follow"
            })
          ).unwrap();
  
          setFollowers((prevFollowers) =>
          prevFollowers.map((follower) =>
            follower._id === item._id
              ? { ...follower, isFollowing: true }
              : follower
          )
        );
        } catch (error){
          Alert.alert(
              "Theo dõi thất bại",
              'Vui lòng thử lại sau.',
            );
          console.log(error);
        }
      }
    };
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
}

export default UserFollowersTab

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
})