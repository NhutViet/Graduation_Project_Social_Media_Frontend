import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import MessageBoxStyles from '../../StyleSheet/MessageBoxStyles';
import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {fetchMyRooms} from '../../../services/roomRedux/roomSlice';
import ItemNewMessage from '../NewMessage/component/itemNewMessage';
import Story from '../../(tabs)/Home/components/Story';
import {handleUserPress} from '../../(tabs)/Home/util';

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
  const followingUsers = useSelector(
    (state: RootState) => state.stories.followingUsers,
  );
  const user = useSelector((state: RootState) => state.user?.user);

  useEffect(() => {
    dispatch(fetchMyRooms());
  }, []);

  // State management
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<TextInput>(null);

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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 10}}>
          {followingUsers
            .filter(item => item !== undefined && item !== null)
            .map(item => (
              <Story
                key={item._id}
                name={
                  item.handleName === user?.handleName
                    ? 'Tin của tôi'
                    : item.handleName
                }
                image={item.profilePic}
                status={item.stories.length > 0 ? 1 : 0}
                func={() => handleUserPress(item, dispatch, navigation)}
              />
            ))}
        </ScrollView>
      </View>

      {/* Messages Header */}
      <View style={styles.messagesHeader}>
        <Text style={styles.messagesHeaderTitle}>Tin nhắn</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PendingMessages', {
              handleName: user?.handleName,
            })
          }>
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
                roomTheme={item?.theme}
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
