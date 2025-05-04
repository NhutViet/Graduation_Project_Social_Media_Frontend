import {ScrollView, StyleSheet, View} from 'react-native';
import {Colors} from '../../assets/color/Colors';
import {useTheme} from '../util/ThemeContext';
import {FlashList} from '@shopify/flash-list';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import User from '../../components/User';
import {useRef, useState} from 'react';

const Home = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);

  const onViewRef = useRef(({viewableItems}: any) => {
    const videoItem = viewableItems.find(
      (item: {item: {type: string}}) => item.item.type === 'video',
    );
    if (videoItem) {
      setCurrentVisible(videoItem.item.id);
    } else {
      setCurrentVisible(null);
    }
  });

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 70,
  });

  const posts = [
    {
      id: '1',
      type: 'video',
      uri: 'https://www.w3schools.com/html/mov_bbb.mp4',
      caption: 'Check this out!',
    },
    {
      id: '2',
      type: 'image',
      uri: 'https://placekitten.com/400/300',
      caption: 'A cute cat 😺',
    },
    {
      id: '3',
      type: 'video',
      uri: 'https://www.w3schools.com/html/movie.mp4',
      caption: 'Another video!',
    },
  ];

  const dataUser = [
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
  ];

  return (
    <ScrollView>
      <View style={{backgroundColor: color.background}}>
        <Header
          icon={require('../../assets/icon/logo_row.png')}
          iconQR={require('../../assets/icon/qr.png')}
          iconNotify={require('../../assets/icon/heart.png')}
          iconMessage={require('../../assets/icon/message.png')}
          navigation={navigation}
        />
        <View style={{paddingLeft: 10}}>
          <FlashList
            data={dataUser}
            renderItem={({item}: any) => {
              return (
                <User
                  name={item.name}
                  image={item.image}
                  status={item.status}
                />
              );
            }}
            horizontal={true}
            estimatedItemSize={100}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </ScrollView>
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
