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
import MessageItem from '../../../components/MessageItem';
import User from '../../../components/User';
import {useState} from 'react';

export const MessageBox = (props: any) => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = MessageBoxStyles(theme);
  const {onBack} = props;

  const data = [
    {
      id: '1',
      img: 'https://i.pinimg.com/736x/78/63/88/78638889824ef2f367cf2b40c63a860b.jpg',
      name: 'User 1',
      description: 'Hoạt động 3 tiếng trước',
    },
    {
      id: '2',
      img: 'https://i.pinimg.com/736x/65/98/6e/65986e43f1d5e157dd31b26ee1343508.jpg',
      name: 'User 2',
      description: 'Hoạt động 5 phút trước',
    },
    {
      id: '3',
      img: 'https://i.pinimg.com/736x/bf/d9/56/bfd9563b5a7277df5ca476b4e90a06cb.jpg',
      name: 'User 3',
      description: 'Hoat động 1 giờ trước',
    },
    {
      id: '4',
      img: 'https://i.pinimg.com/736x/08/ee/45/08ee454cf166587337c5e85f7a4c5c27.jpg',
      name: 'User 4',
      description: 'Hoat động 17 phút trước',
    },
    {
      id: '5',
      img: 'https://i.pinimg.com/736x/98/70/5f/98705fd420414eaba0f0c50416a46fef.jpg',
      name: 'User 5',
      description: 'Hoat động 9 giờ trước',
    },
    {
      id: '6',
      img: 'https://i.pinimg.com/736x/13/b2/17/13b21765f93fbdda132c3f056826e203.jpg',
      name: 'User 6',
      description: 'Hoat động 2 giờ trước',
    },
    {
      id: '7',
      img: 'https://i.pinimg.com/736x/8c/7a/b6/8c7ab636cfd256e220a1baf76ac06d4c.jpg',
      name: 'User 7',
      description: 'Hoat động 5 phút trước',
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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerBlock}>
          <TouchableOpacity
            style={styles.iconBlock}
            onPress={onBack}>
            <Image
              source={require('../../../assets/icon/left.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.name}>mimi11_o</Text>
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
            placeholder="Tìm kiếm tin nhắn"
            placeholderTextColor={color.text}
            style={{marginHorizontal: 10, color: color.text, height: 40}}
          />
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}>
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
          contentContainerStyle={{
            paddingRight: 10,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Text style={{color: color.text, fontWeight: '600'}}>Tin nhắn</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('PendingMessages')}>
          <Text style={{color: color.text}}>Tin nhắn đang chờ</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        <FlashList
          data={data}
          renderItem={({item}) => {
            return (
              <MessageItem
                img={item.img}
                name={item.name}
                description={item.description}
                isGroup={item.id == '2'}
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
