import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {FlashList} from '@shopify/flash-list';
import Header from '../../../components/Header';
import {useNavigation} from '@react-navigation/native';
import User from '../../../components/User';
import {useEffect, useRef, useState} from 'react';
import ItemHome from '../../../components/ItemHome';
import {Modalize} from 'react-native-modalize';

const Home = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];

  // scroll bài post
  const [currentVisible, setCurrentVisible] = useState('1');
  const viewAbilityConfig = {
    itemVisiblePercentThreshold: 70,
  };

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentVisible(viewableItems[0].item.id);
    }
  }).current;

  const modalizeRef = useRef<Modalize>(null);
  const [currentPost, setCurrentPost] = useState<any>(null);

  // data mẫu
  const posts = [
    {
      id: '1',
      uriVideo:
        'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718746/my_video/ncd28sjnze0wfaqti2hm.mp4',
      imgUser:
        'https://i.pinimg.com/736x/8c/71/92/8c7192c084765c076ef33024c0b34406.jpg',
      name: 'User 1',
      like: 123,
      comment: 10,
      share: 5,
      title: 'Video đầu tiên',
      date: '05/05/2025',
    },
    {
      id: '2',
      uriVideo:
        'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718987/my_video/aynip2pj7jchjfdddmot.mp4',
      imgUser:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      name: 'User 2',
      like: 456,
      comment: 2290,
      share: 7,
      title: 'Video 2',
      date: '05/05/2025',
    },
    {
      id: '3',
      uriVideo:
        'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746719121/my_video/wfamwgeiy4eeibslfhjc.mp4',
      imgUser:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      name: 'User 2',
      like: 45096,
      comment: 22,
      share: 79,
      title: 'Video 3',
      date: '05/05/2025',
    },
    {
      id: '4',
      img: 'https://i.pinimg.com/736x/d2/03/ca/d203ca1c1ca1efd8b80f612fd550f55c.jpg',
      imgUser:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      name: 'User 2',
      like: 11566,
      comment: 10092,
      share: 27,
      title: 'Image',
      date: '05/05/2025',
    },
  ];

  const [dataUser, setDataUser] = useState([
    {
      id: 1,
      name: 'user1',
      image:
        'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
      status: 1,
    },
    {
      id: 2,
      name: 'user2',
      image:
        'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
      status: 1,
    },
    {
      id: 3,
      name: 'user3',
      image:
        'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
      status: 0,
    },
    {
      id: 4,
      name: 'user4',
      image:
        'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
      status: 0,
    },
  ]);

  useEffect(() => {
    const exists = dataUser.some(user => user.name === 'Tin của tôi');
    if (!exists) {
      const newUser = {
        id: Date.now(),
        name: 'Tin của tôi',
        image:
          'https://i.pinimg.com/736x/07/03/c7/0703c771ceecfd6142ce0ca726c056e7.jpg',
        status: 1,
      };
      setDataUser([newUser, ...dataUser]);
    }
  }, []);

  // data cho model mẫu
  const modalData = [
    {
      id: '1',
      username: 'user1',
      bio: 'abc',
      profile_pic:
        'https://i.pinimg.com/736x/8c/71/92/8c7192c084765c076ef33024c0b34406.jpg',
      is_following: true,
    },
    {
      id: '2',
      username: 'user2',
      bio: 'xyz',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: false,
    },
    {
      id: '3',
      username: 'user3',
      bio: '',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: true,
    },
    {
      id: '4',
      username: 'user3',
      bio: '',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: true,
    },
    {
      id: '5',
      username: 'user3',
      bio: '',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: true,
    },
    {
      id: '6',
      username: 'user3',
      bio: '',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: true,
    },
    {
      id: '7',
      username: 'user3',
      bio: '',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: true,
    },
    {
      id: '8',
      username: 'user3',
      bio: '',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: true,
    },
    {
      id: '9',
      username: 'user3',
      bio: '',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: true,
    },
    {
      id: '10',
      username: 'user3',
      bio: '',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: true,
    },
    {
      id: '11',
      username: 'user3',
      bio: '',
      profile_pic:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      is_following: true,
    },
  ];

  type UserItem = {
    id: string;
    username: string;
    profile_pic: string;
    bio: string;
    is_following: boolean;
  };

  const renderItem = ({item}: {item: UserItem}) => (
    <View style={[styles.userItem, {backgroundColor: color.modal}]}>
      <Image source={{uri: item.profile_pic}} style={styles.avatar} />
      <View style={[styles.userInfo, {backgroundColor: color.modal}]}>
        <Text style={[styles.username, {color: color.text}]}>
          {item.username}
        </Text>
        <Text style={[styles.bio, {color: color.text}]}>{item.bio}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          item.is_following
            ? [styles.disabledButton, {borderColor: color.text}]
            : styles.activeButton,
        ]}
        disabled={item.is_following}>
        <Text
          style={[
            item.is_following
              ? [styles.followButtonText, {color: color.text}]
              : styles.followButtonText,
          ]}>
          {item.is_following ? 'Followed' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const handleUserPress = (user: any) => {
    console.log('Navigating to SeenStory with user:', user);
    // Cập nhật status của user được nhấn thành 0
    setDataUser(prevData =>
      prevData.map(item => (item.id === user.id ? {...item, status: 0} : item)),
    );
    // Điều hướng đến SeenStoryOwner
    navigation.navigate('SeenStoryOwner', {selectedItem: user});
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={false}
        modalHeight={Dimensions.get('window').height * 0.7}
        modalStyle={[styles.modal, {backgroundColor: color.modal}]}
        handleStyle={styles.modalHandle}
        withHandle
        onOverlayPress={() => modalizeRef.current?.close()}
        HeaderComponent={
          <View style={styles.modalHeader}>
            <Text style={[styles.title, {color: color.text}]}>Favorites</Text>
          </View>
        }
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}>
        <FlashList
          data={modalData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          estimatedItemSize={50}
          showsVerticalScrollIndicator={false}
        />
      </Modalize>
      <FlashList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ItemHome
            {...item}
            currentVisible={currentVisible}
            modalizeRef={modalizeRef}
          />
        )}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewAbilityConfig}
        estimatedItemSize={100}
        ListHeaderComponent={
          <View>
            <Header
              icon={require('../../../assets/icon/logo_row.png')}
              iconQR={require('../../../assets/icon/qr.png')}
              iconNotify={require('../../../assets/icon/heart.png')}
              iconMessage={require('../../../assets/icon/message.png')}
              navigation={navigation}
            />
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <FlashList
                data={dataUser}
                renderItem={({item}) => {
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
                contentContainerStyle={{
                  paddingRight: 10,
                }}
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 93,
    height: 93,
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  modalHandle: {
    backgroundColor: '#ccc',
    height: 4,
    width: 50,
    alignSelf: 'center',
    borderRadius: 2,
    marginTop: 30,
  },
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bio: {
    color: '#888',
    fontSize: 14,
  },
  followButton: {
    width: 89,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007BFF',
  },
  disabledButton: {
    borderWidth: 1,
    borderRadius: 10,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Home;
