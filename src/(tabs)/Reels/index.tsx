import {
  ActivityIndicator,
  Image,
  Modal,
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
import {useCallback, useEffect, useRef, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Dimensions} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {fetchReelsWithMedia} from '../../../services/postRedux/postSlice';
import BottomSheetReels, {
  BottomSheetReelsRef,
} from './bottomSheet/reelBottomSheet';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Reels = () => {
  const isFocused = useIsFocused();
  const navigation: any = useNavigation();
  const {theme, toggleTheme} = useTheme();
  const color = Colors[theme];

  const sheetRef: any = useRef<BottomSheetReelsRef>(null);

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

  const [currentVisible, setCurrentVisible] = useState<string | null>(null);

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      const id = visibleItem?.item?._id;
      if (id) {
        setCurrentVisible(id);
      }
    }
  });

  // fetch api
  const dispatch = useDispatch<AppDispatch>();
  const {reels, loading} = useSelector((state: RootState) => state.post);

  useEffect(() => {
    dispatch(fetchReelsWithMedia());
  }, []);
  ///////////////////////////////

  const [modalVisible, setModalVisible] = useState(false);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color.background,
        }}>
        <ActivityIndicator size="large" color={color.text} />
      </SafeAreaView>
    );
  }

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
        data={reels}
        extraData={[currentVisible, isFocused]}
        renderItem={({item}: any) => {
          const shouldPlay = item?._id === currentVisible;
          return (
            <ReelsComponent
              {...item}
              isFocused={isFocused}
              currentVisible={shouldPlay}
              muted={false}
              showBottomSheet={() => {
                sheetRef?.current.open();
              }}
            />
          );
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        estimatedItemSize={height}
      />
      <BottomSheetReels ref={sheetRef} />
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
