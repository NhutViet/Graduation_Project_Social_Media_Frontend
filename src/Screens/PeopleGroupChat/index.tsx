import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import ItemList from './Components/ItemList';
import {FlashList} from '@shopify/flash-list';
import {PeopleGroupChatStyles} from '../../StyleSheet/PeopleGroupChatStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ArrowLeft, UserPlus} from 'lucide-react-native'; // 👈 vector icons
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@services/store';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {getRoomUsers} from '@services/roomRedux/roomSlice';
import {ActivityIndicator} from 'react-native-paper';
import {relationAction} from '@services/relationRedux/relationSlice';

export const PeopleGroupChat = () => {
  const {theme} = useTheme();
  const colors = Colors[theme];
  const [isReqired, setIsReqired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<
    {
      username: string;
      handleName: string;
      profilePic: string;
      user_id?: string;
      isFollow: boolean;
      isCreated: boolean;
    }[]
  >([]);
  const [admin, setAdmin] = useState<{
    username: string;
    handleName: string;
    profilePic: string;
    user_id?: string;
    isFollow: boolean;
    isCreated: boolean;
  } | null>(null);
  const mine = useSelector((state: RootState) => state.user.user?._id);
  const route = useRoute();
  const roomId = (route.params as {roomId: string})?.roomId;
  const dispatch = useDispatch<AppDispatch>();

  const styles = PeopleGroupChatStyles(theme);
  const navigation = useNavigation<any>();

  const handleFollowToggle = async (
    userId: string,
    follow: boolean,
    handleName: string,
  ) => {
    const actionType = follow ? 'unfollow' : 'follow';

    const prevUsers = [...user];

    setUser(prev =>
      prev.map(u => (u.user_id === userId ? {...u, isFollow: !follow} : u)),
    );
    if (admin?.user_id === userId) {
      setAdmin({...admin, isFollow: !follow});
    }

    try {
      await dispatch(
        relationAction({
          targetId: userId,
          action: actionType,
          senderId: mine,
          handleName,
        }),
      ).unwrap();
    } catch (error) {
      // Rollback UI nếu thất bại
      setUser(prevUsers);
      if (admin?.user_id === userId) {
        setAdmin({
          username: admin.username ?? '',
          handleName: admin.handleName ?? '',
          profilePic: admin.profilePic ?? '',
          user_id: admin.user_id,
          isFollow: !follow,
          isCreated: admin.isCreated ?? false,
        });
      }

      console.error('[ERROR] handleFollowToggle failed:', error);
      GlobalAlertManager.show(
        'Thất bại',
        `${actionType === 'follow' ? 'Theo dõi' : 'Bỏ theo dõi'} thất bại`,
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchRoomUsers = async () => {
      try {
        const res = await dispatch(getRoomUsers({roomId})).unwrap(); // unwrap để lấy giá trị thật
        if (res && res.users.length > 0) {
          const ad = res.users.find(u => u.isCreated === true) ?? null;
          const following = res.users.filter(u => u.isCreated !== true);
          setAdmin(ad);
          setUser(following);
          setIsLoading(false);
        }
      } catch (error: any) {
        setIsLoading(false);
        GlobalAlertManager.show(
          'Thông báo',
          error?.response?.data?.message ||
            'Lấy danh sách người dùng thất bại.',
          () => {},
        );
      }
    };

    fetchRoomUsers();
  }, [roomId]);

  if (isLoading) {
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mọi người</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddPeopleToGroupChat')}>
          <UserPlus size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {admin && admin.user_id === mine && (
          <View style={styles.rowSpace}>
            <Text style={[styles.title, {fontWeight: '400'}]}>
              Cần phải được phê duyệt để tham gia
            </Text>
            <Switch
              value={isReqired}
              onValueChange={setIsReqired}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={colors.white}
            />
          </View>
        )}

        {admin && <Text style={styles.titleS}>Quản lý</Text>}

        {admin && (
          <View style={{marginHorizontal: 24}}>
            <ItemList
              isFollow={admin.isFollow}
              id={admin.user_id ?? ''}
              uri={admin.profilePic}
              name={admin.username}
              handle={admin.handleName}
              isMine={admin.user_id === mine}
              isAdmin={true}
              onHandleMessage={() => {
                handleFollowToggle(
                  admin.user_id ?? '',
                  admin.isFollow,
                  admin.handleName,
                );
              }}
            />
          </View>
        )}

        <Text style={styles.titleS}>Thành viên</Text>
        <View style={[styles.container, {marginHorizontal: 24}]}>
          <FlashList
            data={user}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <ItemList
                isFollow={item.isFollow}
                id={item.user_id ?? ''}
                uri={item.profilePic}
                name={item.username}
                handle={item.handleName}
                isMine={item.user_id === mine}
                onHandleMessage={() => {
                  handleFollowToggle(
                    item.user_id ?? '',
                    item.isFollow,
                    item.handleName,
                  );
                }}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
