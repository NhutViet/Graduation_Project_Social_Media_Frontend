import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Pressable } from 'react-native'
import React, {useState} from 'react'
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';

// data mẫu
const followersData = [
  { id: '1', username: 'abc', handle: 'test_user1', profile_pic: 'https://i.pinimg.com/736x/8c/71/92/8c7192c084765c076ef33024c0b34406.jpg', isFollowing: false },
  { id: '2', username: 'xyz', handle: 'test_user2', profile_pic: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg', isFollowing: true },
  { id: '3', username: 'xcxc', handle: 'test_user3', profile_pic: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg', isFollowing: false },
  { id: '4', username: 'int', handle: 'test_user4', profile_pic: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg', isFollowing: true },
  { id: '5', username: 'int', handle: 'test_user4', profile_pic: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg', isFollowing: false },
  { id: '6', username: 'int', handle: 'test_user4', profile_pic: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg', isFollowing: false },
  { id: '7', username: 'int', handle: 'test_user4', profile_pic: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg', isFollowing: true },
  { id: '8', username: 'int', handle: 'test_user4', profile_pic: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg', isFollowing: true },
  { id: '9', username: 'int', handle: 'test_user4', profile_pic: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg', isFollowing: false },
  { id: '10', username: 'int', handle: 'test_user4', profile_pic: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg', isFollowing: true },
];

type UserItem = {
    id: string;
    username: string;
    profile_pic: string;
    handle: string;
    isFollowing: boolean;
  };

const FollowersTab = () => {
    const navigation: any = useNavigation();
    const {theme} = useTheme();
    const color = Colors[theme];
    const [followers, setFollowers] = useState(followersData)

    const renderItem = ({item}: {item: UserItem}) => (
      <View style={styles.userContainer}>
        <TouchableOpacity style={styles.touchableInfo}>
          <Image
          source={{uri: item.profile_pic}}
          style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.handle, {color: color.text}]}>{item.handle}</Text>
            <Text style={[styles.username, {color: color.textSecondary}]}>{item.username}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, item.isFollowing ? [styles.messageButton, {borderColor: color.text}] : styles.followBack]} onPress={() => handleFollowButton(item)}>
          <Text style={[styles.buttonText, item.isFollowing ? [styles.messageText, {color: color.text}] : styles.followText]}>{item.isFollowing ? "Messaging" : "Follow"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}>
              <View style={{width: 10, height: 10, overflow: 'hidden'}}>
                <Image source={require('../../../assets/icon/x.png')} style={[styles.cancelImage, {tintColor: color.text}]}/>
              </View>
          </TouchableOpacity>
      </View>
  );

  const handleFollowButton = (item: UserItem) => {
      if(item.isFollowing){
        navigation.navigate('FollowingTab');
      } else {
        setFollowers((prevFollowers) => 
          prevFollowers.map((followers) => 
            followers.id === item.id ? {...followers, isFollowing: true} : followers
          )
        );
      }
  };
  return (
    <View style={{flex: 1, backgroundColor: color.background}}>
        <View style={[styles.searchBarArea, {backgroundColor: color.background, shadowColor: color.text}]}>
            <View style={[styles.searchBarContainer, {backgroundColor: color.background, borderColor: color.text}]}>
              <Image source={require('../../../assets/icon/icon_search.png')} style={[styles.searchIcon, {tintColor: color.text}]}/>
              <TextInput
                  style={[styles.searchBar, {borderColor: color.border}]}
                  placeholder="Tìm kiếm"
                  placeholderTextColor={color.text}
              />
            </View>
        </View>
        <FlashList
          data={followers}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          estimatedItemSize={50}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
    </View>
  )
}

export default FollowersTab

const styles = StyleSheet.create({
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    touchableInfo: {
      flex: 1,
      flexDirection: 'row'
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
        justifyContent: 'center'
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
  },
  listContent: {
    paddingTop: 70,
  },
})