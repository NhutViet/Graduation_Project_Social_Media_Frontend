import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import MessageBoxStyles from '../../StyleSheet/MessageBoxStyles';
import User from '../../(tabs)/Home/components/Story';
import React, {useState, useEffect, useRef} from 'react';
import {
  messageData,
  storyUsers,
  StoryUser,
  User as UserType,
} from '../../MockData/message.mock';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {fetchMyRooms} from '../../../services/roomRedux/roomSlice';
import ItemNewMessage from '../NewMessage/component/itemNewMessage';

export const MessageBox = (props: any) => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = MessageBoxStyles(theme);
  const {onBack} = props;

  const dispatch = useDispatch<AppDispatch>();
  const {rooms, loading, error} = useSelector(
    (state: RootState) => state.rooms,
  );
  const user = useSelector((state: RootState) => state.user?.user);

  useEffect(() => {
    dispatch(fetchMyRooms());
  }, []);

  // State management
  const [dataUser, setDataUser] = useState<StoryUser[]>(storyUsers);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<TextInput>(null);

  // Mock data
  const data = messageData;

  const handleUserPress = (user: StoryUser) => {
    console.log('Navigating to SeenStory with user:', user);
    setDataUser(prevData =>
      prevData.map(item => (item.id === user.id ? {...item, status: 0} : item)),
    );
    navigation.navigate('SeenStoryOwner', {selectedItem: user});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerBlock}>
          <TouchableOpacity
            style={styles.iconBlock}
            onPress={() => {
              navigation.goBack();
              onBack && onBack();
            }}>
            <Image
              source={require('../../../assets/icon/left.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{user?.handleName}</Text>
        </View>
        <View style={styles.headerBlock}>
          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/star_mess.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/new_mess.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBlock}>
          <View style={styles.iconBlock}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/search.png')}
            />
          </View>
          <TextInput
            ref={searchInputRef}
            placeholder="Tìm kiếm tin nhắn"
            placeholderTextColor={color.text}
            style={[
              styles.searchInput,
              {paddingRight: searchQuery.length > 0 ? 40 : 0},
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton}>
              <Image
                style={styles.clearIcon}
                source={require('../../../assets/icon/close_small.png')}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Stories Section */}
      <View style={styles.storiesContainer}>
        <FlashList
          data={dataUser}
          renderItem={({item}: any) => {
            return (
              <User
                name={item.name}
                image={item.image}
                status={item.status}
                func={() => handleUserPress(item)}
              />
            );
          }}
          horizontal
          estimatedItemSize={100}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContentContainer}
        />
      </View>

      {/* Messages Header */}
      <View style={styles.messagesHeader}>
        <Text style={styles.messagesHeaderTitle}>Tin nhắn</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('PendingMessages')}>
          <Text style={styles.messagesHeaderSubtitle}>Tin nhắn chờ xử lý</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <View style={styles.messagesListContainer}>
        <FlashList
          data={rooms}
          renderItem={({item}) => {
            const filteredUsers = item.user_ids.filter(
              user => user._id !== item.created_by,
            );

            const user1 = filteredUsers[0];
            const user2 = filteredUsers[1];

            return (
              <ItemNewMessage
                roomId={item._id}
                nameChat={item.name}
                userHandle1={user1?.handleName || ''}
                userHandle2={user2?.handleName || ''}
                img1={user1?.profilePic || ''}
                img2={user2?.profilePic || ''}
              />
            );
          }}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};
