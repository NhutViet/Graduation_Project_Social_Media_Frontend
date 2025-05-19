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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import User from '../../../components/User';
import {useEffect, useRef, useState} from 'react';
import ItemHome from './components/ItemHome';
import ModalShare from './components/ModalShare';

const Home = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const isFocused = useIsFocused();

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

  // const [currentPost, setCurrentPost] = useState<any>(null);

  // data mẫu
  const posts = [
    {
      id: '0',
      uriVideo:
        'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746957530/my_video/afezzsxayqcz9cpfbpsj.mp4',
      imgUser:
        'https://i.pinimg.com/736x/8c/71/92/8c7192c084765c076ef33024c0b34406.jpg',
      name: 'Xie',
      like: 27000,
      comment: 5,
      share: 27,
      title: 'Phép màu',
      date: '11/05/2025',
    },
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
      <FlashList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ItemHome
            {...item}
            isFocused={isFocused}
            currentVisible={currentVisible}
          />
        )}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewAbilityConfig}
        estimatedItemSize={100}
        ListHeaderComponent={
          <View style={{position: 'relative', height: 180}}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                position: 'absolute',
                top: 50,
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
            <Header
              icon={require('../../../assets/icon/logo_row.png')}
              iconQR={require('../../../assets/icon/qr.png')}
              iconNotify={require('../../../assets/icon/heart.png')}
              iconMessage={require('../../../assets/icon/message.png')}
              navigation={navigation}
            />
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
