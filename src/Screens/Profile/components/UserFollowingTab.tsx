import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import React, {useState, useEffect} from 'react';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { AppDispatch, RootState } from '../../../../services/store';
import { fetchFollowing, relationAction, fetchRecommendations } from '../../../../services/relationRedux/relationSlice';
import {createRoom} from '../../../../services/roomRedux/roomSlice';
import { EllipsisVertical, UserRoundPlus, Funnel } from 'lucide-react-native';

const UserFollowingTab = ({route}: any) => {
    const userID: string = route.params?.userID;
    const navigation: any = useNavigation();
    const {theme} = useTheme();
    const color = Colors[theme];
    const myUserId = useSelector((state: RootState) => state.user?.user?._id);
    const dispatch = useDispatch<AppDispatch>();
    const {following: reduxFollowing, recommendations: reduxRecommendatinos, loading, error} = useSelector(
        (state: RootState) => state.relation,
    );
    
    const [following, setFollowing] = useState(reduxFollowing);
    const [recommendations, setRecommendations] = useState(reduxRecommendatinos);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<string | null>(null);

    useEffect(() => {
      if (!userID || !myUserId) return;

      setIsLoading(true);
      setIsError(null);

      const fetchAndCombine = async () => {
        try {
          
          const viewingFollowing: typeof reduxFollowing =
            await dispatch(fetchFollowing({ userId: userID })).unwrap();

          const filtered = viewingFollowing.filter(f => f._id !== myUserId);

          const myFollowing: typeof reduxFollowing =
            await dispatch(fetchFollowing({ userId: myUserId })).unwrap();

          const updatedFollowing = filtered.map(u => ({
            ...u,
            isMeFollowing: myFollowing.some(m => m._id === u._id),
          }));

          setFollowing(updatedFollowing);

          const recData = await dispatch(fetchRecommendations({ limit: 10 })).unwrap();
          setRecommendations(recData);
        } catch (err: any) {
          console.error('Error loading UserFollowingTab:', err);
          setIsError(err.message || 'Tải dữ liệu thất bại');
        } finally {
          setIsLoading(false);
        }
      };

      fetchAndCombine();
    }, [dispatch, userID]);

    const handleActionButton = async (item: typeof following[0]) => {
      if (item.isMeFollowing) {
        try {
          const res = await dispatch(
            createRoom({
              name: '',
              user_ids: [item._id],
              type: 'waiting',
            })
          ).unwrap();

          const { room } = res;
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
            })
          ).unwrap();

          setFollowing(prev =>
            prev.map(f =>
              f._id === item._id
                ? { ...f, isMeFollowing: true }
                : f
            )
          );
        } catch (error) {
          Alert.alert('Theo dõi thất bại', 'Vui lòng thử lại sau.');
          console.log(error);
        }
      }
    };
    
      const handleFollowPress = async (item: typeof recommendations[0]) => {
        try{
          await dispatch(
            relationAction({
              targetId: item._id,
              action: "follow"
            })
          ).unwrap();
    
          setRecommendations(curr => curr.filter(u => u._id !== item._id));
        } catch (error){
          Alert.alert(
              "Theo dõi thất bại",
              'Vui lòng thử lại sau.',
            );
          console.log(error);
        }
    }

    const renderSortItem = ({item}: {item: typeof following[0]}) => (
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
          <TouchableOpacity>
            <EllipsisVertical size={13} color={color.text}/>
          </TouchableOpacity>
        </View>
    );
    
      const renderRecommendItem = ({item}: {item: typeof recommendations[0]}) => (
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
          <TouchableOpacity onPress={() => handleFollowPress(item)} style={styles.followButton}>
            <Text style={styles.followText}>Theo dõi</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <EllipsisVertical size={13} color={color.text}/>
          </TouchableOpacity>
        </View>
    );

    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={color.text} />
        </View>
      );
    }
    if (isError) {
    return (
          <View style={{ padding: 20 }}>
            <Text style={{ color: color.text, textAlign: 'center' }}>{error}</Text>
          </View>
        );
    }

    return (
        <ScrollView style={[styles.container, {backgroundColor: color.background}]}>
              {!isLoading && following.length === 0 ? 
                <View style={{ backgroundColor: color.background, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, }}>
                  <UserRoundPlus size={60} style={{marginBottom: 24}}/>
                  <Text style={{ color: color.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8, }}>
                    Người dùng chưa theo dõi ai
                  </Text>
                </View> :
        
                <FlashList
                  data={following}
                  keyExtractor={item => item._id}
                  renderItem={renderSortItem}
                  showsVerticalScrollIndicator={false}
                  estimatedItemSize={10}
                  ListHeaderComponent={
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <Text style={{color: color.text, fontSize: 18}}>
                        Sắp xếp theo <Text style={{color: color.text, fontSize: 18, fontWeight: 'bold'}}>Mặc định</Text>
                      </Text>
                      <Funnel color={color.text}/>
                    </TouchableOpacity>
                  }
                />
              }
              <FlashList
                data={recommendations}
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
            </ScrollView>
    )
}

export default UserFollowingTab

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
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    width: 89,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
})