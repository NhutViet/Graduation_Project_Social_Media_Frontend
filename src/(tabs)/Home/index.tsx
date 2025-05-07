import {SafeAreaView, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {FlashList} from '@shopify/flash-list';
import Header from '../../../components/Header';
import {useNavigation} from '@react-navigation/native';
import User from '../../../components/User';
import {useEffect, useRef, useState} from 'react';
import ItemHome from '../../../components/ItemHome';

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

  // data mẫu
  const posts = [
    {
      id: '1',
      uriVideo:
        'https://firebasestorage.googleapis.com/v0/b/project-no1-daseinzumtode.appspot.com/o/video-phuc%2FDownload.mp4?alt=media&token=77311316-23f5-43da-bf98-ad67aec92965',
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
        'https://firebasestorage.googleapis.com/v0/b/project-no1-daseinzumtode.appspot.com/o/video-phuc%2FDownload%20(1).mp4?alt=media&token=bfbe4f47-58ed-4019-a168-25e50fc8d22e',
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
        'https://firebasestorage.googleapis.com/v0/b/project-no1-daseinzumtode.appspot.com/o/video-phuc%2FDownload%20(2).mp4?alt=media&token=eb34d2d2-e128-4df4-bf50-aa363e246a25',
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

  const [dataUser, setDataUser] = useState<any>([
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
    const exists = dataUser.some((user: any) => user.name === 'Tin của tôi');
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <FlashList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ItemHome {...item} currentVisible={currentVisible} />
        )}
        // pagingEnabled
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
                renderItem={({item}: any) => (
                  <User
                    name={item.name}
                    image={item.image}
                    status={item.status}
                  />
                )}
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
});
export default Home;
