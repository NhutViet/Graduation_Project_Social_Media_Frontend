import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReelsComponent from './components/reelsComponent';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useCallback, useRef, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Dimensions} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Reels = () => {
  const isFocused = useIsFocused();
  const navigation: any = useNavigation();
  const {theme, toggleTheme} = useTheme();

  const initialThemeRef = useRef<'light' | 'dark' | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (initialThemeRef.current === null) {
        initialThemeRef.current = theme;
      }
      if (theme !== 'dark') {
        toggleTheme();
      }
      return () => {
        if (initialThemeRef.current === 'light' && theme === 'dark') {
          toggleTheme();
        }
      };
    }, [theme]),
  );

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
      id: '0',
      url: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746957530/my_video/afezzsxayqcz9cpfbpsj.mp4',
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
      url: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718746/my_video/ncd28sjnze0wfaqti2hm.mp4',
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
      url: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746718987/my_video/aynip2pj7jchjfdddmot.mp4',
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
      url: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746719121/my_video/wfamwgeiy4eeibslfhjc.mp4',
      imgUser:
        'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
      name: 'User 2',
      like: 45096,
      comment: 22,
      share: 79,
      title: 'Video 3',
      date: '05/05/2025',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.rowContainer}>
          <Text style={styles.textHeader}>Reels</Text>
          <View style={styles.iconDownContainer}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/down.png')}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={require('../../../assets/icon/camera.png')}
          />
        </TouchableOpacity>
      </View>
      <FlashList
        data={posts}
        renderItem={({item}) => (
          <ReelsComponent
            {...item}
            isFocused={isFocused}
            currentVisible={currentVisible}
            muted={false}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewAbilityConfig}
        estimatedItemSize={height}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    width: width,
    top: 0,
    zIndex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.transparent,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginRight: 8,
  },
  iconDownContainer: {
    width: 12,
    height: 12,
  },
  iconContainer: {
    width: 20,
    height: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.dark.text,
  },
});

export default Reels;